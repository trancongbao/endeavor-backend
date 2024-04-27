-- Define table structure for administrators
CREATE TABLE ADMIN
(
    username      VARCHAR(255) PRIMARY KEY,     -- Unique identifier for the administrator
    password      VARCHAR(255) NOT NULL,        -- Password for the administrator
    surname       VARCHAR(255) NOT NULL,        -- Surname of the administrator
    given_name    VARCHAR(255) NOT NULL,        -- Given name of the administrator
    email         VARCHAR(255) NOT NULL,        -- Email of the administrator
    phone         VARCHAR(255) NOT NULL,        -- Phone number of the administrator
    date_of_birth DATE         NOT NULL,        -- Date of birth of the administrator
    address       TEXT         NOT NULL,        -- Address of the administrator
    avatar        VARCHAR(255)                  -- URL/path to the administrator's avatar
);

-- Define table structure for teachers
CREATE TABLE TEACHER
(
    username      VARCHAR(255) PRIMARY KEY,     -- Unique identifier for the teacher
    password      VARCHAR(255) NOT NULL,        -- Password for the teacher
    surname       VARCHAR(255) NOT NULL,        -- Surname of the teacher
    given_name    VARCHAR(255) NOT NULL,        -- Given name of the teacher
    email         VARCHAR(255) NOT NULL,        -- Email of the teacher
    phone         VARCHAR(255) NOT NULL,        -- Phone number of the teacher
    date_of_birth DATE         NOT NULL,        -- Date of birth of the teacher
    address       TEXT         NOT NULL,        -- Address of the teacher
    avatar        VARCHAR(255)                  -- URL/path to the teacher's avatar
);

-- Define table structure for students
CREATE TABLE STUDENT
(
    username      VARCHAR(255) PRIMARY KEY,     -- Unique identifier for the student
    password      VARCHAR(255) NOT NULL,        -- Password for the student
    surname       VARCHAR(255) NOT NULL,        -- Surname of the student
    given_name    VARCHAR(255) NOT NULL,        -- Given name of the student
    email         VARCHAR(255),                 -- Email of the student
    phone         VARCHAR(255),                 -- Phone number of the student
    date_of_birth DATE         NOT NULL,        -- Date of birth of the student
    address       TEXT         NOT NULL,        -- Address of the student
    avatar        VARCHAR(255),                 -- URL/path to the student's avatar
    proficiency   INTEGER                       -- Proficiency level of the student
);

-- Define custom enumeration type for course status
CREATE TYPE COURSE_STATUS AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED');
-- Define table structure for courses
CREATE TABLE COURSE
(
    id          SERIAL PRIMARY KEY,                 -- Unique identifier for the course
    status      COURSE_STATUS,                      -- Status of the course
    title       VARCHAR(255) NOT NULL,              -- Title of the course
    level       INT          NOT NULL,              -- Level of the course
    summary     VARCHAR(255),                       -- Summary of the course
    description TEXT,                               -- Detailed description of the course
    thumbnail   VARCHAR(255),                       -- URL/path to the course thumbnail
    updated_at  timestamp default current_timestamp -- Timestamp of the last update
);