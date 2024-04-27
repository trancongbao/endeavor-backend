import "scope-extensions-js";
import {JSONRPC, JSONRPCID, JSONRPCRequest, JSONRPCResponse, JSONRPCServer} from "json-rpc-2.0";
import endeavorDB, {Admin, Teacher} from "../databases/endeavorDB";
import {generateJWT} from "../jwt/jwt";
import {NoResultError} from "kysely";

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
        .then((user) => {
            const {password, ...userInfo} = user; // Remove the password field
            return {
                jsonrpc: JSONRPC,
                id: jsonRPCRequest.id as JSONRPCID,
                result: {jwt: generateJWT({userType: userType, ...userInfo})},
            };
        })
        .catch((error) => {
            if (error instanceof NoResultError) {
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
            } else {
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
            }
        });
}

function isUserType(userType: any): userType is UserType {
    return ["admin", "teacher", "student"].includes(userType)
}

function queryUserFromDB(userTable: UserType, username: string, password: string): Promise<Admin | Teacher> {
    return endeavorDB.selectFrom<UserType>(userTable)
        .selectAll()
        .where("username", "=", username)
        .where("password", "=", password)
        .executeTakeFirstOrThrow()
}

type UserType = "admin" | "teacher" | "student"