import {createJSONRPCErrorResponse} from "json-rpc-2.0";

export {sendJsonRpcErrorResponse, JsonRpcErrorCodes};

function sendJsonRpcErrorResponse(jsonRPCRequest: any, response: any, code: number, message: string, data?: any) {
    response.json(createJSONRPCErrorResponse(jsonRPCRequest.id, code, message, data !== undefined ? data : jsonRPCRequest.params));
}

const JsonRpcErrorCodes = {
    Authn: {
        InvalidUserType: -33000,
        InvalidUserNameOrPassword: -33001,
        UnexpectedError: -33002
    },
    Authz: {
        AdminPrivilegeRequired: -33010,
        TeacherPrivilegeRequired: -33011,
        StudentPrivilegeRequired: -33012
    }
}
