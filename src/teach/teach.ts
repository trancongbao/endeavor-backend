import {courseRpcParamsSchemas, listAllCourses, getMyDecks} from "./courseMethods";
import {Schema} from 'express-validator'
import {Codes} from "../response/error";
import {validate} from "../validation/validation";
import {lessonRpcParamsSchemas, createLesson} from "./lessonMethods";
import {wordRpcParamsSchemas, createWord, searchWord} from "./wordMethods";
import {addWordsToCard, cardRpcParamsSchemas, createCard} from "./cardMethods";
import {RpcMethodNames as CourseRpcMethodNames} from "./courseMethods";
import {RpcMethodNames as LessonRpcMethodNames} from "./lessonMethods";
import {RpcMethodNames as CardRpcMethodNames} from "./cardMethods";
import {RpcMethodNames as WordRpcMethodNames} from "./wordMethods";

export {rpcMethods, validateParams, teach};

type RpcMethodName = CourseRpcMethodNames | LessonRpcMethodNames | CardRpcMethodNames | WordRpcMethodNames;

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction, rpcMethodParamsSchema: Schema }> = {
    "listAllCourses": {
        rpcMethod: listAllCourses,
        rpcMethodParamsSchema: courseRpcParamsSchemas["listAllCourses"]
    },
    "getMyDecks": {
        rpcMethod: getMyDecks,
        rpcMethodParamsSchema: courseRpcParamsSchemas["getMyDecks"]
    },
    "createLesson": {
        rpcMethod: createLesson,
        rpcMethodParamsSchema: lessonRpcParamsSchemas["createLesson"]
    },
    "createWord": {
        rpcMethod: createWord,
        rpcMethodParamsSchema: wordRpcParamsSchemas["createWord"]
    },
    "searchWord": {
        rpcMethod: searchWord,
        rpcMethodParamsSchema: wordRpcParamsSchemas["searchWord"]
    },
    "createCard": {
        rpcMethod: createCard,
        rpcMethodParamsSchema: cardRpcParamsSchemas["createCard"]
    },
    "addWordsToCard": {
        rpcMethod: addWordsToCard,
        rpcMethodParamsSchema: cardRpcParamsSchemas["addWordsToCard"]
    }
}

async function validateParams(request: any, response: any, next: any) {
    await validate(request, response, next, rpcMethods[request.body.method as RpcMethodName].rpcMethodParamsSchema, Codes.Auth.InputValidationError)
}

function teach(request: { body: { method: RpcMethodName } }, response: any) {
    rpcMethods[request.body.method].rpcMethod(request, response)
}

