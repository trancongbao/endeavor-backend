import {login} from "./login";
import {logout} from "./logout";
import {checkSchema, Schema, validationResult} from 'express-validator'
import {Codes, sendErrorResponse} from "../error/error";

export {validateInput, auth};

async function validateInput(request: any, response: any, next: any) {
    await checkSchema(schemas[request.body.method as Method], ["body"]).run(request)
    let validationError = validationResult(request).array()[0]
    if (validationError) {
        sendErrorResponse(response, Codes.Authn.InputValidationError, validationError.msg)
    } else {
        next()
    }
}

function auth(request: { body: { method: Method } }, response: any) {
    methods[request.body.method](request, response)
}

const methods: Record<Method, CallableFunction> = {
    "login": login,
    "logout": logout
}

const schemas: Record<Method, Schema> = {
    "login": {
        'params.userType': {
            custom: {
                options: value => ["admin", "teacher", "student"].includes(value)
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
    },
    "logout": {}
}

type Method = "login" | "logout";
