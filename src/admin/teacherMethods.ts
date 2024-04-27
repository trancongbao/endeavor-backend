import bcrypt from "bcryptjs";
import endeavorDB, { Teacher } from "../databases/endeavorDB";
import { Insertable, Updateable } from "kysely";

export function createTeacher(teacher: Insertable<Teacher>) {
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
