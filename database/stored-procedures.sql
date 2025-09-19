
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

-- getUserByUsername
CREATE PROCEDURE getUserByUsername(
    IN find_username VARCHAR(100)
)
BEGIN
    SELECT * FROM users
    WHERE username=find_username AND is_deleted=0;
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
    IN new_password VARCHAR(255)
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
        SET username=new_username,email=new_email,password=new_password
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
    DECLARE existing_account INT DEFAULT 0;
    DECLARE rollback_message VARCHAR(255) DEFAULT 'Transaction rolled back: User does not exists';
    DECLARE commit_message VARCHAR(255) DEFAULT 'Transaction committed successfully';

    START TRANSACTION;

    SELECT COUNT(*) INTO existing_account FROM users
    WHERE id=user_id AND is_deleted=0;

    IF existing_account > 0 THEN
        UPDATE users SET is_deleted=1 WHERE id=user_id;

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
-- END PRODUCTS SPs

-- START ORDERS SPs
-- END ORDERS SPs

-- START PAYMENTS SPs
-- END PAYMENTS SPs

-- return to normal delimiter
DELIMITER ;
