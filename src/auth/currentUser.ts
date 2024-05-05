import {sendSuccessResponse} from "../response/success";

export {paramsSchema, currentUser};

const paramsSchema = {}

function currentUser(request: any, response: any) {
    return sendSuccessResponse(response, request.session.userInfo)
}
