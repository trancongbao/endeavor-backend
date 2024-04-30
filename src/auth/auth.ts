import {paramsSchema as loginParamsSchema, login} from "./login";
import {paramsSchema as logoutParamsSchema, logout} from "./logout";
import {checkSchema, Schema, validationResult} from 'express-validator'
import {Codes, sendErrorResponse} from "../response/error";

export {validateInput, auth};

async function validateInput(request: any, response: any, next: any) {
    await checkSchema(methods[request.body.method as Method].schema, ["body"]).run(request)
    let validationError = validationResult(request).array()[0]
    validationError ? sendErrorResponse(response, Codes.Authn.InputValidationError, validationError.msg) : next();
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
