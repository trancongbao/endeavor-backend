import "scope-extensions-js";
import endeavorDB from "../databases/endeavorDB";
import { Lesson } from "../databases/endeavorDB";
import { Insertable, Updateable } from "kysely";

export function createLesson(lesson: Insertable<Lesson>) {
  return endeavorDB.insertInto("lesson").values(lesson).returningAll().executeTakeFirstOrThrow();
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
