import bcrypt from "bcryptjs";
import { Schema } from "express-validator";
import { sendSuccessResponse } from "../response/success";
import { Codes, sendErrorResponse } from "../response/error";
import SQL from "sql-template-strings";
import { query } from "../databases/postgres";

export { RpcMethodName, rpcMethods };

type RpcMethodName = "addTeacher";

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction; rpcMethodParamsSchema: Schema }> = {
  addTeacher: {
    rpcMethod: addTeacher,
    rpcMethodParamsSchema: createTeacherParamsSchema(),
  },
};

async function addTeacher(request: any, response: any) {
  const { username, password, surname, givenName, email, phone, dateOfBirth, address, avatar } = request.body.params;

  const hashedPassword = await bcrypt.hash(password, 13);

  const sql = SQL`
    INSERT INTO teacher (username, password, surname, given_name, email, phone, date_of_birth, address, avatar)
    VALUES (${username}, ${hashedPassword}, ${surname}, ${givenName}, ${email}, ${phone}, ${dateOfBirth}, ${address}, ${avatar})
    RETURNING *; 
    `;

  try {
    sendSuccessResponse(response, (await query(sql)).rows[0]);
  } catch (error: any) {
    sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message);
  }
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
