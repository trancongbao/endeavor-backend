import "scope-extensions-js";
import { Pool } from "pg";
import { Kysely, PostgresDialect, Generated, ColumnType } from "kysely";

export default new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres_user",
  password: "postgres_password",
  database: "postgres_db",
  max: 10,
})
  .let((pool) => new PostgresDialect({ pool }))
  .let((dialect) => new Kysely<EndeavorDB>({ dialect }));

interface EndeavorDB {
  admin: Admin;
  teacher: Teacher;
  student: Student;
  course: Course;
  lesson: Lesson;
  card: Card;
  word: Word;
}

export interface Admin {
  username: string;
  password: string;
  surname: string;
  given_name: string;
  email: string;
  phone: string;
  date_of_birth: Date;
  address: string;
  avatar?: string;
}

export interface Student {
  username: string;
  password: string;
  surname: string;
  given_name: string;
  email: string;
  phone: string;
  date_of_birth: Date;
  address: string;
  avatar: string;
  proficiency: number;
}

export interface Teacher {
  username: string;
  password: string;
  surname: string;
  given_name: string;
  email: string;
  phone: string;
  date_of_birth: Date;
  address: string;
  avatar: string;
}

export interface Course {
  id: Generated<number>;
  status: CourseStatus;
  title: string;
  level: number;
  summary?: string;
  description?: string;
  thumbnail?: string;
  updated_at: ColumnType<Date, string | undefined, never>;
}

enum CourseStatus {
  DRAFT = "DRAFT",
  IN_REVIEW = "IN_REVIEW",
  APPROVED = "APPROVED",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface Lesson {
  id: Generated<number>;
  course_id: number;
  order: number;
  title: string;
  audio: string;
  summary?: string;
  description?: string;
  thumbnail?: string;
  content?: string;
  updated_at: Date;
}

export interface Card {
  id: Generated<number>;
  lesson_id: number;
  front_text?: string;
  front_audio_uri?: string;
}

export interface Word {
  id: Generated<number>;
  word: string;
  definition: string;
  phonetic: string;
  part_of_speech: string;
  audio_uri: string;
  image_uri: string;
}
