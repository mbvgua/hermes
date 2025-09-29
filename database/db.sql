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
    -- id INT PRIMARY KEY SERIAL DEFAULT VALUE,
    id VARCHAR(25) PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    category ENUM("electronics","clothing","sports","stationery","food","toys") NOT NULL,
    description TEXT NOT NULL ,
    image VARCHAR(250) NOT NULL DEFAULT 'https://dummyimage.com/720x600',
    price DECIMAL(10,2) NOT NULL,
    in_stock INT DEFAULT 1 NOT NULL,
    is_deleted BOOLEAN DEFAULT 0 NOT NULL
);


CREATE TABLE orders (
    id INT PRIMARY KEY SERIAL DEFAULT VALUE,
    user_id VARCHAR(255),
    order_details JSON,
    total_price DECIMAL(10,2) NOT NULL,
    is_cancelled BOOLEAN DEFAULT 0 NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);


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
    IN u_id VARCHAR(255),
    IN u_username VARCHAR(100),
    IN u_email VARCHAR(100),
    IN u_password VARCHAR(255),
    IN u_role ENUM("admin","customer")
)
BEGIN
    DECLARE existing_account INT DEFAULT 0;
    DECLARE rollback_message VARCHAR(255) DEFAULT 'Transaction rolled back: User already exists';
    DECLARE commit_message VARCHAR(255) DEFAULT 'Transaction committed successfully';

    -- start transaction
    START TRANSACTION;

    -- check if email/username already exists
    SELECT COUNT(*) INTO existing_account FROM users
    WHERE username=u_username OR email=u_email;

    IF existing_account > 0 THEN
        -- rollback if existing
        ROLLBACK;
        SIGNAL SQLSTATE "45000"
            SET MESSAGE_TEXT = rollback_message;
    ELSE
        INSERT INTO users(id,username,email,password,role)
        VALUES (u_id,u_username,u_email,u_password,u_role);

        -- commit transaction
        COMMIT;
        SELECT commit_message AS "result";
    END IF;
END#

-- getUserById
CREATE PROCEDURE getUserById(
    IN u_id VARCHAR(255)
)
BEGIN
    SELECT * FROM users
    WHERE id=u_id AND is_deleted=0;
END#

-- getUserByEmail
CREATE PROCEDURE getUserByEmail(
    IN u_email VARCHAR(100)
)
BEGIN
    SELECT * FROM users
    WHERE email=u_email AND is_deleted=0;
END#

-- getUserByUsername
CREATE PROCEDURE getUserByUsername(
    IN u_username VARCHAR(100)
)
BEGIN
    SELECT * FROM users
    WHERE username=u_username AND is_deleted=0;
END#

-- getUsers
CREATE PROCEDURE getUsers()
BEGIN
    SELECT * FROM users WHERE is_deleted=0;
END#

-- updateUser
CREATE PROCEDURE updateUser(
    IN u_id VARCHAR(255),
    IN u_username VARCHAR(100),
    IN u_email VARCHAR(100),
    IN u_password VARCHAR(255)
)
BEGIN
    DECLARE existing_account INT DEFAULT 0;
    DECLARE rollback_message VARCHAR(255) DEFAULT 'Transaction rolled back: User already exists';
    DECLARE commit_message VARCHAR(255) DEFAULT 'Transaction committed successfully';

    START TRANSACTION;

    SELECT COUNT(*) INTO existing_account FROM users
    WHERE username=u_username OR email=u_email;

    IF existing_account > 0 THEN
        ROLLBACK;
        SIGNAL SQLSTATE "45000"
            SET MESSAGE_TEXT = rollback_message;
    ELSE
        UPDATE users
        SET username=u_username,email=u_email,password=u_password
        WHERE id=u_id;

        COMMIT;
        SELECT commit_message AS "result";
    END IF;
END#

-- updatePassword
CREATE PROCEDURE updatePassword(
    IN u_id VARCHAR(255),
    IN u_password VARCHAR(255)
)
BEGIN
    UPDATE users SET password=u_password
    WHERE id=u_id AND is_deleted=0;
END#

-- deleteUser
CREATE PROCEDURE deleteUser(
    IN u_id VARCHAR(255)
)
BEGIN
    DECLARE existing_account INT DEFAULT 0;
    DECLARE rollback_message VARCHAR(255) DEFAULT 'Transaction rolled back: User does not exists';
    DECLARE commit_message VARCHAR(255) DEFAULT 'Transaction committed successfully';

    START TRANSACTION;

    SELECT COUNT(*) INTO existing_account FROM users
    WHERE id=u_id AND is_deleted=0;

    IF existing_account > 0 THEN
        UPDATE users SET is_deleted=1 WHERE id=u_id;

        COMMIT;
        SELECT commit_message AS "result";
    ELSE
        ROLLBACK;
        SIGNAL SQLSTATE "45000"
            SET MESSAGE_TEXT = rollback_message;
    END IF;
END#
-- END USERS SPs

-- START USER_DETAILS SPs
-- END USER_DETAILS SPs

-- START PRODUCTS SPs

-- addProduct
CREATE PROCEDURE addProduct(
    IN p_id VARCHAR(250),
    IN p_name VARCHAR(100),
    IN p_category ENUM("electronics","clothing","sports","stationery","food","toys"),
    IN p_description TEXT,
    IN p_image VARCHAR(250),
    IN p_price DECIMAL(10,2)
)
BEGIN
    INSERT into products(id,name,category,description,image,price)
    VALUES(p_id,p_name,p_category,p_description,p_image,p_price);
END#

-- getProductById
CREATE PROCEDURE getProductById(
    IN p_id VARCHAR(250)
)
BEGIN
    SELECT * FROM products 
    WHERE id=p_id AND is_deleted=0;
END#

-- getProductByCategory
CREATE PROCEDURE getProductByCategory(
    IN p_category ENUM("electronics","clothing","sports","stationery","food","toys")
)
BEGIN
    SELECT * FROM products
    WHERE category=p_category AND is_deleted=0;
END#

-- getProducts
CREATE PROCEDURE getProducts()
BEGIN
    SELECT * FROM products WHERE is_deleted=0;
END#

-- updateProduct
CREATE PROCEDURE updateProduct(
    IN p_id VARCHAR(250),
    IN p_name VARCHAR(100),
    IN p_category ENUM("electronics","clothing","sports","stationery","food","toys"),
    IN p_description TEXT,
    IN p_image TEXT,
    IN p_price DECIMAL(10,2)
)
BEGIN
    UPDATE products
    SET name=p_name,category=p_category,description=p_description,image=p_image,price=p_price
    WHERE id=p_id AND is_deleted=0;
END#

-- deleteProduct
CREATE PROCEDURE deleteProduct(
    IN p_id VARCHAR(250)
)
BEGIN
    UPDATE products 
    SET is_deleted=1 WHERE id=p_id;
END#

-- END PRODUCTS SPs

-- START ORDERS SPs
-- END ORDERS SPs

-- START PAYMENTS SPs
-- END PAYMENTS SPs

-- return to normal delimiter
DELIMITER ;
