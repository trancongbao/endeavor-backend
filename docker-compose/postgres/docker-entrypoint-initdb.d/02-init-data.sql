-- Seed data for ADMIN table
INSERT INTO ADMIN (username, password, surname, given_name, email, phone, date_of_birth, address, avatar)
VALUES ('admin1', 'password1', 'Doe', 'John', 'john.doe@example.com', '+1234567890', '1990-01-01',
        '123 Main St, City, Country', 'https://example.com/avatar1.jpg'),
       ('admin2', 'password2', 'Smith', 'Alice', 'alice.smith@example.com', '+0987654321', '1985-05-15',
        '456 Elm St, City, Country', 'https://example.com/avatar2.jpg'),
       ('admin3', 'password3', 'Brown', 'Emma', 'emma.brown@example.com', '+1122334455', '1988-10-20',
        '789 Oak St, City, Country', 'https://example.com/avatar3.jpg'),
       ('admin4', 'password4', 'Wilson', 'David', 'david.wilson@example.com', '+5544332211', '1975-03-08',
        '101 Pine St, City, Country', 'https://example.com/avatar4.jpg'),
       ('admin5', 'password5', 'Johnson', 'Sarah', 'sarah.johnson@example.com', '+6677889900', '1995-12-25',
        '202 Cedar St, City, Country', 'https://example.com/avatar5.jpg');

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
VALUES (1, 1, 'Introduction', 'audio/intro_sql.mp3', null, null, null,
        'There are schools all around the world. There are big schools and little schools, new schools and old schools.
        Is your school big or little?
        Is your school new or old?
        *** Discover
        Now read and discover more about school!',
        current_timestamp),
       (1, 2, 'Introduction', 'audio/intro_sql.mp3', null, null, null,
        'There are schools all around the world. There are big schools and little schools, new schools and old schools.
        Is your school big or little?
        Is your school new or old?
        *** Discover
        Now read and discover more about school!',
        current_timestamp),
       (1, 3, 'Introduction', 'audio/intro_sql.mp3', null, null, null,
        'There are schools all around the world. There are big schools and little schools, new schools and old schools.
        Is your school big or little?
        Is your school new or old?
        *** Discover
        Now read and discover more about school!',
        current_timestamp),
       (1, 4, 'Introduction', 'audio/intro_sql.mp3', null, null, null,
        'There are schools all around the world. There are big schools and little schools, new schools and old schools.
        Is your school big or little?
        Is your school new or old?
        *** Discover
        Now read and discover more about school!',
        current_timestamp);

-- Sample data for CARD table
INSERT INTO CARD (id, lesson_id, card_order, front_text, front_audio_uri)
VALUES (1, 1, 1, 'Hello', 'audio/hello.mp3'),
       (2, 1, 2, 'Goodbye', 'audio/goodbye.mp3'),
       (3, 2, 1, 'Cat', 'audio/cat.mp3');

-- Sample data for WORD table
INSERT INTO WORD (id, word, definition, phonetic, part_of_speech, audio_uri, image_uri)
VALUES (1, 'hello', 'a common greeting', '[həˈloʊ]', 'Noun', 'audio/hello_word.mp3', 'images/hello.png'),
       (2, 'goodbye', 'a common parting phrase', '[ɡʊdˈbaɪ]', 'Noun', 'audio/goodbye_word.mp3', 'images/goodbye.png'),
       (3, 'cat', 'a small domesticated carnivorous mammal', '[kat]', 'Noun', 'audio/cat_word.mp3', 'images/cat.png'),
       (4, 'satisfy', 'to make (someone) happy or contented.', '[ˈsæt.ɪs.faɪ]', 'Verb', 'audio/satisfy_word.mp3',
        'images/satisfy.png');

-- Sample data for CARD_WORD table
INSERT INTO CARD_WORD (card_id, word_id, word_order)
VALUES (1, 1, 1), -- Hello
       (2, 2, 1), -- Goodbye
       (3, 3, 1); -- Cat
