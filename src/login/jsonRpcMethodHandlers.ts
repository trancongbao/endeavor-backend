import "scope-extensions-js";
import { JSONRPC, JSONRPCID, JSONRPCRequest, JSONRPCResponse, JSONRPCServer } from "json-rpc-2.0";
import endeavorDB from "../databases/endeavorDB";
import { generateJWT } from "../jwt/jwt";
import { NoResultError } from "kysely";

export default new JSONRPCServer().apply(function () {
  this.addMethodAdvanced("login", login);
});

function login(jsonRPCRequest: JSONRPCRequest): Promise<JSONRPCResponse> {
  if (!["admin", "teacher", "student"].includes(jsonRPCRequest.params.userType)) {
    return Promise.resolve({
      jsonrpc: JSONRPC,
      id: jsonRPCRequest.id as JSONRPCID,
      error: {
        code: -100,
        message: `Invalid userType: ${jsonRPCRequest.params.userType}`,
        data: jsonRPCRequest.params,
      },
    });
  }

  return endeavorDB
    .selectFrom(jsonRPCRequest.params.userType)
    .selectAll()
    .where("username", "=", jsonRPCRequest.params.username)
    .where("password", "=", jsonRPCRequest.params.password)
    .executeTakeFirstOrThrow()
    .then((user) => {
      const { password, ...userInfo } = user; // Remove the password field
      return {
        jsonrpc: JSONRPC,
        id: jsonRPCRequest.id as JSONRPCID,
        result: { jwt: generateJWT({ userType: jsonRPCRequest.params.userType, ...userInfo }) },
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
