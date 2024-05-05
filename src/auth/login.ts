import {endeavorDB, Admin, Student, Teacher} from "../databases/endeavorDB";
import {Codes, sendErrorResponse} from "../response/error";
import {sendSuccessResponse} from "../response/success";

export {paramsSchema, login};

const paramsSchema = {
    'params.userType': {
        custom: {
            options: (value: string) => ["admin", "teacher", "student"].includes(value)
        },
        errorMessage: 'Invalid userType.',
    },
    'params.username': {
        isString: {bail: true},
        notEmpty: {bail: true},
        errorMessage: 'Invalid username.'
    },
    'params.password': {
        isString: {bail: true},
        notEmpty: {bail: true},
        errorMessage: 'Invalid password.'
    }
}

function login(request: any, response: any) {
    const {userType, username, password} = request.body.params

    if (userType === "admin") {
        if ((username === process.env.ADMIN_USERNAME) && (password === process.env.ADMIN_PASSWORD)) {
            /**
             * Add authenticated session data
             */
            request.session.userInfo = {
                userType: userType,
                username: username
            }
            return sendSuccessResponse(response, request.session.userInfo)
        } else {
            return sendErrorResponse(
                response,
                Codes.Auth.Login.InvalidUserNameOrPassword,
                "Invalid username or password."
            )
        }
    }

    queryUserFromDB(userType, username, password)
        .then((users) => {
            if (users.length) {
                /**
                 * Add authenticated session data
                 */
                request.session.userInfo = {
                    userType: userType,
                    username: username
                }
                return sendSuccessResponse(response, request.session.userInfo)
            } else {
                return sendErrorResponse(
                    response,
                    Codes.Auth.Login.InvalidUserNameOrPassword,
                    "Invalid username or password."
                )
            }
        })
        .catch((error) => {
            return sendErrorResponse(
                response,
                Codes.Auth.Login.UnexpectedError,
                `An unexpected error occurred: ${error}`,
            )
        })
}

function queryUserFromDB(userTable: UserType, username: string, password: string): Promise<Admin[] | Teacher[] | Student[]> {
    return endeavorDB.selectFrom<UserType>(userTable)
        .selectAll()
        .where("username", "=", username)
        .where("password", "=", password)
        .execute()
}

type UserType = "admin" | "teacher" | "student"