import "scope-extensions-js";
import {JSONRPC, JSONRPCID, JSONRPCRequest, JSONRPCResponse, JSONRPCServer} from "json-rpc-2.0";
import endeavorDB, {Admin, Student, Teacher} from "../databases/endeavorDB";
import {generateJWT} from "../jwt/jwt";

export default new JSONRPCServer().apply(function () {
    this.addMethodAdvanced("login", login);
});

function login(jsonRPCRequest: JSONRPCRequest): Promise<JSONRPCResponse> {
    let userType = jsonRPCRequest.params.userType

    if (!isUserType(userType)) {
        return Promise.resolve({
            jsonrpc: JSONRPC,
            id: jsonRPCRequest.id as JSONRPCID,
            error: {
                code: -100,
                message: `Invalid userType: ${userType}`,
                data: jsonRPCRequest.params,
            },
        });
    }

    return queryUserFromDB(userType, jsonRPCRequest.params.username, jsonRPCRequest.params.password)
        .then((users) => {
                if (users.length) {
                    const {password, ...userInfo} = users[0]; // Remove the password field
                    return {
                        jsonrpc: JSONRPC,
                        id: jsonRPCRequest.id as JSONRPCID,
                        result: {jwt: generateJWT({userType: userType, ...userInfo})},
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
        });
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