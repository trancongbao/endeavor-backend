import "scope-extensions-js";
import {endeavorDB} from "../databases/endeavorDB";
import {Schema} from "express-validator";
import {sendSuccessResponse} from "../response/success";
import {Codes, sendErrorResponse} from "../response/error";
import {createLesson} from "./lessonMethods";

export {courseRpcParamsSchemas, listAllCourses, readCourse, getMyDecks}

type RpcMethodNames = "listAllCourses" | "readCourse" | "getMyDecks";

const courseRpcParamsSchemas: Record<RpcMethodNames, Schema> = {
    "listAllCourses": {},
    "readCourse": {},
    "getMyDecks": {}
};

function readCourse({id}: {
    id: number
}) {
    return endeavorDB.selectFrom("course").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

function listAllCourses(request: any, response: any) {
    const {username} = request.session.userInfo
    return endeavorDB
        .selectFrom("teacher_course")
        .selectAll()
        .where("teacher_username", "=", username)
        .execute()
        .then(course => {
            sendSuccessResponse(response, course)
        })
        .catch(error => {
            console.log(error)
            sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
        })
}

function getMyDecks(request: any, response: any) {
    //course join with lesson
    const {username} = request.session.userInfo
    return endeavorDB
        .selectFrom("teacher_course")
        .innerJoin("course", "course.id", "teacher_course.course_id")
        //.innerJoin("lesson", "lesson.course_id", "course.id")
        .select(["course.id", "course.level", "course.title"])
        .where("teacher_course.teacher_username", "=", username)
        .execute()
        .then(course => {
            sendSuccessResponse(response, course)
        })
        .catch(error => {
            console.log(error)
            sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
        })
}

