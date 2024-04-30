import {sendSuccessResponse} from "../response/success";
import {Codes, sendErrorResponse} from "../response/error";

export {paramsSchema, logout}

const paramsSchema = {}

function logout(request: any, response: any) {
    request.session.destroy((error: any) => {
        error ? sendErrorResponse(response, Codes.Authn.UnexpectedError) : sendSuccessResponse(response, {})
    })
}