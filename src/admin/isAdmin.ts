import {
    Codes,
    sendErrorResponse,
} from "../error/error";

export {isAdmin};

function isAdmin(request: any, response: any, next: any): void {
    if (request.session.userType == "admin") {
        next();
    } else {
        sendErrorResponse(
            response,
            Codes.Authz.AdminPrivilegeRequired,
            "Admin privilege required."
        )
    }
}
