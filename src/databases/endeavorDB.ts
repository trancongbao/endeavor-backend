import "scope-extensions-js";
import {Pool} from "pg";
import {Kysely, PostgresDialect, Generated, ColumnType} from "kysely";

export {endeavorDB, Admin, Teacher, Student, Course, CourseStatus, Lesson, Card, Word}

const endeavorDB = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres_user",
    password: "postgres_password",
    database: "postgres_db",
    max: 10,
})
    .let((pool) => new PostgresDialect({pool}))
    .let((dialect) => new Kysely<EndeavorDB>({dialect}));

interface EndeavorDB {
    admin: Admin;
    teacher: Teacher;
    student: Student;
    teacher_course: TeacherCourse;
    course: Course;
    lesson: Lesson;
    card: Card;
    word: Word;
    card_word: CardWord
}

interface Admin {
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

interface Student {
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

interface Teacher {
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

interface TeacherCourse {
    teacher_username: string;
    course_id: number
}

interface Course {
    id: Generated<number>;
    level: number;
    title: string;
    status: CourseStatus;
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

interface Lesson {
    id: Generated<number>;
    course_id: number;
    lesson_order: number;
    title: string;
    audio: string;
    summary?: string;
    description?: string;
    thumbnail?: string;
    content?: string;
    updated_at: ColumnType<Date, string | undefined, never>;
}

interface Card {
    id: Generated<number>;
    lesson_id: number;
    card_order: number;
    front_text: string;
    front_audio_uri?: string;
}

interface Word {
    id: Generated<number>;
    word: string;
    definition: string;
    phonetic: string;
    part_of_speech: string;
    audio_uri: string;
    image_uri: string;
}

interface CardWord {
    card_id: number;
    word_id: number;
    word_order: number
}