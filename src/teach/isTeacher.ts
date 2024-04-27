import { JsonRpcErrorCodes, sendJsonRpcErrorResponse } from "../error/error";

export { isTeacher };

function isTeacher(request: any, response: any, next: any): void {
  if (request.user.userType == "TEACHER") {
    next();
  } else {
    sendJsonRpcErrorResponse(response, request.id, JsonRpcErrorCodes.Authorization_TeacherPrivilegeRequired);
  }
}
