import {JSONRPC, JSONRPCID} from "json-rpc-2.0";
import endeavorDB, {Admin, Student, Teacher} from "../databases/endeavorDB";
import {JsonRpcErrorCodes, sendJsonRpcErrorResponse} from "../error/error";
import {checkSchema, validationResult} from 'express-validator'

export {validateInput, login};

function validateInput() {
    return checkSchema(
        {
            'params.userType': {
                custom: {
                    options: value => ["admin", "teacher", "student"].includes(value)
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
        },
        ["body"]
    )
}

function login(request: any, response: any) {
    let jsonRPCRequest = request.body
    let validationError = validationResult(request).array()[0]
    if (validationError) {
        return sendJsonRpcErrorResponse(
            jsonRPCRequest,
            response,
            JsonRpcErrorCodes.Authn.InputValidationError,
            validationError.msg
        )
    }

    let userType = jsonRPCRequest.params.userType
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

function queryUserFromDB(userTable: UserType, username: string, password: string): Promise<Admin[] | Teacher[] | Student[]> {
    return endeavorDB.selectFrom<UserType>(userTable)
        .selectAll()
        .where("username", "=", username)
        .where("password", "=", password)
        .execute()
}

type UserType = "admin" | "teacher" | "student"