import "scope-extensions-js";
import { endeavorDB } from "../databases/endeavorDB";
import { Lesson } from "../databases/endeavorDB";
import { Updateable } from "kysely";
import { sendSuccessResponse } from "../response/success";
import { Codes, sendErrorResponse } from "../response/error";
import { Schema } from "express-validator";
import SQL from "sql-template-strings";
import { query } from "../databases/postgres";

export { RpcMethodName, rpcMethods };

type RpcMethodName = "createLesson" | "getDecks";

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction; rpcMethodParamsSchema: Schema }> = {
  createLesson: {
    rpcMethod: createLesson,
    rpcMethodParamsSchema: {},
  },
  getDecks: {
    rpcMethod: getDecks,
    rpcMethodParamsSchema: {},
  },
};

async function createLesson(request: any, response: any) {
  const { course_id, lesson_order, title, audio, summary, description, thumbnail, content } = request.body.params;
  /**
   * Insert only when the teacher is assigned the course
   */
  const sql = SQL`INSERT INTO lesson (course_id, lesson_order, title, audio, summary, description, thumbnail,
                                content)
            SELECT ${course_id},
                   ${lesson_order},
                   ${title},
                   ${audio},
                   ${summary},
                   ${description},
                   ${thumbnail},
                   ${content}
            WHERE EXISTS          (SELECT 1
                                   FROM teacher_course
                                   WHERE teacher_username = ${request.session.userInfo.username}
                                     AND course_id = ${course_id})
            RETURNING *;`;

  try {
    sendSuccessResponse(response, (await query(sql)).rows[0]);
  } catch (error: any) {
    sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message);
  }
}

export function readLesson({ id }: { id: number }) {
  return endeavorDB.selectFrom("lesson").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

export function updateLesson(lesson: Updateable<Lesson>) {
  return endeavorDB
    .updateTable("lesson")
    .where("id", "=", lesson.id!!)
    .set(lesson)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export function deleteLesson({ id }: { id: number }) {
  return endeavorDB.deleteFrom("lesson").where("id", "=", id).returningAll().executeTakeFirstOrThrow();
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
        WHERE EXISTS    (SELECT 1 
                        FROM teacher_course
                        WHERE teacher_course.teacher_username = ${teacherUsername})
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
