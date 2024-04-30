import "scope-extensions-js";
import express from "express";
import {default as adminJsonRpcMethodHandlers} from "./admin/jsonRpcMethodHandlers";
import {default as teachJsonRpcMethodHandlers} from "./teach/jsonRpcMethodHandlers";
import {default as studyJsonRpcMethodHandlers} from "./study/jsonRpcMethodHandlers";
import {JSONRPCServer} from "json-rpc-2.0";
import {isAdmin} from "./admin/isAdmin";
import {isTeacher} from "./teach/isTeacher";
import {isStudent} from "./study/isStudent";
import {auth, validateBody, validateInput} from "./auth/auth";
import {expressSession} from "./session/session";

const app = express()

// All apis use a json body (similar to json-rpc)
app.use(express.json());

// Session
app.use(expressSession)

// Authentication
app.use("/auth", validateBody, validateInput, auth);

app.use("/study", isStudent, jsonRpcRouter(studyJsonRpcMethodHandlers));
app.use("/teach", isTeacher, jsonRpcRouter(teachJsonRpcMethodHandlers));
app.use("/admin", isAdmin, jsonRpcRouter(adminJsonRpcMethodHandlers));
app.listen(3000, () => {
    console.log("Express server started on port 3000.");
});

function jsonRpcRouter(jsonRpcMethodHandlers: JSONRPCServer<void>) {
    return express.Router().let((router) => {
        return router.post("/", (request, response) => {
            jsonRpcMethodHandlers.receive(request.body).then((jsonRpcResponse) => {
                if (jsonRpcResponse) {
                    response.json(jsonRpcResponse);
                } else {
                    /*
                     * The Server MUST NOT reply to a Notification.
                     * Ref: https://www.jsonrpc.org/specification#notification
                     */
                }
            });
        });
    });
}

