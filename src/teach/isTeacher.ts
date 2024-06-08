import {
    Codes,
    sendErrorResponse,
} from "../response/error";

export {isTeacher};

function isTeacher(request: any, response: any, next: any): void {
    if (request.session.userInfo?.userType === "teacher") {
        next();
    } else {
        sendErrorResponse(
            response,
            Codes.Teach.TeacherPrivilegeMissing,
            "Teacher privilege required."
        )
    }
}
