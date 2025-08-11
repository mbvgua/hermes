CREATE TABLE users (
    -- SERIAL DEFAULT VALUE equates to NOT NULL AUTO_INCREMENT UNIQUE
    id INT PRIMARY KEY SERIAL DEFAULT VALUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer','admin') NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    isDeleted BOOLEAN DEFAULT 0
);

-- DUMP USERS
INSERT INTO users VALUES
    (DEFAULT,'admin','admin@gmail.com','@1Admin!','admin',DEFAULT,DEFAULT),
    (DEFAULT,'lance','lance@gmail.com','!1Lance!','customer',DEFAULT,DEFAULT),
    (DEFAULT,'mende','mende@gmail.com','@1Mende!','customer',DEFAULT,DEFAULT),
    (DEFAULT,'cindy','cindy@gmail.com','@1Cindy!','customer',DEFAULT,DEFAULT);