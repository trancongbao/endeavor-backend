import {JSONRPC, JSONRPCID} from "json-rpc-2.0";
import endeavorDB, {Admin, Student, Teacher} from "../databases/endeavorDB";
import {JsonRpcErrorCodes, sendJsonRpcErrorResponse} from "../error/error";
import {checkSchema, validationResult} from 'express-validator'

export {validateInput, login};

function validateInput() {
    return checkSchema(
        {
            'params.userType': {
                isString: true,
                notEmpty: true,
                errorMessage: 'Invalid userType.',
            }
        },
        ["body"]
    )
}

function login(request: any, response: any) {
    let validation = validationResult(request)
    console.log(validation)

    let jsonRPCRequest = request.body
    let userType = jsonRPCRequest.params.userType

    if (!isUserType(userType)) {
        return sendJsonRpcErrorResponse(
            jsonRPCRequest,
            response,
            JsonRpcErrorCodes.Authn.InvalidUserType,
            `Invalid userType: ${userType}`
        )
    }

    queryUserFromDB(userType, jsonRPCRequest.params.username, jsonRPCRequest.params.password)
        .then((users) => {
                if (users.length) {
                    const {password, ...userInfo} = users[0]; // Remove the password field
                    /**
                     * Add authenticated session data
                     */
                    request.session.userType = userType
                    request.session.userInfo = userInfo

                    return response.json({
                        jsonrpc: JSONRPC,
                        id: jsonRPCRequest.id as JSONRPCID,
                        result: {
                            userType: userType,
                            userInfo: userInfo
                        },
                    })
                } else {
                    return sendJsonRpcErrorResponse(
                        jsonRPCRequest,
                        response,
                        JsonRpcErrorCodes.Authn.InvalidUserNameOrPassword,
                        "Invalid username or password."
                    )
                }
            }
        )
        .catch((error) => {
            return sendJsonRpcErrorResponse(
                jsonRPCRequest,
                response,
                JsonRpcErrorCodes.Authn.UnexpectedError,
                `An unexpected error occurred: ${error}`,
            )
        })
}

function isUserType(userType: any): userType is UserType {
    return ["admin", "teacher", "student"].includes(userType)
}

function queryUserFromDB(userTable: UserType, username: string, password: string): Promise<Admin[] | Teacher[] | Student[]> {
    return endeavorDB.selectFrom<UserType>(userTable)
        .selectAll()
        .where("username", "=", username)
        .where("password", "=", password)
        .execute()
}

type UserType = "admin" | "teacher" | "student"