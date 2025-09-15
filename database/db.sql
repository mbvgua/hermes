-- create and use the db
CREATE DATABASE hermes;
USE hermes;

CREATE TABLE users (
    -- SERIAL DEFAULT VALUE equates to NOT NULL AUTO_INCREMENT UNIQUE
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL ,
    email VARCHAR(100) UNIQUE NOT NULL ,
    password VARCHAR(255) NOT NULL,
    role ENUM("admin","customer") NOT NULL,
    created_at DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    is_deleted BOOLEAN DEFAULT 0
);

-- DUMP USERS
INSERT INTO users VALUES
    ("1",'lance','lance@gmail.com','!1Lance!','customer',DEFAULT,DEFAULT),
    ("2",'mende','mende@gmail.com','@1Mende!','customer',DEFAULT,DEFAULT),
    ("3",'cindy','cindy@gmail.com','@1Cindy!','customer',DEFAULT,DEFAULT);

CREATE TABLE user_details(
    -- SERIAL DEFAULT VALUE equates to NOT NULL AUTO_INCREMENT UNIQUE
    id INT PRIMARY KEY SERIAL DEFAULT VALUE,
    user_id VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    dob DATETIME,
    phone_number VARCHAR(50),
    gender ENUM("male","female"),
    shipping_address VARCHAR(100),
    payment_method ENUM("mpesa","paypal","credit card"),
    referral_code VARCHAR(255),
    language ENUM("english","swahili"),
    timezone VARCHAR(255),
    marketing_emails BOOLEAN DEFAULT 1,
    promotional_emails BOOLEAN DEFAULT 1,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE products(
    -- SERIAL DEFAULT VALUE equates to NOT NULL AUTO_INCREMENT UNIQUE
    id INT PRIMARY KEY SERIAL DEFAULT VALUE,
    name VARCHAR(255) NOT NULL UNIQUE,
    category ENUM("electronics","clothing","sports","stationery","food","toys") NOT NULL,
    description VARCHAR(255) NOT NULL DEFAULT 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    image VARCHAR(255) NOT NULL DEFAULT 'https://dummyimage.com/720x600',
    price DECIMAL(10,2) NOT NULL,
    in_stock INT DEFAULT 1 NOT NULL,
    is_deleted BOOLEAN DEFAULT 0 NOT NULL
);

-- dummy data
INSERT INTO products VALUES
    (DEFAULT,'earphones',"electronics",DEFAULT,'https://cdn.pixabay.com/photo/2014/04/05/11/41/earphone-316753_640.jpg',300.50,20,DEFAULT),
    (DEFAULT,'joy stick',"electronics",DEFAULT,'https://cdn.pixabay.com/photo/2016/07/22/15/11/android-tv-game-controller-1535038_640.jpg',500.00,10,DEFAULT),
    (DEFAULT,'rubix cube',"electronics",DEFAULT,'https://cdn.pixabay.com/photo/2019/03/03/00/35/cinema-4d-4030940_640.jpg',100.50,30,DEFAULT),
    (DEFAULT,'lighter',"electronics",DEFAULT,'https://cdn.pixabay.com/photo/2017/08/17/13/09/lighter-2651263_640.jpg',20.00,50,DEFAULT),
    (DEFAULT,'television',"electronics",DEFAULT,'https://cdn.pixabay.com/photo/2017/08/10/07/44/tv-2619649_640.jpg',20000.5,5,DEFAULT);


CREATE TABLE orders (
    id INT PRIMARY KEY SERIAL DEFAULT VALUE,
    user_id VARCHAR(255),
    order_details JSON,
    total_price DECIMAL(10,2) NOT NULL,
    is_cancelled BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- dummy data
INSERT INTO orders VALUES
    (DEFAULT,"1",'{"itemId":1,"itemQuantity":3,"itemPrice":300.50}',901.50,0),
    (DEFAULT,"2",'{"itemId":2,"itemQuantity":5,"itemPrice":500.00}',2500.00,0),
    (DEFAULT,"3",'{"itemId":4,"itemQuantity":1,"itemPrice":20.00}',20.00,0);

CREATE TABLE payments (
    id VARCHAR(255) PRIMARY KEY,
    method ENUM("mpesa","paypal","credit card") NOT NULL,
    status ENUM("success","refunded","failed") NOT NULL,
    transaction_id VARCHAR(255),
    user_id VARCHAR(255),
    order_id INT,
    amount INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- change delimiter to prevent errors in stored procedures
DELIMITER #

-- START USERS SPs
-- addUser
CREATE PROCEDURE addUser(
    IN new_id VARCHAR(255),
    IN new_username VARCHAR(100),
    IN new_email VARCHAR(100),
    IN new_password VARCHAR(255),
    IN new_role ENUM("admin","customer")
)
BEGIN
    DECLARE existing_account INT DEFAULT 0;
    DECLARE rollback_message VARCHAR(255) DEFAULT 'Transaction rolled back: User already exists';
    DECLARE commit_message VARCHAR(255) DEFAULT 'Transaction committed successfully';

    -- start transaction
    START TRANSACTION;

    -- check if email/username already exists
    SELECT COUNT(*) INTO existing_account FROM users
    WHERE username=new_username OR email=new_email;

    IF existing_account > 0 THEN
        -- rollback if existing
        ROLLBACK;
        SIGNAL SQLSTATE "45000"
            SET MESSAGE_TEXT = rollback_message;
    ELSE
        INSERT INTO users(id,username,email,password,role)
        VALUES (new_id,new_username,new_email,new_password,new_role);

        -- commit transaction
        COMMIT;
        SELECT commit_message AS "result";
    END IF;
END#

-- getUserById
CREATE PROCEDURE getUserById(
    IN user_id VARCHAR(255)
)
BEGIN
    SELECT * FROM users
    WHERE id=user_id AND is_deleted=0;
END#

-- getUserByEmail
CREATE PROCEDURE getUserByEmail(
    IN user_email VARCHAR(100)
)
BEGIN
    SELECT * FROM users
    WHERE email=user_email AND is_deleted=0;
END#

-- getUsers
CREATE PROCEDURE getUsers()
BEGIN
    SELECT * FROM users WHERE is_deleted=0;
END#

-- updateUser
CREATE PROCEDURE updateUser(
    IN user_id VARCHAR(255),
    IN new_username VARCHAR(100),
    IN new_email VARCHAR(100),
    IN new_password VARCHAR(255),
    IN new_role ENUM("admin","customer")
)
BEGIN
    DECLARE existing_account INT DEFAULT 0;
    DECLARE rollback_message VARCHAR(255) DEFAULT 'Transaction rolled back: User already exists';
    DECLARE commit_message VARCHAR(255) DEFAULT 'Transaction committed successfully';

    START TRANSACTION;

    SELECT COUNT(*) INTO existing_account FROM users
    WHERE username=new_username OR email=new_email;

    IF existing_account > 0 THEN
        ROLLBACK;
        SIGNAL SQLSTATE "45000"
            SET MESSAGE_TEXT = rollback_message;
    ELSE
        UPDATE users
        SET username=new_username,email=new_email,password=nwe_password,role=new_role
        WHERE id=user_id;

        COMMIT;
        SELECT commit_message AS "result";
    END IF;
END#

-- updatePassword
CREATE PROCEDURE updatePassword(
    IN user_id VARCHAR(255),
    IN new_password VARCHAR(255)
)
BEGIN
    UPDATE users SET password=new_password
    WHERE id=user_id AND is_deleted=0;
END#

-- deleteUser
CREATE PROCEDURE deleteUser(
    IN user_id VARCHAR(255)
)
BEGIN
    UPDATE user SET is_deleted=0 WHERE id=user_id;
END#
-- END USERS SPs

-- START USER_DETAILS SPs
-- END USER_DETAILS SPs

-- START PRODUCTS SPs
-- END PRODUCTS SPs

-- START ORDERS SPs
-- END ORDERS SPs

-- START PAYMENTS SPs
-- END PAYMENTS SPs

-- return to normal delimiter
DELIMITER ;
