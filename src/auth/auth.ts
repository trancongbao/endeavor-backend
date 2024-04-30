import {login} from "./login";
import {logout} from "./logout";
import {checkSchema, validationResult} from 'express-validator'
import {ResultWithContext} from "express-validator/src/chain/context-runner";

export {validateInput, auth};

async function validateInput(request: any, response: any, next: any) {
    const results: ResultWithContext[] = await checkSchema(
        {
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
        ["body"]
    ).run(request)

    let validationError = validationResult(request).array()[0]

    if (!results[0].isEmpty()) {

    }

    console.log(results)

    next()
}

function auth(request: { body: { method: Method } }, response: any) {
    methods[request.body.method](request, response)
}

const methods: Record<Method, CallableFunction> = {
    "login": login,
    "logout": logout
}

type Method = "login" | "logout";
