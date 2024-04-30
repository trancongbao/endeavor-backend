export {sendErrorResponse, Codes};

function sendErrorResponse(response: any, code: string, message?: string, data?: any) {
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
        InvalidUserNameOrPassword: "Authn.InvalidUserNameOrPassword",
        UnexpectedError: "Authn.UnexpectedError",
    },
    Authz: {
        AdminPrivilegeRequired: "Authz.AdminPrivilegeRequired",
        TeacherPrivilegeRequired: "Authz.TeacherPrivilegeRequired",
        StudentPrivilegeRequired: "Authz.StudentPrivilegeRequired",
    }
}
