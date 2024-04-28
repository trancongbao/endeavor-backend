import {
    JsonRpcErrorCodes,
    sendJsonRpcErrorResponse,
} from "../error/error";

export {isTeacher};

function isTeacher(request: any, response: any, next: any): void {
    if (request.session.userType == "teacher") {
        next();
    } else {
        sendJsonRpcErrorResponse(
            request.body,
            response,
            JsonRpcErrorCodes.Authz.TeacherPrivilegeRequired,
            "Teacher privilege required."
        )
    }
}
