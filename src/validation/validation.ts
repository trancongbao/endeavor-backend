import {checkSchema, Schema, validationResult} from 'express-validator'
import {Codes, sendErrorResponse} from "../response/error";
import {methods as authMethods} from "../auth/auth";
import {rpcMethods as adminMethods} from "../admin/admin";

export {validate, validateBody};

async function validate(request: any, response: any, next: any, schema: Schema, errorCode: string) {
    await checkSchema(schema, ["body"]).run(request)
    let validationError = validationResult(request).array()[0]
    validationError ? sendErrorResponse(response, errorCode, validationError.msg) : next();
}

async function validateBody(request: any, response: any, next: any) {
    const paths: Record<Path, any> = {
        "/auth": authMethods,
        "/admin": adminMethods,
        "/teach": authMethods,
        "/study": authMethods
    }

    const schema = {
        method: {
            custom: {
                options: (value: string) => Object.keys(paths[request.url as Path]).includes(value)
            },
            errorMessage: "Invalid method."
        }
    }
    await validate(request, response, next, schema, Codes.InvalidRpcMethod)
}

type Path = "/auth" | "/admin" | "/teach" | "/study"
