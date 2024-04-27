import "scope-extensions-js";
import endeavorDB from "../databases/endeavorDB";
import { CourseTable } from "../databases/endeavorDB";
import { Insertable, Updateable } from "kysely";

export function createCourse(course: Insertable<CourseTable>) {
  return endeavorDB.insertInto("course").values(course).returningAll().executeTakeFirstOrThrow();
}

export function readCourse({ id }: { id: number }) {
  return endeavorDB.selectFrom("course").selectAll().where("id", "=", id).executeTakeFirstOrThrow();
}

export function updateCourse(course: Updateable<CourseTable>) {
  return endeavorDB
    .updateTable("course")
    .where("id", "=", course.id!!)
    .set(course)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export function deleteCourse({ id }: { id: number }) {
  return endeavorDB.deleteFrom("course").where("id", "=", id).returningAll().executeTakeFirstOrThrow();
}

export function submitCourse() {}
