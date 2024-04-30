import {login} from "./login";
import {logout} from "./logout";
import {checkSchema, Schema, validationResult} from 'express-validator'
import {ResultWithContext} from "express-validator/src/chain/context-runner";

export {validateInput, auth};

async function validateInput(request: any, response: any, next: any) {
    const results: ResultWithContext[] = await checkSchema(schemas[request.body.method as Method], ["body"]).run(request)
    console.log(results)

    let validationError = validationResult(request).array()[0]
    if (validationError) {
        console.log(validationError.msg)
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
