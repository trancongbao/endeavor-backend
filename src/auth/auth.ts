import {paramsSchema as loginParamsSchema, login} from "./login";
import {paramsSchema as logoutParamsSchema, logout} from "./logout";
import {Schema} from 'express-validator'
import {Codes} from "../response/error";
import {validate} from "../validation/validation";

export {methods, validateParams, auth};

const methods: Record<Method, { method: CallableFunction, schema: Schema }> = {
    "login": {
        method: login,
        schema: loginParamsSchema
    },
    "logout": {
        method: logout,
        schema: logoutParamsSchema
    }
}

async function validateParams(request: any, response: any, next: any) {
    await validate(request, response, next, methods[request.body.method as Method].schema, Codes.Auth.InputValidationError)
}

function auth(request: { body: { method: Method } }, response: any) {
    methods[request.body.method].method(request, response)
}

type Method = "login" | "logout";
