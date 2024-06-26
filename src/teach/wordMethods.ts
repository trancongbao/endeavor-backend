import "scope-extensions-js";
import {endeavorDB} from "../databases/endeavorDB";
import {Word} from "../databases/endeavorDB";
import {sql, Updateable} from "kysely";
import {Schema} from "express-validator";
import {sendSuccessResponse} from "../response/success";
import {Codes, sendErrorResponse} from "../response/error";

export {RpcMethodName, rpcMethods}

type RpcMethodName = "createWord" | "searchWord";

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction, rpcMethodParamsSchema: Schema }> = {
    "createWord": {
        rpcMethod: createWord,
        rpcMethodParamsSchema: {}
    },
    "searchWord": {
        rpcMethod: searchWord,
        rpcMethodParamsSchema: {}
    }
}

function createWord(request: any, response: any) {
    return endeavorDB
        .insertInto("word")
        .values(request.body.params)
        .returningAll()
        .execute()
        .then(word => {
            sendSuccessResponse(response, word)
        })
        .catch(error => {
            console.log(error)
            sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
        })
}

async function searchWord(request: any, response: any) {
    return endeavorDB
        .selectFrom("word")
        .selectAll()
        .where(
            sql`to_tsvector(word)`,
            "@@",
            sql`to_tsquery(${request.body.params.searchTerm})`
        )
        .execute()
        .then(word => {
            console.log(word)
            sendSuccessResponse(response, word)
        })
        .catch(error => {
            console.log(error)
            sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
        })
}

function readWord({id}: {
    id: number
}) {
    return endeavorDB.selectFrom("word").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

function updateWord(word: Updateable<Word>) {
    return endeavorDB.updateTable("word").where("id", "=", word.id!!).set(word).returningAll().executeTakeFirstOrThrow();
}

function deleteWord({id}: {
    id: number
}) {
    return endeavorDB.deleteFrom("word").where("id", "=", id).returningAll().executeTakeFirstOrThrow();
}

function findWord() {
}

