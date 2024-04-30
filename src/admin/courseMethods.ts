import "scope-extensions-js";
import {Course, CourseStatus, endeavorDB} from "../databases/endeavorDB";
import {Insertable, Selectable, Updateable} from "kysely";
import {checkSchema, Schema} from "express-validator";

export {createCourse, readCourse, updateCourse, deleteCourse, assignCourse, publishCourse}

function createCourse(course: Insertable<Course>): Promise<Selectable<Course>> {
    return endeavorDB.insertInto("course")
        .values({
            ...course,
            status: CourseStatus.DRAFT
        })
        .returningAll()
        .executeTakeFirstOrThrow();
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

function assignCourse() {
}

function publishCourse() {
}

type Method = "createCourse" | "readCourse";

const validationSchemas: Record<Method, Schema> = {
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