import {paramsSchema as loginParamsSchema, login} from "./login";
import {paramsSchema as logoutParamsSchema, logout} from "./logout";
import {Schema} from 'express-validator'
import {Codes} from "../response/error";
import {validate} from "../validation/validation";

export {validateBody, validateParams, auth};

async function validateBody(request: any, response: any, next: any) {
    const schema = {
        method: {
            isString: true,
            errorMessage: "Invalid method."
        }
    }
    await validate(request, response, next, schema, Codes.InvalidMethod)
}

async function validateParams(request: any, response: any, next: any) {
    await validate(request, response, next, methods[request.body.method as Method].schema, Codes.Auth.InputValidationError)
}

function auth(request: { body: { method: Method } }, response: any) {
    methods[request.body.method].method(request, response)
}

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

type Method = "login" | "logout";
