import "scope-extensions-js";
import {endeavorDB} from "../databases/endeavorDB";
import {Card} from "../databases/endeavorDB";
import {Updateable} from "kysely";
import {Schema} from "express-validator";
import {sendSuccessResponse} from "../response/success";
import {Codes, sendErrorResponse} from "../response/error";
import {encode} from 'html-entities';

export {RpcMethodName, rpcMethods}

type RpcMethodName = "createCard" | "addWordsToCard" | "getCards";

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction, rpcMethodParamsSchema: Schema }> = {
    "createCard": {
        rpcMethod: createCard,
        rpcMethodParamsSchema: {}
    },
    "addWordsToCard": {
        rpcMethod: addWordsToCard,
        rpcMethodParamsSchema: {}
    },
    "getCards": {
        rpcMethod: getCards,
        rpcMethodParamsSchema: {}
    }
}

function createCard(request: any, response: any) {
    request.body.params.front_text = encode(request.body.params.front_text)
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

function getCards(request: any, response: any) {
    return endeavorDB
        .selectFrom("teacher_course")
        .where("teacher_course.teacher_username", "=", request.session.userInfo.username)
        .innerJoin("course", "course.id", "teacher_course.course_id")
        .innerJoin("lesson", "lesson.course_id", "course.id")
        .where("lesson.id", "=", request.body.params.id)
        .innerJoin("card", "card.lesson_id", "lesson_id")
        .select(["card.id", "card.card_order as order", "card.front_text as text"])
        .execute()
        .then((cards) => {
            sendSuccessResponse(response, cards)
        })
        .catch(error => {
            console.log(error)
            sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
        })
}
