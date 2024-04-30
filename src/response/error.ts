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
    Auth: {
        InputValidationError: "Auth.InputValidationError",
        Login: {
            InvalidUserNameOrPassword: "Auth.Login.InvalidUserNameOrPassword",
            UnexpectedError: "Auth.Login.UnexpectedError",
        },
        Logout: {
            UnexpectedError: "Auth.Logout.UnexpectedError"
        }
    },
    Admin: {
        AdminPrivilegeMissing: "Admin.AdminPrivilegeMissing"
    },
    Teach: {
        TeacherPrivilegeMissing: "Teach.TeacherPrivilegeMissing"
    },
    Study: {
        StudentPrivilegeMissing: "Study.StudentPrivilegeMissing"
    }
}
