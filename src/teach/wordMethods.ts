import "scope-extensions-js";
import {endeavorDB} from "../databases/endeavorDB";
import {Word} from "../databases/endeavorDB";
import {Insertable, Updateable} from "kysely";
import {Schema} from "express-validator";

export {wordRpcParamsSchemas, createWord}

function createWord(request: any, response: any) {
    return endeavorDB
        .insertInto("word")
        .values(request.body.params)
        .returningAll()
        .executeTakeFirstOrThrow();
}

function readWord({id}: { id: number }) {
    return endeavorDB.selectFrom("word").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

function updateWord(word: Updateable<Word>) {
    return endeavorDB.updateTable("word").where("id", "=", word.id!!).set(word).returningAll().executeTakeFirstOrThrow();
}

function deleteWord({id}: { id: number }) {
    return endeavorDB.deleteFrom("word").where("id", "=", id).returningAll().executeTakeFirstOrThrow();
}

function findWord() {
}

type RpcMethodNames = "createWord";

const wordRpcParamsSchemas: Record<RpcMethodNames, Schema> = {
    "createWord": {}
};