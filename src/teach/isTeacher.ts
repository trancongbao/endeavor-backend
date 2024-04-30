import {
    Codes,
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
            Codes.Authz.TeacherPrivilegeRequired,
            "Teacher privilege required."
        )
    }
}
