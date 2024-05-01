-- Define table structure for administrators
CREATE TABLE ADMIN
(
    username      VARCHAR(255) PRIMARY KEY, -- Unique identifier for the administrator
    password      VARCHAR(255) NOT NULL,    -- Password for the administrator
    surname       VARCHAR(255) NOT NULL,    -- Surname of the administrator
    given_name    VARCHAR(255) NOT NULL,    -- Given name of the administrator
    email         VARCHAR(255) NOT NULL,    -- Email of the administrator
    phone         VARCHAR(255) NOT NULL,    -- Phone number of the administrator
    date_of_birth DATE         NOT NULL,    -- Date of birth of the administrator
    address       TEXT         NOT NULL,    -- Address of the administrator
    avatar        VARCHAR(255)              -- URL/path to the administrator's avatar
);

-- Define table structure for teachers
CREATE TABLE TEACHER
(
    username      VARCHAR(255) PRIMARY KEY, -- Unique identifier for the teacher
    password      VARCHAR(255) NOT NULL,    -- Password for the teacher
    surname       VARCHAR(255) NOT NULL,    -- Surname of the teacher
    given_name    VARCHAR(255) NOT NULL,    -- Given name of the teacher
    email         VARCHAR(255) NOT NULL,    -- Email of the teacher
    phone         VARCHAR(255) NOT NULL,    -- Phone number of the teacher
    date_of_birth DATE         NOT NULL,    -- Date of birth of the teacher
    address       TEXT         NOT NULL,    -- Address of the teacher
    avatar        VARCHAR(255)              -- URL/path to the teacher's avatar
);

-- Define table structure for students
CREATE TABLE STUDENT
(
    username      VARCHAR(255) PRIMARY KEY, -- Unique identifier for the student
    password      VARCHAR(255) NOT NULL,    -- Password for the student
    surname       VARCHAR(255) NOT NULL,    -- Surname of the student
    given_name    VARCHAR(255) NOT NULL,    -- Given name of the student
    email         VARCHAR(255),             -- Email of the student
    phone         VARCHAR(255),             -- Phone number of the student
    date_of_birth DATE         NOT NULL,    -- Date of birth of the student
    address       TEXT         NOT NULL,    -- Address of the student
    avatar        VARCHAR(255),             -- URL/path to the student's avatar
    proficiency   INTEGER                   -- Proficiency level of the student
);

-- Define custom enumeration type for course status
CREATE TYPE COURSE_STATUS AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED');
-- Define table structure for courses
CREATE TABLE COURSE
(
    id          SERIAL PRIMARY KEY,                 -- Unique identifier for the course
    level       INT          NOT NULL,              -- Level of the course
    title       VARCHAR(255) NOT NULL,              -- Title of the course
    status      COURSE_STATUS,                      -- Status of the course
    summary     VARCHAR(255),                       -- Summary of the course
    description TEXT,                               -- Detailed description of the course
    thumbnail   VARCHAR(255),                       -- URL/path to the course thumbnail
    updated_at  timestamp default current_timestamp,-- Timestamp of the last update
    CONSTRAINT unique_status_title_level UNIQUE (status, title, level)
);

CREATE TABLE TEACHER_COURSE
(
    course_id           INT NOT NULL REFERENCES COURSE (id),                   -- Reference to the id column of COURSE table
    teacher_username    VARCHAR(255) NOT NULL REFERENCES TEACHER (username),   -- Reference to the username column of TEACHER table
    CONSTRAINT unique_teacher_id_course_id UNIQUE (course_id, teacher_username)
);

CREATE TABLE LESSON
(
    id              SERIAL PRIMARY KEY,                 -- Unique identifier for the lesson, auto-incremented
    course_id       INTEGER REFERENCES COURSE (id),     -- Foreign key referencing the course that the lesson belongs to
    lesson_order    INTEGER      NOT NULL,              -- Order of the lesson within the course, cannot be null
    title           VARCHAR(255) NOT NULL,              -- Title of the lesson, cannot be null
    audio           VARCHAR(255) NOT NULL,              -- Path to the audio file for the lesson, cannot be null
    summary         TEXT,                               -- Summary of the lesson
    description     TEXT,                               -- Description of the lesson
    thumbnail       VARCHAR(255),                       -- Path to the thumbnail image for the lesson
    content         TEXT,                               -- Content of the lesson
    updated_at      timestamp default current_timestamp,-- Timestamp of the last update
    CONSTRAINT unique_course_id_order UNIQUE (course_id, lesson_order)
);

-- Table definition for CARD
CREATE TABLE CARD
(
    id              INTEGER PRIMARY KEY,           -- Unique identifier for the card
    lesson_id       INTEGER REFERENCES LESSON (id),-- Foreign key referencing lesson
    front_text      TEXT,                          -- Text on the front side of the card
    front_audio_uri TEXT                           -- URI for audio associated with the front side
);

-- Table definition for WORD
CREATE TABLE WORD
(
    id              INTEGER         PRIMARY KEY,    -- Unique identifier for the word
    word            VARCHAR(255)    NOT NULL,       -- The word itself
    definition      TEXT            NOT NULL,       -- Definition of the word
    phonetic        VARCHAR(255)    NOT NULL,       -- Phonetic pronunciation of the word
    part_of_speech  VARCHAR(255)    NOT NULL,       -- Part of speech of the word
    audio_uri       TEXT,                           -- URI for audio associated with the word
    image_uri       TEXT                            -- URI for image associated with the word
);

-- Table definition for CARD_WORD
CREATE TABLE CARD_WORD
(
    card_id         INTEGER REFERENCES CARD (id),   -- Foreign key referencing card
    word_id         INTEGER REFERENCES WORD (id),   -- Foreign key referencing word
    word_order      INTEGER,                        -- Relative order of the word in the card
    PRIMARY KEY (card_id, word_id)                  -- Composite primary key
);
