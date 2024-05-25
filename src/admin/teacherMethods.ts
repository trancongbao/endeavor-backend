import bcrypt from "bcryptjs";
import { endeavorDB, Teacher } from "../databases/endeavorDB";
import { Insertable, Updateable } from "kysely";
import { Schema } from "express-validator";

export { RpcMethodName, rpcMethods };

type RpcMethodName = "createTeacher";

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction; rpcMethodParamsSchema: Schema }> = {
  createTeacher: {
    rpcMethod: createTeacher,
    rpcMethodParamsSchema: createTeacherParamsSchema(),
  },
};

function createTeacher(teacher: Insertable<Teacher>) {
  bcrypt.hash(teacher.password, 13, (_, hashedPassword) => {
    teacher.password = hashedPassword;
  });

  return endeavorDB
    .insertInto("teacher")
    .values(teacher)
    .returningAll()
    .executeTakeFirstOrThrow()
    .also(() => console.log(`Teacher created: ${JSON.stringify(teacher)}`));
}

export function readTeacher(teacherId: number) {}

export function updateTeacher(teacherId: number) {}

export function deleteTeacher(teacherId: number) {}

function createTeacherParamsSchema() {
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

function readTeacherParamsSchema() {
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
