import {
    JsonRpcErrorCodes,
    sendJsonRpcErrorResponse,
} from "../error/error";

export {isAdmin};

function isAdmin(request: any, response: any, next: any): void {
    if (request.session.userType == "admin") {
        next();
    } else {
        sendJsonRpcErrorResponse(
            request.body,
            response,
            JsonRpcErrorCodes.Authz.AdminPrivilegeRequired,
            "Admin privilege required."
        )
    }
}
