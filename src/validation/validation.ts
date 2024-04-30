import {checkSchema, Schema, validationResult} from 'express-validator'
import {Codes, sendErrorResponse} from "../response/error";
export {validate, validateBody};

async function validate(request: any, response: any, next: any, schema: Schema, errorCode: string) {
    await checkSchema(schema, ["body"]).run(request)
    let validationError = validationResult(request).array()[0]
    validationError ? sendErrorResponse(response, errorCode, validationError.msg) : next();
}

async function validateBody(request: any, response: any, next: any) {
    const baseUrl: Path = request.url
    const schema = {
        method: {
            custom: {
                options: (value: string) => paths[baseUrl].includes(value)
            },
            errorMessage: "Invalid method."
        }
    }
    await validate(request, response, next, schema, Codes.InvalidMethod)
}

type Path = "/auth" | "/admin" | "/teach" | "/study"

const paths: Record<Path, string[]> = {
    "/auth": ["login", "logout"],
    "/admin": [],
    "/teach": [],
    "/study": []
}