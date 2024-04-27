import {JSONRPC, JSONRPCID} from "json-rpc-2.0";
import endeavorDB, {Admin, Student, Teacher} from "../databases/endeavorDB";

export {login};

function login(request: any, response: any) {
    let jsonRPCRequest = request.body
    let userType = jsonRPCRequest.params.userType

    if (!isUserType(userType)) {
        response.json({
            jsonrpc: JSONRPC,
            id: jsonRPCRequest.id as JSONRPCID,
            error: {
                code: -100,
                message: `Invalid userType: ${userType}`,
                data: jsonRPCRequest.params,
            },
        });
    }

    queryUserFromDB(userType, jsonRPCRequest.params.username, jsonRPCRequest.params.password)
        .then((users) => {
                if (users.length) {
                    const {password, ...userInfo} = users[0]; // Remove the password field
                    request.session.userType = userType
                    request.session.userInfo = userInfo
                    return {
                        jsonrpc: JSONRPC,
                        id: jsonRPCRequest.id as JSONRPCID,
                        result: {
                            userType: userType,
                            userInfo: userInfo
                        },
                    };
                } else {
                    console.info("Invalid username or password:", jsonRPCRequest.params);
                    return {
                        jsonrpc: JSONRPC,
                        id: jsonRPCRequest.id as JSONRPCID,
                        error: {
                            code: -100,
                            message: "Invalid username or password.",
                            data: jsonRPCRequest.params,
                        },
                    };
                }
            }
        )
        .catch((error) => {
            console.error("An unexpected error occurred:", error);
            return {
                jsonrpc: JSONRPC,
                id: jsonRPCRequest.id as JSONRPCID,
                error: {
                    code: -100,
                    message: `An unexpected error occurred: ${error}`,
                    data: jsonRPCRequest.params,
                },
            };
        })
        .then((jsonRpcResponse) =>
            response.json(jsonRpcResponse)
        );
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