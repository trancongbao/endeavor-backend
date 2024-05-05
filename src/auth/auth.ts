import {paramsSchema as loginParamsSchema, login} from "./login";
import {paramsSchema as currentUserParamsSchema, currentUser} from "./currentUser";
import {paramsSchema as logoutParamsSchema, logout} from "./logout";
import {Schema} from 'express-validator'
import {Codes} from "../response/error";
import {validate} from "../validation/validation";

export {rpcMethods, validateParams, auth};

type RpcMethodName = "login" | "logout" | "currentUser";

const rpcMethods: Record<RpcMethodName, { method: CallableFunction, schema: Schema }> = {
    "login": {
        method: login,
        schema: loginParamsSchema
    },
    "currentUser": {
        method: currentUser,
        schema: currentUserParamsSchema
    },
    "logout": {
        method: logout,
        schema: logoutParamsSchema
    }
}

async function validateParams(request: any, response: any, next: any) {
    await validate(request, response, next, rpcMethods[request.body.method as RpcMethodName].schema, Codes.Auth.InputValidationError)
}

function auth(request: { body: { method: RpcMethodName } }, response: any) {
    rpcMethods[request.body.method].method(request, response)
}

