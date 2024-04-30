import {checkSchema, Schema, validationResult} from 'express-validator'
import {sendErrorResponse} from "../response/error";

export {validate};

async function validate(request: any, response: any, next: any, schema: Schema, errorCode: string) {
    await checkSchema(schema, ["body"]).run(request)
    let validationError = validationResult(request).array()[0]
    validationError ? sendErrorResponse(response, errorCode, validationError.msg) : next();
}