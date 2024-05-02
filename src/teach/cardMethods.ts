import "scope-extensions-js";
import {endeavorDB} from "../databases/endeavorDB";
import {Card} from "../databases/endeavorDB";
import {Updateable} from "kysely";
import {Schema} from "express-validator";
import {sendSuccessResponse} from "../response/success";
import {Codes, sendErrorResponse} from "../response/error";

export {cardRpcParamsSchemas, createCard, addWordsToCard}

function createCard(request: any, response: any) {
    return endeavorDB
        .insertInto("card")
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

function readCard({id}: { id: number }) {
    return endeavorDB.selectFrom("card").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

function updateCard(card: Updateable<Card>) {
    return endeavorDB.updateTable("card").where("id", "=", card.id!!).set(card).returningAll().executeTakeFirstOrThrow();
}

function deleteCard({id}: { id: number }) {
    return endeavorDB.deleteFrom("card").where("id", "=", id).returningAll().executeTakeFirstOrThrow();
}

function addWordsToCard(request: any, response: any) {
    return endeavorDB
        .insertInto("card_word")
        .values(
            request.body.params.words.map((word: { id: number, order: number }) => {
                return {
                    card_id: request.body.params.card_id,
                    word_id: word.id,
                    word_order: word.order
                }
            })
        )
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

type RpcMethodNames = "createCard" | "addWordsToCard";

const cardRpcParamsSchemas: Record<RpcMethodNames, Schema> = {
    "createCard": {},
    "addWordsToCard": {}
};