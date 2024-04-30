import {courseRpcParamsSchemas, listAllCourses} from "./courseMethods";
import {Schema} from 'express-validator'
import {Codes} from "../response/error";
import {validate} from "../validation/validation";

export {rpcMethods, validateParams, teach};

type RpcMethodName = "listAllCourses";

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction, rpcMethodParamsSchema: Schema }> = {
    "listAllCourses": {
        rpcMethod: listAllCourses,
        rpcMethodParamsSchema: courseRpcParamsSchemas["listAllCourses"]
    }
}

async function validateParams(request: any, response: any, next: any) {
    await validate(request, response, next, rpcMethods[request.body.method as RpcMethodName].rpcMethodParamsSchema, Codes.Auth.InputValidationError)
}

function teach(request: { body: { method: RpcMethodName } }, response: any) {
    rpcMethods[request.body.method].rpcMethod(request, response)
}

