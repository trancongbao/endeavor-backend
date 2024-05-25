import "scope-extensions-js";
import { Course, CourseStatus, endeavorDB } from "../databases/endeavorDB";
import { Updateable } from "kysely";
import { Schema } from "express-validator";
import { sendSuccessResponse } from "../response/success";
import { Codes, sendErrorResponse } from "../response/error";
import SQL from "sql-template-strings";
import { query } from "../databases/postgres";

export { RpcMethodName, rpcMethods };

type RpcMethodName = "createCourse" | "readCourse" | "assignCourse";

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction; rpcMethodParamsSchema: Schema }> = {
  createCourse: {
    rpcMethod: createCourse,
    rpcMethodParamsSchema: createCourseParamsSchema(),
  },
  readCourse: {
    rpcMethod: readCourse,
    rpcMethodParamsSchema: readCourseParamsSchema(),
  },
  assignCourse: {
    rpcMethod: assignCourse,
    rpcMethodParamsSchema: assignCourseParamsSchema(),
  },
};

function createCourseParamsSchema() {
  return {
    "params.level": {
      isInt: {
        options: { min: 1, max: 10 },
        bail: true,
      },
      errorMessage: "Invalid level. Level must be an integer between 1 and 20.",
    },
    "params.title": {
      isString: { bail: true },
      isLength: {
        options: { min: 1, max: 20 },
      },
      errorMessage: "Invalid title. Title must be a non-empty string of max length 20 characters.",
    },
    "params.summary": {
      optional: true,
      isString: { bail: true },
      notEmpty: { bail: true },
      isLength: {
        options: { min: 1, max: 150 },
      },
      errorMessage: "Invalid summary. Summary (if provided) must be a non-empty string of max length 150 characters.",
    },
    "params.description": {
      optional: true,
      isString: { bail: true },
      notEmpty: { bail: true },
      isLength: {
        options: { min: 1, max: 300 },
      },
      errorMessage:
        "Invalid description. Description (if provided) must be a non-empty string of max length 300 characters.",
    },
    "params.thumbnail": {
      optional: true,
      isString: { bail: true },
      notEmpty: { bail: true },
      errorMessage: "Invalid thumbnail. Thumbnail (if provided) must be a non-empty string.",
    },
  };
}

function readCourseParamsSchema() {
  return {
    "params.level": {
      isInt: {
        options: { min: 1, max: 10 },
        bail: true,
      },
      errorMessage: "Invalid level. Level must be an integer between 1 and 20.",
    },
    "params.title": {
      isString: { bail: true },
      isLength: {
        options: { min: 1, max: 20 },
      },
      errorMessage: "Invalid title. Title must be a non-empty string of max length 20 characters.",
    },
    "params.summary": {
      optional: true,
      isString: { bail: true },
      notEmpty: { bail: true },
      isLength: {
        options: { min: 1, max: 150 },
      },
      errorMessage: "Invalid summary. Summary (if provided) must be a non-empty string of max length 150 characters.",
    },
    "params.description": {
      optional: true,
      isString: { bail: true },
      notEmpty: { bail: true },
      isLength: {
        options: { min: 1, max: 300 },
      },
      errorMessage:
        "Invalid description. Description (if provided) must be a non-empty string of max length 300 characters.",
    },
    "params.thumbnail": {
      optional: true,
      isString: { bail: true },
      notEmpty: { bail: true },
      errorMessage: "Invalid thumbnail. Thumbnail (if provided) must be a non-empty string.",
    },
  };
}

function assignCourseParamsSchema() {
  return {};
}

async function createCourse(request: any, response: any) {
  const { title, level, summary, description, thumbnail } = request.body.params;

  const sql = SQL`
    INSERT INTO course (title, status, level, summary, description, thumbnail)
    VALUES (${title}, ${CourseStatus.DRAFT}, ${level}, ${summary}, ${description}, ${thumbnail})
    RETURNING *; 
    `;

  try {
    sendSuccessResponse(response, (await query(sql)).rows[0]);
  } catch (error: any) {
    sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message);
  }
}

function readCourse({ id }: { id: number }) {
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

function deleteCourse({ id }: { id: number }) {
  return endeavorDB.deleteFrom("course").where("id", "=", id).returningAll().executeTakeFirstOrThrow();
}

async function assignCourse(request: any, response: any) {
  const { teacher_username, course_id } = request.body.params;

  const sql = SQL`
      INSERT INTO teacher_course (teacher_username, course_id)
      VALUES (${teacher_username},  ${course_id})
      RETURNING *; 
      `;

  try {
    sendSuccessResponse(response, (await query(sql)).rows[0]);
  } catch (error: any) {
    sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message);
  }
}

function publishCourse() {}
