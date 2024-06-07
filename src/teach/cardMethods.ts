import 'scope-extensions-js'
import { endeavorDB } from '../databases/endeavorDB'
import { Schema } from 'express-validator'
import { sendSuccessResponse } from '../response/success'
import { Codes, sendErrorResponse } from '../response/error'
import { encode } from 'html-entities'
import SQL from 'sql-template-strings'
import { query } from '../databases/postgres'

export { RpcMethodName, rpcMethods }

type RpcMethodName = 'createCard' | 'addWordsToCard' | 'getCards'

const rpcMethods: Record<
  RpcMethodName,
  { rpcMethod: CallableFunction; rpcMethodParamsSchema: Schema }
> = {
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

async function addWordsToCard(request: any, response: any) {
  const teacherUsername = request.session.userInfo.username
  const {
    card_id,
    words,
  }: { card_id: number; words: { id: number; order: number }[] } =
    request.body.params

  /**
   * Two queries need to be used.
   * In order to use one query, the access check needs to be done together with INSERT
   * Several methods have been tried but none succeeded in achieving this.
   *   + WHERE EXISTS cannot be used with VALUES
   *   + Using INSERT with SELECT FROM a CTE or similar methods, for some unknown reason, causes RETURNING to return only one row.
   * Also, with two queries we can have a separate and more meaningful response for the case the teacher is not authorized.
   */
  try {
    // Check if the teacher has access right to the card
    const accessCheckSql = SQL`
      SELECT 1
      FROM teacher_course
      INNER JOIN course ON course.id = teacher_course.course_id
      INNER JOIN lesson ON lesson.course_id = course.id
      INNER JOIN card ON card.lesson_id = lesson.id
      WHERE teacher_course.teacher_username = ${teacherUsername}
      AND card.id = ${card_id};
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

    // Insert words into card_word table
    const insertSql = SQL`
      INSERT INTO card_word (card_id, word_id, word_order)
      VALUES 
    `.also((sql) => {
      words.forEach((word, index) => {
        sql.append(SQL`(${card_id}, ${word.id}, ${word.order})`)
        index <= words.length - 2 && sql.append(',')
      })
      sql.append(SQL`RETURNING *;`)
    })

    sendSuccessResponse(response, (await query(insertSql)).rows)
  } catch (error: any) {
    console.log(error)
    sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
  }
}

async function getCards(request: any, response: any) {
  const teacherUsername = request.session.userInfo.username
  const { courseId, lessonId } = request.body.params

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
    WHERE course.id = ${courseId}
    AND lesson.id = ${lessonId}
    AND EXISTS  (SELECT 1
                FROM teacher_course
                WHERE teacher_course.teacher_username = ${teacherUsername}
                AND course.id = ${courseId})
  `

  try {
    const rows = (await query(sql)).rows
    sendSuccessResponse(response, rows)
  } catch (error: any) {
    console.log(error)
    sendErrorResponse(response, Codes.RpcMethodInvocationError, error.message)
  }
}
