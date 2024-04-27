import "scope-extensions-js";
import express from "express";
import {default as adminJsonRpcMethodHandlers} from "./admin/jsonRpcMethodHandlers";
import {default as teachJsonRpcMethodHandlers} from "./teach/jsonRpcMethodHandlers";
import {default as studyJsonRpcMethodHandlers} from "./study/jsonRpcMethodHandlers";
import {JSONRPCServer} from "json-rpc-2.0";
import {isAdmin} from "./admin/isAdmin";
import {isTeacher} from "./teach/isTeacher";
import {isStudent} from "./study/isStudent";
import session from "express-session";
import IORedis from "ioredis";
import RedisStore from "connect-redis";
import {login} from "./login/login";

express()
    .also((app) => {
        // JSON-RPC is used so the json body must always be parsed
        app.use(express.json());

        // Session
        app.use(session({
            secret: "session-secret",
            saveUninitialized: false,
            resave: false,
            cookie: {
                maxAge: 1000 * 60 * 60
            }
        }))

        // Login
        app.use("/login", login);

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
            console.log(request.session)
            request.sessionStore.get(request.session.id, (err: any, sessionData: any) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("sessionData: ")
                    console.log(sessionData)
                }
            })
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

const redisClient = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

const redisStore = new RedisStore({client: redisClient});