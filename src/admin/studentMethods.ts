import "scope-extensions-js";
import bcrypt from "bcryptjs";
import endeavorDB from "../databases/endeavorDB";
import { StudentTable } from "../databases/endeavorDB";
import { Insertable, Updateable } from "kysely";

export function createStudent(student: Insertable<StudentTable>) {
  bcrypt.hash(student.password, 13, (_, hashedPassword) => {
    student.password = hashedPassword;
  });

  return endeavorDB.insertInto("student").values(student).returningAll().executeTakeFirstOrThrow();
}

export function readStudent({ username }: { username: string }) {
  return endeavorDB.selectFrom("student").selectAll().where("username", "=", username).executeTakeFirstOrThrow();
}

export function updateStudent(student: Updateable<StudentTable>) {
  return endeavorDB
    .updateTable("student")
    .where("username", "=", student.username!!)
    .set(student)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export function deleteStudent({ username }: { username: string }) {
  return endeavorDB.deleteFrom("student").where("username", "=", username).returningAll().executeTakeFirstOrThrow();
}
