import {endeavorDB, Admin, Student, Teacher} from "../databases/endeavorDB";
import {Codes, sendErrorResponse} from "../response/error";

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
    queryUserFromDB(userType, username, password)
        .then((users) => {
            if (users.length) {
                const {password, ...userInfo} = users[0]; // Remove the password field
                /**
                 * Add authenticated session data
                 */
                request.session.userType = userType
                request.session.userInfo = userInfo

                return response.json({
                    result: {
                        userType: userType,
                        userInfo: userInfo
                    }
                })
            } else {
                return sendErrorResponse(
                    response,
                    Codes.Authn.InvalidUserNameOrPassword,
                    "Invalid username or password."
                )
            }
        })
        .catch((error) => {
            return sendErrorResponse(
                response,
                Codes.Authn.UnexpectedError,
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