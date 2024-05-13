import "scope-extensions-js";
import {endeavorDB} from "../databases/endeavorDB";
import {Lesson} from "../databases/endeavorDB";
import {Updateable} from "kysely";
import {sendSuccessResponse} from "../response/success";
import {Codes, sendErrorResponse} from "../response/error";
import {Schema} from "express-validator";
import SQL from 'sql-template-strings';
import {pg, pgp} from "../databases/postgres";

export {RpcMethodName, rpcMethods}

type RpcMethodName = "createLesson";

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction, rpcMethodParamsSchema: Schema }> = {
    "createLesson": {
        rpcMethod: createLesson,
        rpcMethodParamsSchema: {}
    }
}

async function createLesson(request: any, response: any) {
    const lessonId = 1

    const template = SQL`SELECT *
                         FROM lesson
                         WHERE id = ${lessonId}`

    console.log("template", template)

    const res = await pg.query(template)
    console.log("res: ", res.rows)

    pg.query(SQL`        SELECT id
                         FROM lesson
                         WHERE id = ${lessonId}`)
        .then((r) =>
            console.log("result: ", r)
        )
        .catch((e) =>
            console.log("error", e)
        )

    endeavorDB
        .insertInto("lesson")
        .values(request.body.params)
        .returningAll()
        .execute()
        .then(course => {
            sendSuccessResponse(response, course)
        })
        .catch(error => {
            console.log(error)
            sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
        })
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

