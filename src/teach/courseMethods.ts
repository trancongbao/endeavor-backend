import "scope-extensions-js";
import { endeavorDB } from "../databases/endeavorDB";
import { Schema } from "express-validator";
import { sendSuccessResponse } from "../response/success";
import { Codes, sendErrorResponse } from "../response/error";
import SQL from "sql-template-strings";
import { query } from "../databases/postgres";

export { RpcMethodName, rpcMethods };

type RpcMethodName = "listAllCourses" | "getDecks";

const rpcMethods: Record<
  RpcMethodName,
  {
    rpcMethod: CallableFunction;
    rpcMethodParamsSchema: Schema;
  }
> = {
  listAllCourses: {
    rpcMethod: listAllCourses,
    rpcMethodParamsSchema: {},
  },
  getDecks: {
    rpcMethod: getDecks,
    rpcMethodParamsSchema: {},
  },
};

function readCourse({ id }: { id: number }) {
  return endeavorDB.selectFrom("course").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

function listAllCourses(request: any, response: any) {
  const { username } = request.session.userInfo;
  return endeavorDB
    .selectFrom("teacher_course")
    .selectAll()
    .where("teacher_username", "=", username)
    .execute()
    .then((course) => {
      sendSuccessResponse(response, course);
    })
    .catch((error) => {
      console.log(error);
      sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message);
    });
}

async function getDecks(request: any, response: any) {
  const teacherUsername = request.session.userInfo.username;
  const sql = SQL`
          SELECT  course.id as id,
                  course.level as level,
                  course.title as title,
                  lesson.id as subdeck_id,
                  lesson.lesson_order as subdeck_order,
                  lesson.title as subdeck_title
          FROM course
          INNER JOIN lesson ON lesson.course_id = course.id
          INNER JOIN teacher_course ON teacher_course.course_id = course.id
          WHERE teacher_course.teacher_username = ${teacherUsername}
      `;

  try {
    const rows = (await query(sql)).rows;
    const decks: {
      id: number;
      level: number;
      title: string;
      subdecks: {
        subdeck_id: number;
        subdeck_order: number;
        subdeck_title: string;
      }[];
    }[] = [];

    rows.forEach((row: any) => {
      const { id, level, title, ...subdeck } = row;
      const deck = decks.find((course) => course.id === id);
      if (deck) {
        deck.subdecks.push(subdeck);
      } else {
        decks.push({ id: id, level: level, title: title, subdecks: [subdeck] });
      }
    });

    sendSuccessResponse(response, decks);
  } catch (error: any) {
    console.log(error);
    sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message);
  }
}
