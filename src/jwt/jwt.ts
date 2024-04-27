import jwt from "jsonwebtoken";
import { sendJsonRpcErrorResponse, JsonRpcErrorCodes } from "../error/error";

export { generateJWT, processJWT };

const jwtSecret = "secretkey";

function generateJWT(payload: object): string {
  return jwt.sign(payload, jwtSecret, { expiresIn: "3h" });
}

/**
 * This middleware function extracts a JWT token from the request Authorization header.
 * It then parses and verifies the token.
 * If the token is invalid or an error occurs, it sends an appropriate JSON-RPC error response and ends the middleware stack.
 * If the token exists and is valid, it adds the token payload as a `user` field to the request and calls next().
 * @param {Object} request - The HTTP request object.
 * @param {Object} response - The HTTP response object.
 * @param {function} next - The callback to proceed with the middleware stack.
 * @returns {void}
 */
function processJWT(request: any, response: any, next: any): void {
  let authorizationHeader = request.headers.authorization as string | undefined;
  let body = request.body;

  try {
    if (!authorizationHeader) {
      sendJsonRpcErrorResponse(response, body.id, JsonRpcErrorCodes.Authorization_AuthorizationHeaderMissing);
    } else {
      let token = authorizationHeader.split(" ")[1];
      if (token === "null" || !token) {
        sendJsonRpcErrorResponse(response, body.id, JsonRpcErrorCodes.Authorization_JwtTokenMissing);
      }

      let verifiedUser;
      try {
        verifiedUser = jwt.verify(token, jwtSecret);
      } catch (error: any) {
        if (error.info === "TokenExpiredError") {
          sendJsonRpcErrorResponse(response, body.id, JsonRpcErrorCodes.Authorization_JwtTokenExpired);
        } else {
          console.error("Authorization failed: Unexpected error while verifying JWT token.", error);
          sendJsonRpcErrorResponse(response, body.id, JsonRpcErrorCodes.Authorization_UnexpectedError);
        }
      }

      if (!verifiedUser) {
        sendJsonRpcErrorResponse(response, body.id, JsonRpcErrorCodes.Authorization_JwtTokenInvalid);
      }

      request.user = verifiedUser;
      next();
    }
  } catch (error) {
    console.error("Authorization failed: Unexpected error.", error);
    sendJsonRpcErrorResponse(response, body.id, JsonRpcErrorCodes.Authorization_UnexpectedError);
  }
}
