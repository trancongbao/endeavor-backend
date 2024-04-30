import {courseRpcParamsSchema, createCourse, assignCourse} from "./courseMethods";
import {paramsSchema as createTeacherParamsSchema, createTeacher} from "./teacherMethods";
import {Schema} from 'express-validator'
import {Codes} from "../response/error";
import {validate} from "../validation/validation";

export {methods, validateParams, admin};

const methods: Record<Method, { method: CallableFunction, schema: Schema }> = {
    "createTeacher": {
        method: createTeacher,
        schema: createTeacherParamsSchema
    },
    "createCourse": {
        method: createCourse,
        schema: courseRpcParamsSchema["createCourse"]
    },
    "assignCourse": {
        method: assignCourse,
        schema: courseRpcParamsSchema["assignCourse"]
    }
}

async function validateParams(request: any, response: any, next: any) {
    await validate(request, response, next, methods[request.body.method as Method].schema, Codes.Auth.InputValidationError)
}

function admin(request: { body: { method: Method } }, response: any) {
    methods[request.body.method].method(request, response)
}

type Method = "createTeacher" | "createCourse" | "assignCourse";
