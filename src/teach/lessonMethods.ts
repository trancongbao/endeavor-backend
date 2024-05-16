import "scope-extensions-js";
import {endeavorDB} from "../databases/endeavorDB";
import {Lesson} from "../databases/endeavorDB";
import {Updateable} from "kysely";
import {sendSuccessResponse} from "../response/success";
import {Codes, sendErrorResponse} from "../response/error";
import {Schema} from "express-validator";
import SQL from 'sql-template-strings';
import {query} from "../databases/postgres";

export {RpcMethodName, rpcMethods}

type RpcMethodName = "createLesson";

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction, rpcMethodParamsSchema: Schema }> = {
    "createLesson": {
        rpcMethod: createLesson,
        rpcMethodParamsSchema: {}
    }
}

async function createLesson(request: any, response: any) {
    const {course_id, lesson_order, title, audio, summary, description, thumbnail, content} = request.body.params
    const sql = SQL`INSERT INTO lesson (course_id, lesson_order, title, audio, summary, description, thumbnail,
                                        content)
                    SELECT ${course_id},
                           ${lesson_order},
                           ${title},
                           ${audio},
                           ${summary},
                           ${description},
                           ${thumbnail},
                           ${content}
                    WHERE EXISTS          (SELECT 1
                                           FROM teacher_course
                                           WHERE teacher_username = ${request.session.userInfo.username}
                                             AND course_id = ${course_id})
                    RETURNING *;`

    try {
        sendSuccessResponse(response, (await query(sql)).rows[0])
    } catch (error: any) {
        sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
    }
}

export function readLesson({id}: { id: number }) {
    return endeavorDB.selectFrom("lesson").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

export function updateLesson(lesson: Updateable<Lesson>) {
    return endeavorDB
        .updateTable("lesson")
        .where("id", "=", lesson.id!!)
        .set(lesson)
        .returningAll()
        .executeTakeFirstOrThrow();
}

export function deleteLesson({id}: { id: number }) {
    return endeavorDB.deleteFrom("lesson").where("id", "=", id).returningAll().executeTakeFirstOrThrow();
}

