import "scope-extensions-js";
import {endeavorDB} from "../databases/endeavorDB";
import {Schema} from "express-validator";
import {sendSuccessResponse} from "../response/success";
import {Codes, sendErrorResponse} from "../response/error";

export {RpcMethodName, rpcMethods}

type RpcMethodName = "listAllCourses" | "getMyDecks";

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction, rpcMethodParamsSchema: Schema }> = {
    "listAllCourses": {
        rpcMethod: listAllCourses,
        rpcMethodParamsSchema: {}
    },
    "getMyDecks": {
        rpcMethod: getMyDecks,
        rpcMethodParamsSchema: {}
    }
}

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
    const {username} = request.session.userInfo
    return endeavorDB
        .selectFrom("teacher_course")
        .innerJoin("course", "course.id", "teacher_course.course_id")
        .innerJoin("lesson", "lesson.course_id", "course.id")
        .select(["course.id as course_id", "course.level as course_level", "course.title as course_title", "lesson.id as lesson_id", "lesson.lesson_order", "lesson.title as lesson_title"])
        .where("teacher_course.teacher_username", "=", username)
        .execute()
        .then((rows) => {
            const courses: {
                id: number,
                level: number,
                title: string,
                subDecks: { order: number, title: string }[]
            }[] = [];
            rows.forEach(row => {
                const course = courses.find(course => course.id === row.course_id)
                if (course === undefined) {
                    courses.push({
                        id: row.course_id,
                        level: row.course_level,
                        title: row.course_title,
                        subDecks: []
                    })
                } else {
                    course.subDecks.push({
                        order: row.lesson_order,
                        title: row.lesson_title
                    })
                }
            })

            sendSuccessResponse(response, courses)
        })
        .catch(error => {
            console.log(error)
            sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
        })
}

