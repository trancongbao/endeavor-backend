export {sendSuccessResponse};

function sendSuccessResponse(response: any, result?: any) {
    response.json({
        result: result || {}
    })
}
