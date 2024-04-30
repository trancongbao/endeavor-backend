-- Seed data for COURSE table
INSERT INTO COURSE (status, title, level, summary, description, thumbnail)
VALUES
    ('PUBLISHED', 'Introduction to Programming', 1, 'Learn the basics of programming', 'This course covers fundamental programming concepts such as variables, loops, and functions.', 'https://example.com/thumbnail1.jpg'),
    ('APPROVED', 'Web Development Fundamentals', 2, 'Introduction to web development technologies', 'Explore HTML, CSS, and JavaScript to build interactive websites.', 'https://example.com/thumbnail2.jpg'),
    ('PUBLISHED', 'Data Science Essentials', 3, 'Introduction to data science techniques', 'Learn data analysis, visualization, and machine learning basics using Python.', 'https://example.com/thumbnail3.jpg'),
    ('DRAFT', 'Mobile App Development', 2, 'Building apps for iOS and Android', 'Explore mobile app development using frameworks like React Native and Flutter.', 'https://example.com/thumbnail4.jpg'),
    ('IN_REVIEW', 'Database Management', 3, 'Understanding database concepts and SQL', 'Learn about database design, normalization, and SQL queries.', 'https://example.com/thumbnail5.jpg'),
    ('PUBLISHED', 'Machine Learning Fundamentals', 3, 'Introduction to machine learning algorithms', 'Cover basic machine learning concepts such as regression, classification, and clustering.', 'https://example.com/thumbnail6.jpg'),
    ('APPROVED', 'Graphic Design Basics', 2, 'Introduction to graphic design principles', 'Learn about color theory, typography, and layout design.', 'https://example.com/thumbnail7.jpg'),
    ('PUBLISHED', 'Digital Marketing Fundamentals', 2, 'Introduction to digital marketing strategies', 'Explore topics like SEO, SEM, social media marketing, and email marketing.', 'https://example.com/thumbnail8.jpg'),
    ('DRAFT', 'Blockchain Fundamentals', 3, 'Understanding blockchain technology', 'Learn about blockchain architecture, consensus mechanisms, and smart contracts.', 'https://example.com/thumbnail9.jpg'),
    ('APPROVED', 'English Language Basics', 1, 'Introduction to English language skills', 'Cover basic grammar, vocabulary, and conversation skills in English.', 'https://example.com/thumbnail10.jpg');

-- Seed data for ADMIN table
INSERT INTO ADMIN (username, password, surname, given_name, email, phone, date_of_birth, address, avatar)
VALUES
    ('admin1', 'password1', 'Doe', 'John', 'john.doe@example.com', '+1234567890', '1990-01-01', '123 Main St, City, Country', 'https://example.com/avatar1.jpg'),
    ('admin2', 'password2', 'Smith', 'Alice', 'alice.smith@example.com', '+0987654321', '1985-05-15', '456 Elm St, City, Country', 'https://example.com/avatar2.jpg'),
    ('admin3', 'password3', 'Brown', 'Emma', 'emma.brown@example.com', '+1122334455', '1988-10-20', '789 Oak St, City, Country', 'https://example.com/avatar3.jpg'),
    ('admin4', 'password4', 'Wilson', 'David', 'david.wilson@example.com', '+5544332211', '1975-03-08', '101 Pine St, City, Country', 'https://example.com/avatar4.jpg'),
    ('admin5', 'password5', 'Johnson', 'Sarah', 'sarah.johnson@example.com', '+6677889900', '1995-12-25', '202 Cedar St, City, Country', 'https://example.com/avatar5.jpg');

-- Seed data for TEACHER table
INSERT INTO TEACHER (username, password, surname, given_name, email, phone, date_of_birth, address, avatar)
VALUES
    ('teacher1', 'password1', 'Garcia', 'Carlos', 'carlos.garcia@example.com', '+1112223333', '1980-07-10', '111 Walnut St, City, Country', 'https://example.com/avatar6.jpg'),
    ('teacher2', 'password2', 'Martinez', 'Luisa', 'luisa.martinez@example.com', '+4445556666', '1972-09-12', '222 Maple St, City, Country', 'https://example.com/avatar7.jpg'),
    ('teacher3', 'password3', 'Lopez', 'Maria', 'maria.lopez@example.com', '+7778889999', '1983-04-18', '333 Oak St, City, Country', 'https://example.com/avatar8.jpg'),
    ('teacher4', 'password4', 'Hernandez', 'Juan', 'juan.hernandez@example.com', '+1231234567', '1978-11-30', '444 Elm St, City, Country', 'https://example.com/avatar9.jpg'),
    ('teacher5', 'password5', 'Gonzalez', 'Ana', 'ana.gonzalez@example.com', '+9998887776', '1987-02-28', '555 Cedar St, City, Country', 'https://example.com/avatar10.jpg');

-- Seed data for STUDENT table
INSERT INTO STUDENT (username, password, surname, given_name, email, phone, date_of_birth, address, avatar, proficiency)
VALUES
    ('student1', 'password1', 'Nguyen', 'Hoa', 'hoa.nguyen@example.com', '+1122334455', '1998-03-20', '123 Pine St, City, Country', 'https://example.com/avatar11.jpg', 3),
    ('student2', 'password2', 'Kim', 'Sung', 'sung.kim@example.com', '+9988776655', '1997-08-15', '456 Oak St, City, Country', 'https://example.com/avatar12.jpg', 2),
    ('student3', 'password3', 'Chen', 'Wei', 'wei.chen@example.com', '+6655443322', '1999-05-10', '789 Elm St, City, Country', 'https://example.com/avatar13.jpg', 1),
    ('student4', 'password4', 'Ali', 'Fatima', 'fatima.ali@example.com', '+5544332211', '1996-12-05', '101 Maple St, City, Country', 'https://example.com/avatar14.jpg', 2),
    ('student5', 'password5', 'Smith', 'Jake', 'jake.smith@example.com', '+3322114455', '2000-01-30', '202 Walnut St, City, Country', 'https://example.com/avatar15.jpg', 3);

-- Seed data for TEACHER_COURSE table
INSERT INTO TEACHER_COURSE (course_id, teacher_username)
VALUES
    (1, 'teacher1'),  -- Introduction to Programming taught by teacher1
    (2, 'teacher2'),  -- Web Development Fundamentals taught by teacher2
    (3, 'teacher3'),  -- Data Science Essentials taught by teacher3
    (4, 'teacher4'),  -- Mobile App Development taught by teacher4
    (5, 'teacher5'),  -- Database Management taught by teacher5
    (6, 'teacher1'),  -- Machine Learning Fundamentals taught by teacher1
    (7, 'teacher2'),  -- Graphic Design Basics taught by teacher2
    (8, 'teacher3'),  -- Digital Marketing Fundamentals taught by teacher3
    (9, 'teacher4'),  -- Blockchain Fundamentals taught by teacher4
    (10, 'teacher5'); -- English Language Basics taught by teacher5