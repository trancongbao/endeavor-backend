import "scope-extensions-js";
import express from "express";
import { default as loginJsonRpcMethodHandlers } from "./login/jsonRpcMethodHandlers";
import { default as adminJsonRpcMethodHandlers } from "./admin/jsonRpcMethodHandlers";
import { default as teachJsonRpcMethodHandlers } from "./teach/jsonRpcMethodHandlers";
import { default as studyJsonRpcMethodHandlers } from "./study/jsonRpcMethodHandlers";
import { JSONRPCServer } from "json-rpc-2.0";
import { processJWT } from "./jwt/jwt";
import { isAdmin } from "./admin/isAdmin";
import { isTeacher } from "./teach/isTeacher";
import { isStudent } from "./study/isStudent";

express()
  .also((app) => {
    // JSON-RPC is used so the json body must always be parsed
    app.use(express.json());

    // Login
    app.use("/login", jsonRpcRouter(loginJsonRpcMethodHandlers));

    // JWT token must be processed for all following routes
    app.use(processJWT);
    app.use("/study", isStudent, jsonRpcRouter(studyJsonRpcMethodHandlers));
    app.use("/teach", isTeacher, jsonRpcRouter(teachJsonRpcMethodHandlers));
    app.use("/admin", isAdmin, jsonRpcRouter(adminJsonRpcMethodHandlers));
  })
  .listen(3000, () => {
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
