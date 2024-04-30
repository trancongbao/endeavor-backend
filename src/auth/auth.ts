import {login} from "./login";
import {logout} from "./logout";
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
        schema: {
            'params.userType': {
                custom: {
                    options: (value: string) => ["admin", "teacher", "student"].includes(value)
                },
                errorMessage: 'Invalid userType.',
            },
            'params.username': {
                isString: {bail: true},
                notEmpty: {bail: true},
                errorMessage: 'Invalid username.'
            },
            'params.password': {
                isString: {bail: true},
                notEmpty: {bail: true},
                errorMessage: 'Invalid password.'
            }
        }
    },
    "logout": {
        method: logout,
        schema: {}
    }
}

type Method = "login" | "logout";
