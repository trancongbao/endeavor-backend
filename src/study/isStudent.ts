import {
    JsonRpcErrorCodes,
    sendJsonRpcErrorResponse,
} from "../error/error";

export {isStudent};

function isStudent(request: any, response: any, next: any): void {
    if (request.user.userType == "student") {
        next();
    } else {
        sendJsonRpcErrorResponse(
            request.body,
            response,
            JsonRpcErrorCodes.Authz.StudentPrivilegeRequired,
            "Student privilege required."
        )
    }
}
