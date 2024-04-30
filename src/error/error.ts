import {createJSONRPCErrorResponse} from "json-rpc-2.0";

export {sendJsonRpcErrorResponse, Codes, sendJsonRpcErrorResponse1};

function sendJsonRpcErrorResponse(jsonRPCRequest: any, response: any, code: number, message: string, data?: any) {
    response.json(createJSONRPCErrorResponse(jsonRPCRequest.id, code, message, data !== undefined ? data : jsonRPCRequest.params));
}

function sendJsonRpcErrorResponse1(response: any, code: string, message?: string, data?: any) {
    response.json({
        error: {
            code: code,
            message: message,
            data: data
        }
    })
}

const Codes = {
    Authn: {
        InputValidationError: "Authn.InputValidationError",
        InvalidUserNameOrPassword: -33001,
        UnexpectedError: -33002
    },
    Authz: {
        AdminPrivilegeRequired: -33010,
        TeacherPrivilegeRequired: -33011,
        StudentPrivilegeRequired: -33012
    }
}
