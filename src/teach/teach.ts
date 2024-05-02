import {courseRpcParamsSchemas, listAllCourses} from "./courseMethods";
import {Schema} from 'express-validator'
import {Codes} from "../response/error";
import {validate} from "../validation/validation";
import {lessonRpcParamsSchemas, createLesson} from "./lessonMethods";
import {wordRpcParamsSchemas, createWord, searchWord} from "./wordMethods";
import {addWordToCard, cardRpcParamsSchemas, createCard} from "./cardMethods";

export {rpcMethods, validateParams, teach};

type RpcMethodName = "listAllCourses" | "createLesson" | "createWord" | "searchWord"| "createCard" | "addWordToCard";

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction, rpcMethodParamsSchema: Schema }> = {
    "listAllCourses": {
        rpcMethod: listAllCourses,
        rpcMethodParamsSchema: courseRpcParamsSchemas["listAllCourses"]
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
    "addWordToCard": {
        rpcMethod: addWordToCard,
        rpcMethodParamsSchema: cardRpcParamsSchemas["addWordToCard"]
    }
}

async function validateParams(request: any, response: any, next: any) {
    await validate(request, response, next, rpcMethods[request.body.method as RpcMethodName].rpcMethodParamsSchema, Codes.Auth.InputValidationError)
}

function teach(request: { body: { method: RpcMethodName } }, response: any) {
    rpcMethods[request.body.method].rpcMethod(request, response)
}

