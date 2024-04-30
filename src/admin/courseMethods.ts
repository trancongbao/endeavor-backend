import "scope-extensions-js";
import {Course, CourseStatus, endeavorDB} from "../databases/endeavorDB";
import {Insertable, Selectable, Updateable} from "kysely";
import {Schema} from "express-validator";
import {sendSuccessResponse} from "../response/success";
import {Codes, sendErrorResponse} from "../response/error";

export {paramsSchema, createCourse, readCourse, updateCourse, deleteCourse, assignCourse, publishCourse}

function createCourse(request: any, response: any) {
    endeavorDB
        .insertInto("course")
        .values({
            ...request.body.params,
            status: CourseStatus.DRAFT
        })
        .returningAll()
        .execute()
        .then(course => {
            sendSuccessResponse(response, course)
        })
        .catch(error => {
            console.log(error)
            sendErrorResponse(response, Codes.MethodInvocationError, error.message)
        })
}

function readCourse({id}: {
    id: number
}) {
    return endeavorDB.selectFrom("course").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

function updateCourse(course: Updateable<Course>) {
    return endeavorDB
        .updateTable("course")
        .where("id", "=", course.id!!)
        .set(course)
        .returningAll()
        .executeTakeFirstOrThrow();
}

function deleteCourse({id}: {
    id: number
}) {
    return endeavorDB.deleteFrom("course").where("id", "=", id).returningAll().executeTakeFirstOrThrow();
}

function assignCourse(request: any, response: any) {
    const {teacher, course} = request.body.params
    endeavorDB
        .insertInto("teacher_course")
        .values({
            ...request.body.params,
            status: CourseStatus.DRAFT
        })
        .returningAll()
        .execute()
        .then(course => {
            sendSuccessResponse(response, course)
        })
        .catch(error => {
            console.log(error)
            sendErrorResponse(response, Codes.MethodInvocationError, error.message)
        })
}

function publishCourse() {
}

type Method = "createCourse" | "readCourse";

const paramsSchema: Record<Method, Schema> = {
    "createCourse": {
        'params.level': {
            isInt: {
                options: {min: 1, max: 10},
                bail: true
            },
            errorMessage: 'Invalid level. Level must be an integer between 1 and 20.'
        },
        'params.title': {
            isString: {bail: true},
            isLength: {
                options: {min: 1, max: 20}
            },
            errorMessage: 'Invalid title. Title must be a non-empty string of max length 20 characters.'
        },
        'params.summary': {
            optional: true,
            isString: {bail: true},
            notEmpty: {bail: true},
            isLength: {
                options: {min: 1, max: 150}
            },
            errorMessage: 'Invalid summary. Summary (if provided) must be a non-empty string of max length 150 characters.'
        },
        'params.description': {
            optional: true,
            isString: {bail: true},
            notEmpty: {bail: true},
            isLength: {
                options: {min: 1, max: 300}
            },
            errorMessage: 'Invalid description. Description (if provided) must be a non-empty string of max length 300 characters.'
        },
        'params.thumbnail': {
            optional: true,
            isString: {bail: true},
            notEmpty: {bail: true},
            errorMessage: 'Invalid thumbnail. Thumbnail (if provided) must be a non-empty string.'
        }
    },
    "readCourse": {
        'params.level': {
            isInt: {
                options: {min: 1, max: 10},
                bail: true
            },
            errorMessage: 'Invalid level. Level must be an integer between 1 and 20.'
        },
        'params.title': {
            isString: {bail: true},
            isLength: {
                options: {min: 1, max: 20}
            },
            errorMessage: 'Invalid title. Title must be a non-empty string of max length 20 characters.'
        },
        'params.summary': {
            optional: true,
            isString: {bail: true},
            notEmpty: {bail: true},
            isLength: {
                options: {min: 1, max: 150}
            },
            errorMessage: 'Invalid summary. Summary (if provided) must be a non-empty string of max length 150 characters.'
        },
        'params.description': {
            optional: true,
            isString: {bail: true},
            notEmpty: {bail: true},
            isLength: {
                options: {min: 1, max: 300}
            },
            errorMessage: 'Invalid description. Description (if provided) must be a non-empty string of max length 300 characters.'
        },
        'params.thumbnail': {
            optional: true,
            isString: {bail: true},
            notEmpty: {bail: true},
            errorMessage: 'Invalid thumbnail. Thumbnail (if provided) must be a non-empty string.'
        }
    },
};