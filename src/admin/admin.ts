import {paramsSchema as createCourseParamsSchema, createCourse} from "./courseMethods";
import {paramsSchema as loginParamsSchema, createTeacher} from "./teacherMethods";
import {Schema} from 'express-validator'
import {Codes} from "../response/error";
import {validate} from "../validation/validation";

export {methods, validateParams, admin};

const methods: Record<Method, { method: CallableFunction, schema: Schema }> = {
    "createTeacher": {
        method: createTeacher,
        schema: loginParamsSchema
    },
    "createCourse": {
        method: createCourse,
        schema: createCourseParamsSchema
    }
}

async function validateParams(request: any, response: any, next: any) {
    await validate(request, response, next, methods[request.body.method as Method].schema, Codes.Auth.InputValidationError)
}

function admin(request: { body: { method: Method } }, response: any) {
    methods[request.body.method].method(request, response)
}

type Method = "createTeacher" | "createCourse";