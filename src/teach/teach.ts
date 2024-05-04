import {Schema} from 'express-validator'
import {Codes} from "../response/error";
import {validate} from "../validation/validation";
import {RpcMethodName as CourseRpcMethodName, rpcMethods as courseRpcMethods} from "./courseMethods";
import {RpcMethodName as LessonRpcMethodName, rpcMethods as lessonRpcMethods} from "./lessonMethods";
import {RpcMethodName as CardRpcMethodName, rpcMethods as cardRpcMethods} from "./cardMethods";
import {RpcMethodName as WordRpcMethodName, rpcMethods as wordRpcMethods} from "./wordMethods";

export {rpcMethods, validateParams, teach};

type RpcMethodName = CourseRpcMethodName | LessonRpcMethodName | CardRpcMethodName | WordRpcMethodName;

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction, rpcMethodParamsSchema: Schema }> = {
    ...courseRpcMethods,
    ...lessonRpcMethods,
    ...cardRpcMethods,
    ...wordRpcMethods
}

async function validateParams(request: any, response: any, next: any) {
    await validate(request, response, next, rpcMethods[request.body.method as RpcMethodName].rpcMethodParamsSchema, Codes.Auth.InputValidationError)
}

function teach(request: { body: { method: RpcMethodName } }, response: any) {
    rpcMethods[request.body.method].rpcMethod(request, response)
}

