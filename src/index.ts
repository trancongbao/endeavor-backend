import "scope-extensions-js";
import express from "express";
import {isAdmin} from "./admin/isAdmin";
import {isTeacher} from "./teach/isTeacher";
import {isStudent} from "./study/isStudent";
import {auth, validateParams} from "./auth/auth";
import {expressSession} from "./session/session";
import {validateBody} from "./validation/validation";
import {admin} from "./admin/admin";
import {teach} from "./teach/teach";
import dotenv from "dotenv";
import cors from "cors"

if (process.env.NODE_ENV === "LOCAL") {
    dotenv.config()
}

const app = express()

// Cors
app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}))

// All apis use a json body (similar to json-rpc)
app.use(express.json());

// Session
app.use(expressSession)

// Validate request body
app.use(validateBody)

// Authentication
app.use("/auth", validateParams, auth);

app.use("/admin", isAdmin, admin);
app.use("/teach", isTeacher, teach);
app.use("/study", isStudent);
app.listen(3000, () => {
    console.log("Express server started on port 3000.");
});
