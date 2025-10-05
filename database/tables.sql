-- create and use the db
CREATE DATABASE hermes;
USE hermes;

CREATE TABLE users (
    -- SERIAL DEFAULT VALUE equates to NOT NULL AUTO_INCREMENT UNIQUE
    id INT PRIMARY KEY SERIAL DEFAULT VALUE,
    -- used for storing uuid,google_id e.t.c
    google_id VARCHAR(255) UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255),
    role ENUM('customer','admin') NOT NULL,
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
    id VARCHAR(250) PRIMARY KEY,
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
