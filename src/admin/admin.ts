import { RpcMethodName as CourseRpcMethodName, rpcMethods as courseRpcMethods } from "./courseMethods";
import { RpcMethodName as TeacherRpcMethodName, rpcMethods as teacherRpcMethods } from "./teacherMethods";
import { Schema } from "express-validator";
import { Codes } from "../response/error";
import { validate } from "../validation/validation";

export { rpcMethods, validateParams, admin };

type RpcMethodName = CourseRpcMethodName | TeacherRpcMethodName;

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction; rpcMethodParamsSchema: Schema }> = {
  ...courseRpcMethods,
  ...teacherRpcMethods,
};

async function validateParams(request: any, response: any, next: any) {
  await validate(
    request,
    response,
    next,
    rpcMethods[request.body.method as RpcMethodName].rpcMethodParamsSchema,
    Codes.Auth.InputValidationError
  );
}

function admin(request: { body: { method: RpcMethodName } }, response: any) {
  rpcMethods[request.body.method].rpcMethod(request, response);
}
