import { JSONRPCID, createJSONRPCErrorResponse } from "json-rpc-2.0";

export { sendJsonRpcErrorResponse, JsonRpcErrorCodes };

function sendJsonRpcErrorResponse(response: any, id: JSONRPCID, code: JsonRpcErrorCodes) {
  console.info(jsonRpcErrorCodes[code]);
  response.json(createJSONRPCErrorResponse(id, code, jsonRpcErrorCodes[code]));
}

enum JsonRpcErrorCodes {
  //Authorization
  Authorization_UnexpectedError = -33000,
  Authorization_AuthorizationHeaderMissing = -33001,
  Authorization_JwtTokenMissing = -33002,
  Authorization_JwtTokenExpired = -33003,
  Authorization_JwtTokenInvalid = -33004,
  Authorization_AdminPrivilegeRequired = -33005,
  Authorization_TeacherPrivilegeRequired = -33006,
  Authorization_StudentPrivilegeRequired = -33007,
}

const jsonRpcErrorCodes: Record<JsonRpcErrorCodes, string> = {
  //Authorization
  [JsonRpcErrorCodes.Authorization_UnexpectedError]: "Authorization failed: Unexpected error.",
  [JsonRpcErrorCodes.Authorization_AuthorizationHeaderMissing]: "Authorization failed: Missing Authorization header.",
  [JsonRpcErrorCodes.Authorization_JwtTokenMissing]: "Authorization failed: Missing JWT token.",
  [JsonRpcErrorCodes.Authorization_JwtTokenExpired]: "Authorization failed: JWT token expired.",
  [JsonRpcErrorCodes.Authorization_JwtTokenInvalid]: "Authorization failed: Invalid JWT token.",
  [JsonRpcErrorCodes.Authorization_AdminPrivilegeRequired]: "Authorization failed: Admin privilege required.",
  [JsonRpcErrorCodes.Authorization_TeacherPrivilegeRequired]: "Authorization failed: Teacher privilege required.",
  [JsonRpcErrorCodes.Authorization_StudentPrivilegeRequired]: "Authorization failed: Student privilege required.",
};
