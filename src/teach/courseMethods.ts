import "scope-extensions-js";
import {endeavorDB} from "../databases/endeavorDB";
import {Schema} from "express-validator";
import {sendSuccessResponse} from "../response/success";
import {Codes, sendErrorResponse} from "../response/error";
import SQL from "sql-template-strings";
import {query} from "../databases/postgres";

export {RpcMethodName, rpcMethods}

type RpcMethodName = "listAllCourses" | "getDecks" | "getSubdecks";

const rpcMethods: Record<RpcMethodName, {
    rpcMethod: CallableFunction,
    rpcMethodParamsSchema: Schema
}> = {
    "listAllCourses": {
        rpcMethod: listAllCourses,
        rpcMethodParamsSchema: {}
    },
    "getDecks": {
        rpcMethod: getDecks,
        rpcMethodParamsSchema: {}
    },
    "getSubdecks": {
        rpcMethod: getSubdecks,
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

async function getDecks(request: any, response: any) {
    const teacherUsername = request.session.userInfo.username
    return endeavorDB
        .selectFrom("teacher_course")
        .innerJoin("course", "course.id", "teacher_course.course_id")
        .innerJoin("lesson", "lesson.course_id", "course.id")
        .select([
            "course.id as id",
            "course.level as level",
            "course.title as title",
            "lesson.id as subdeck_id",
            "lesson.lesson_order as subdeck_order",
            "lesson.title as subdeck_title"
        ])
        .where("teacher_course.teacher_username", "=", teacherUsername)
        .execute()
        .then((rows) => {
            const decks: {
                id: number,
                level: number,
                title: string,
                subdecks: {
                    subdeck_id: number,
                    subdeck_order: number,
                    subdeck_title: string
                }[]
            }[] = [];

            rows.forEach(({id, level, title, ...subdeck}) => {
                const deck = decks.find(course => course.id === id)
                if (deck) {
                    deck.subdecks.push(subdeck)
                } else {
                    decks.push({id: id, level: level, title: title, subdecks: [subdeck]})
                }
            })

            sendSuccessResponse(response, decks)
        })
        .catch(error => {
            console.log(error)
            sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
        })
}

async function getSubdecks(request: any, response: any) {
    const teacherUsername = request.session.userInfo.username
    const courseId = request.body.params.id

    const sql =
        SQL`SELECT lesson.id           as id,
                   lesson.lesson_order as "order",
                   lesson.title        as title
            FROM lesson
            WHERE EXISTS          (SELECT 1
                                   FROM teacher_course
                                   WHERE teacher_username = ${teacherUsername}
                                     AND course_id = ${courseId})`

    try {
        sendSuccessResponse(response, (await query(sql)).rows)
    } catch (error: any) {
        console.log(error)
        sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
    }
}

