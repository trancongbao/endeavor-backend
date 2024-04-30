import {
    Codes,
    sendErrorResponse,
} from "../error/error";

export {isStudent};

function isStudent(request: any, response: any, next: any): void {
    if (request.user.userType == "student") {
        next();
    } else {
        sendErrorResponse(
            response,
            Codes.Authz.StudentPrivilegeRequired,
            "Student privilege required."
        )
    }
}
