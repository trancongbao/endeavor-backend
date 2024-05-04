import "scope-extensions-js";
import {endeavorDB} from "../databases/endeavorDB";
import {Lesson} from "../databases/endeavorDB";
import {Updateable} from "kysely";
import {sendSuccessResponse} from "../response/success";
import {Codes, sendErrorResponse} from "../response/error";
import {Schema} from "express-validator";

export {RpcMethodNames, lessonRpcParamsSchemas, createLesson}

type RpcMethodNames = "createLesson";

const lessonRpcParamsSchemas: Record<RpcMethodNames, Schema> = {
    "createLesson": {}
};

function createLesson(request: any, response: any) {
    return endeavorDB
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

