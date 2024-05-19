import "scope-extensions-js";
import { endeavorDB } from "../databases/endeavorDB";
import { Schema } from "express-validator";
import { sendSuccessResponse } from "../response/success";
import { Codes, sendErrorResponse } from "../response/error";
import { encode } from "html-entities";
import SQL from "sql-template-strings";
import { query } from "../databases/postgres";
import format from "pg-format";

export { RpcMethodName, rpcMethods };

type RpcMethodName = "createCard" | "addWordsToCard" | "getCards";

const rpcMethods: Record<RpcMethodName, { rpcMethod: CallableFunction; rpcMethodParamsSchema: Schema }> = {
  createCard: {
    rpcMethod: createCard,
    rpcMethodParamsSchema: {},
  },
  addWordsToCard: {
    rpcMethod: addWordsToCard,
    rpcMethodParamsSchema: {},
  },
  getCards: {
    rpcMethod: getCards,
    rpcMethodParamsSchema: {},
  },
};

async function createCard(request: any, response: any) {
  const teacherUsername = request.session.userInfo.username;
  const { lesson_id, card_order, front_text, front_audio_uri } = request.body.params;

  const sql = SQL`INSERT INTO card (lesson_id, card_order, front_text, front_audio_uri)
            SELECT ${lesson_id}, ${card_order}, ${encode(front_text)}, ${front_audio_uri}
            WHERE EXISTS          (SELECT 1
                                   FROM teacher_course
                                            INNER JOIN course on course.id = teacher_course.course_id
                                            INNER JOIN lesson on course.id = lesson.course_id
                                   WHERE teacher_course.teacher_username = ${teacherUsername}
                                     AND lesson.id = ${lesson_id})
            RETURNING *;`;

  try {
    sendSuccessResponse(response, (await query(sql)).rows[0]);
  } catch (error: any) {
    sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message);
  }
}

async function addWordsToCard(request: any, response: any) {
  const teacherUsername = request.session.userInfo.username;
  const { card_id, words }: { card_id: number; words: { id: number; order: number }[] } = request.body.params;

  try {
    // Check if the teacher has access rights to the card
    const accessCheckSql = SQL`
      SELECT 1
      FROM teacher_course
      INNER JOIN course ON course.id = teacher_course.course_id
      INNER JOIN lesson ON lesson.course_id = course.id
      INNER JOIN card ON card.lesson_id = lesson.id
      WHERE teacher_course.teacher_username = ${teacherUsername}
      AND card.id = ${card_id};
    `;

    const accessCheckResult = await query(accessCheckSql);

    if (accessCheckResult.rows.length === 0) {
      // Teacher does not have access rights, send error response
      sendErrorResponse(response, Codes.Teach.TeacherPrivilegeMissing, "Teacher does not have access rights to the card.");
      return;
    }

    // Insert words into card_word table
    const insertSql = SQL`
      INSERT INTO card_word (card_id, word_id, word_order)
      VALUES 
    `;

    words.forEach((word, index) => {
      if (index > 0) {
        insertSql.append(SQL`,`);
      }
      insertSql.append(SQL`(${card_id}, ${word.id}, ${word.order})`);
    });

    insertSql.append(SQL`
      RETURNING *;
    `);

    const insertResult = await query(insertSql);
    sendSuccessResponse(response, insertResult.rows);
  } catch (error: any) {
    console.log(error);
    sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message);
  }
}

function getCards(request: any, response: any) {
  return endeavorDB
    .selectFrom("teacher_course")
    .where("teacher_course.teacher_username", "=", request.session.userInfo.username)
    .innerJoin("course", "course.id", "teacher_course.course_id")
    .innerJoin("lesson", "lesson.course_id", "course.id")
    .innerJoin("card", "card.lesson_id", "lesson.id")
    .where("card.lesson_id", "=", request.body.params.id)
    .innerJoin("card_word", "card_word.card_id", "card.id")
    .innerJoin("word", "word.id", "card_word.word_id")
    .select([
      "card.id as id",
      "card.card_order as order",
      "card.front_text as text",
      "word.id as word_id",
      "card_word.word_order as word_order",
      "word.word as word_word",
      "word.definition as word_definition",
      "word.phonetic as word_phonetic",
      "word.part_of_speech as word_part_of_speech",
      "word.audio_uri as word_audio_uri",
      "word.image_uri as word_image_uri",
    ])
    .execute()
    .then((rows) => {
      const cards: {
        id: number;
        order: number;
        text: string;
        words: { word_id: number; word_order: number; word_word: string }[];
      }[] = [];
      rows.forEach(({ id, order, text, ...word }) => {
        const card = cards.find((card) => card.id === id);
        if (card) {
          card.words.push(word);
        } else {
          cards.push({ id: id, order: order, text: text, words: [word] });
        }
      });
      sendSuccessResponse(response, cards);
    })
    .catch((error) => {
      console.log(error);
      sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message);
    });
}
