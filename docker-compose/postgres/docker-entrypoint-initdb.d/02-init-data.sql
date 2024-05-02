-- Seed data for TEACHER table
INSERT INTO TEACHER (username, password, surname, given_name, email, phone, date_of_birth, address, avatar)
VALUES ('teacher1', 'password1', 'Garcia', 'Carlos', 'carlos.garcia@example.com', '+1112223333', '1980-07-10',
        '111 Walnut St, City, Country', 'https://example.com/avatar6.jpg'),
       ('teacher2', 'password2', 'Martinez', 'Luisa', 'luisa.martinez@example.com', '+4445556666', '1972-09-12',
        '222 Maple St, City, Country', 'https://example.com/avatar7.jpg'),
       ('teacher3', 'password3', 'Lopez', 'Maria', 'maria.lopez@example.com', '+7778889999', '1983-04-18',
        '333 Oak St, City, Country', 'https://example.com/avatar8.jpg'),
       ('teacher4', 'password4', 'Hernandez', 'Juan', 'juan.hernandez@example.com', '+1231234567', '1978-11-30',
        '444 Elm St, City, Country', 'https://example.com/avatar9.jpg'),
       ('teacher5', 'password5', 'Gonzalez', 'Ana', 'ana.gonzalez@example.com', '+9998887776', '1987-02-28',
        '555 Cedar St, City, Country', 'https://example.com/avatar10.jpg');

-- Seed data for STUDENT table
INSERT INTO STUDENT (username, password, surname, given_name, email, phone, date_of_birth, address, avatar, proficiency)
VALUES ('student1', 'password1', 'Nguyen', 'Hoa', 'hoa.nguyen@example.com', '+1122334455', '1998-03-20',
        '123 Pine St, City, Country', 'https://example.com/avatar11.jpg', 3),
       ('student2', 'password2', 'Kim', 'Sung', 'sung.kim@example.com', '+9988776655', '1997-08-15',
        '456 Oak St, City, Country', 'https://example.com/avatar12.jpg', 2),
       ('student3', 'password3', 'Chen', 'Wei', 'wei.chen@example.com', '+6655443322', '1999-05-10',
        '789 Elm St, City, Country', 'https://example.com/avatar13.jpg', 1),
       ('student4', 'password4', 'Ali', 'Fatima', 'fatima.ali@example.com', '+5544332211', '1996-12-05',
        '101 Maple St, City, Country', 'https://example.com/avatar14.jpg', 2),
       ('student5', 'password5', 'Smith', 'Jake', 'jake.smith@example.com', '+3322114455', '2000-01-30',
        '202 Walnut St, City, Country', 'https://example.com/avatar15.jpg', 3);

-- Seed data for COURSE table
INSERT INTO COURSE (status, title, level, summary, description, thumbnail)
VALUES ('PUBLISHED', 'School', 1, null, null, null),
       ('PUBLISHED', 'In the Sky', 1, null, null, null),
       ('PUBLISHED', 'Fruit', 1, null, null, null),
       ('PUBLISHED', 'Trees', 1, null, null, null),
       ('PUBLISHED', 'Young Animals', 1, null, null, null);

-- Seed data for TEACHER_COURSE table
INSERT INTO TEACHER_COURSE (course_id, teacher_username)
VALUES (1, 'teacher1'),
       (2, 'teacher1'),
       (3, 'teacher1'),
       (4, 'teacher1'),
       (5, 'teacher1'),
       (2, 'teacher2'),
       (3, 'teacher3'),
       (4, 'teacher4'),
       (5, 'teacher5');

-- Seed data for LESSON table
INSERT INTO LESSON (course_id, lesson_order, title, audio, summary, description, thumbnail, content, updated_at)
VALUES (1, 0, 'Introduction', 'audio/intro_sql.mp3', null, null, null,
        'There are schools all around the world. There are big schools and little schools, new schools and old schools.
        Is your school big or little?
        Is your school new or old?
        *** Discover
        Now read and discover more about school!',
        current_timestamp),
       (1, 1, 'Chapter 1: Let''s Go to School ', 'audio/intro_sql.mp3', null, null, null,
        'All around the world, students go to school.
        Some students walk to school, and some go by bus or by train.
        Some students go by bicycle, and some go by car.
        These students are in the USA.
        They go to school by bus.
        In the snow in Canada, some students go to school by sled.
        In India, some students go to school by rickshaw.
        How do you go to school?
        ',
        current_timestamp),
       (1, 2, 'Chapter 2: Buildings', 'audio/intro_sql.mp3', null, null, null,
        'Let''s look at school buildings around the world.
        This school is in Australia.
        It''s in the countryside.
        It''s a little school, but many schools in Australia are big.
        Here''s a big school in a city.
        Many students go to this school.
        It has a big school playground.
        This school is in South Korea.
        *** Discover
        For these students in Nepal, the countryside is their school!',
        current_timestamp),
       (1, 3, 'Chapter 3: At School', 'audio/intro_sql.mp3', null, null, null,
        'These students are at school.
        They meet their friends.
        They talk and they are happy.
        Listen! That''s the bell.
        Let''s go to the classroom.
        The students stand in the hallway by the door.
        The teacher says, ‘Hello, everyone’.
        These students have books and notebooks.
        Can you see them?
        No, you can''t.
        They are in their bags.
        *** Discover
        One school in China is in a cave.',
        current_timestamp);

-- Sample data for CARD table
INSERT INTO CARD (id, lesson_id, card_order, front_text, front_audio_uri)
VALUES (1, 1, 1, '#There are# schools #all around the world#.', null),
       (2, 1, 2, '#There are# big schools and little schools, new schools and old schools.', null),
       (3, 1, 3, 'Is your school #big# or #little#?', null),
       (4, 1, 4, 'Is your school #new# or #old#?', null);

-- Sample data for WORD table
INSERT INTO WORD (id, word, definition, phonetic, part_of_speech, audio_uri, image_uri)
VALUES (1, 'there are', 'có', null, null, null, null),
       (2, 'all the around the word', 'khắp thế giới', null, null, null, null),
       (3, 'big', 'to, lớn', null, null, null, null),
       (4, 'little', 'nhỏ', null, null, null, null),
       (5, 'new', 'mới', null, null, null, null),
       (6, 'old', 'cũ', null, null, null, null);

-- Sample data for CARD_WORD table
INSERT INTO CARD_WORD (card_id, word_id, word_order)
VALUES (1, 1, 1),
       (1, 2, 2),
       (2, 1, 1),
       (3, 3, 1),
       (3, 4, 2),
       (4, 5, 1),
       (4, 6, 2);
