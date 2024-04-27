import { JsonRpcErrorCodes, sendJsonRpcErrorResponse } from "../error/error";

export { isStudent };

function isStudent(request: any, response: any, next: any): void {
  if (request.user.userType == "STUDENT") {
    next();
  } else {
    sendJsonRpcErrorResponse(response, request.id, JsonRpcErrorCodes.Authorization_StudentPrivilegeRequired);
  }
}
