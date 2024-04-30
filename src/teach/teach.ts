import {courseRpcParamsSchemas, listAllCourses} from "./courseMethods";
import {Schema} from 'express-validator'
import {Codes} from "../response/error";
import {validate} from "../validation/validation";
import {createLesson, lessonRpcParamsSchemas} from "./lessonMethods";

export {rpcMethods, validateParams, teach};

type RpcMethodName = "listAllCourses" | "createLesson";

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction, rpcMethodParamsSchema: Schema }> = {
    "listAllCourses": {
        rpcMethod: listAllCourses,
        rpcMethodParamsSchema: courseRpcParamsSchemas["listAllCourses"]
    },
    "createLesson": {
        rpcMethod: createLesson,
        rpcMethodParamsSchema: lessonRpcParamsSchemas["createLesson"]
    }
}

async function validateParams(request: any, response: any, next: any) {
    await validate(request, response, next, rpcMethods[request.body.method as RpcMethodName].rpcMethodParamsSchema, Codes.Auth.InputValidationError)
}

function teach(request: { body: { method: RpcMethodName } }, response: any) {
    rpcMethods[request.body.method].rpcMethod(request, response)
}

