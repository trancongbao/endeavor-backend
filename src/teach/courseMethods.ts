import "scope-extensions-js";
import {endeavorDB} from "../databases/endeavorDB";
import {Schema} from "express-validator";
import {sendSuccessResponse} from "../response/success";
import {Codes, sendErrorResponse} from "../response/error";

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

function getDecks(request: any, response: any) {
    const {username} = request.session.userInfo
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
        .where("teacher_course.teacher_username", "=", username)
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

function getSubdecks(request: any, response: any) {
    return endeavorDB
        .selectFrom("teacher_course")
        .innerJoin("course", "course.id", "teacher_course.course_id")
        .innerJoin("lesson", "lesson.course_id", "course.id")
        .select(["lesson.id as id", "lesson.lesson_order as order", "lesson.title as title"])
        .where("teacher_course.teacher_username", "=", request.session.userInfo.username)
        .where("teacher_course.course_id", "=", request.body.params.id)
        .execute()
        .then((subDecks) => {
            sendSuccessResponse(response, subDecks)
        })
        .catch(error => {
            console.log(error)
            sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
        })
}

