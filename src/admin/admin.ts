import {courseRpcParamsSchemas, createCourse, assignCourse} from "./courseMethods";
import {paramsSchema as createTeacherParamsSchema, createTeacher} from "./teacherMethods";
import {Schema} from 'express-validator'
import {Codes} from "../response/error";
import {validate} from "../validation/validation";

export {rpcMethods, validateParams, admin};

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction, rpcMethodParamsSchema: Schema }> = {
    "createTeacher": {
        rpcMethod: createTeacher,
        rpcMethodParamsSchema: createTeacherParamsSchema
    },
    "createCourse": {
        rpcMethod: createCourse,
        rpcMethodParamsSchema: courseRpcParamsSchemas["createCourse"]
    },
    "assignCourse": {
        rpcMethod: assignCourse,
        rpcMethodParamsSchema: courseRpcParamsSchemas["assignCourse"]
    }
}

async function validateParams(request: any, response: any, next: any) {
    await validate(request, response, next, rpcMethods[request.body.method as RpcMethodName].rpcMethodParamsSchema, Codes.Auth.InputValidationError)
}

function admin(request: { body: { method: RpcMethodName } }, response: any) {
    rpcMethods[request.body.method].rpcMethod(request, response)
}

type RpcMethodName = "createTeacher" | "createCourse" | "assignCourse";
