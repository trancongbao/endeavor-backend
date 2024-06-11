import 'scope-extensions-js'
import { endeavorDB } from '../databases/endeavorDB'
import { Schema } from 'express-validator'
import { sendSuccessResponse } from '../response/success'
import { Codes, sendErrorResponse } from '../response/error'
import { encode } from 'html-entities'
import SQL from 'sql-template-strings'
import { query } from '../databases/postgres'

export { RpcMethodName, rpcMethods }

type RpcMethodName =
  | 'createCard'
  | 'updateCardText'
  | 'addWordToCard'
  | 'getCards'

const rpcMethods: Record<
  RpcMethodName,
  { rpcMethod: CallableFunction; rpcMethodParamsSchema: Schema }
> = {
  createCard: {
    rpcMethod: createCard,
    rpcMethodParamsSchema: {},
  },
  updateCardText: {
    rpcMethod: updateCardText,
    rpcMethodParamsSchema: {},
  },
  addWordToCard: {
    rpcMethod: addWordToCard,
    rpcMethodParamsSchema: {},
  },
  getCards: {
    rpcMethod: getCards,
    rpcMethodParamsSchema: {},
  },
}

async function createCard(request: any, response: any) {
  const teacherUsername = request.session.userInfo.username
  const { lesson_id, card_order, front_text, front_audio_uri } =
    request.body.params

  const sql = SQL`INSERT INTO card (lesson_id, card_order, front_text, front_audio_uri)
            SELECT ${lesson_id}, ${card_order}, ${encode(front_text)}, ${front_audio_uri}
            WHERE EXISTS          (SELECT 1
                                   FROM teacher_course
                                            INNER JOIN course on course.id = teacher_course.course_id
                                            INNER JOIN lesson on course.id = lesson.course_id
                                   WHERE teacher_course.teacher_username = ${teacherUsername}
                                     AND lesson.id = ${lesson_id})
            RETURNING *;`

  try {
    sendSuccessResponse(response, (await query(sql)).rows[0])
  } catch (error: any) {
    sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
  }
}

async function updateCardText(request: any, response: any) {
  const { cardId, cardText } = request.body.params

  teacherHasAccessRightToCard(request, response)

  const sql = SQL`
    UPDATE card
    SET front_text = ${cardText}
    WHERE id = ${cardId}
    RETURNING *;
  `

  try {
    sendSuccessResponse(response, (await query(sql)).rows[0])
  } catch (error: any) {
    console.log(error)
    sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
  }
}

async function addWordToCard(request: any, response: any) {
  const { cardId, wordId, wordOrder } = request.body.params

  try {
    teacherHasAccessRightToCard(request, response)

    // Insert the word into the card_word table
    const insertSql = SQL`
      INSERT INTO card_word (card_id, word_id, word_order)
      VALUES (${cardId}, ${wordId}, ${wordOrder})
      RETURNING *;
    `
    sendSuccessResponse(response, (await query(insertSql)).rows[0])
  } catch (error: any) {
    console.log(error)
    sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
  }
}

async function teacherHasAccessRightToCard(request: any, response: any) {
  const teacherUsername = request.session.userInfo.username
  const { cardId } = request.body.params

  // Check if the teacher has access right to the card
  const accessCheckSql = SQL`
      SELECT 1
      FROM teacher_course
      INNER JOIN course ON course.id = teacher_course.course_id
      INNER JOIN lesson ON lesson.course_id = course.id
      INNER JOIN card ON card.lesson_id = lesson.id
      WHERE teacher_course.teacher_username = ${teacherUsername}
      AND card.id = ${cardId};
    `

  if ((await query(accessCheckSql)).rows.length === 0) {
    // Teacher does not have access rights, send error response
    sendErrorResponse(
      response,
      Codes.Teach.TeacherPrivilegeMissing,
      'Teacher does not have access rights to the card.',
    )
    return
  }
}

async function getCards(request: any, response: any) {
  const teacherUsername = request.session.userInfo.username
  const { deckId, subdeckId } = request.body.params

  /**
   * A teacher can only get cards belonging to courses that he is assigned.
   */
  const sql = SQL`
    SELECT  course.id             as course_id,
            lesson.id             as lesson_id,
            card.id               as card_id,
            card.card_order       as card_order,
            card.front_text       as card_text,
            word.id               as word_id,
            card_word.word_order  as word_order,
            word.word             as word_word,
            word.definition       as word_definition,
            word.phonetic         as word_phonetic,
            word.part_of_speech   as word_part_of_speech,
            word.audio_uri        as word_audio_uri,
            word.image_uri        as word_image_uri
    FROM course
    INNER JOIN lesson ON lesson.course_id = course.id
    INNER JOIN card ON card.lesson_id = lesson.id
    INNER JOIN card_word ON card_word.card_id = card.id
    INNER JOIN word ON word.id = card_word.word_id
    WHERE course.id = ${deckId}
    AND lesson.id = ${subdeckId}
    AND EXISTS  (SELECT 1
                FROM teacher_course
                WHERE teacher_course.teacher_username = ${teacherUsername}
                AND teacher_course.course_id = ${deckId})
  `

  try {
    const rows = (await query(sql)).rows
    sendSuccessResponse(response, rows)
  } catch (error: any) {
    console.log(error)
    sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
  }
}
