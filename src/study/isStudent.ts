import {
    Codes,
    sendErrorResponse,
} from "../response/error";

export {isStudent};

function isStudent(request: any, response: any, next: any): void {
    if (request.user.userType == "student") {
        next();
    } else {
        sendErrorResponse(
            response,
            Codes.Study.StudentPrivilegeMissing,
            "Student privilege required."
        )
    }
}
