-- oauth users tables
CREATE TABLE oauth_users (
    id INT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT "customer" CHECK(role IN ("customer","admin")),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_deleted INTEGER DEFAULT 0
);
