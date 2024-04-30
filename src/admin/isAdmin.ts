import {
    Codes,
    sendJsonRpcErrorResponse,
} from "../error/error";

export {isAdmin};

function isAdmin(request: any, response: any, next: any): void {
    if (request.session.userType == "admin") {
        next();
    } else {
        sendJsonRpcErrorResponse(
            response,
            Codes.Authz.AdminPrivilegeRequired,
            "Admin privilege required."
        )
    }
}
