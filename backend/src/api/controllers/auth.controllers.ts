import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";

import { pool } from "./../../config/db.config";
import {
  getUserSchema,
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
} from "../validators/users.validators";
import { UserRoles, Users } from "../models/users.models";
import { validationHelper } from "../helpers/validator.helpers";
import { logger } from "../../config/winston.config";

// register new users into system
export async function registerUser(request: Request, response: Response) {
  const { username, email, password } = request.body;
  const role = UserRoles.Customer;

  try {
    const is_valid_request = await validationHelper(
      request,
      response,
      registerUserSchema,
    );
    //if no validation error
    if (is_valid_request) {
      //hash the password for security
      const salt_rounds = 9;
      const hashed_password = await bcrypt.hash(password, salt_rounds);

      //make connection to db
      const connection = await pool.getConnection();
      await connection.query(
        `INSERT INTO users(username,email,password,role) VALUES ( ?,?,?,?);`,
        [username, email, hashed_password, role],
      );
      connection.release();

      //log new user info
      logger.log({
        level: "info",
        message: `${username} has registered a new account`,
        data: {
          user: {
            username,
            email,
            role,
          },
        },
      });

      //return response if successful
      return response.status(200).json({
        code: 201,
        status: "success",
        message: `Congratulations ${username}! You have successfully created a new account.`,
        data: {
          user: {
            username,
            email,
            role,
          },
        },
        metadata: null,
      });
    }
  } catch (error) {
    logger.log({
      level: "error",
      message: "Internal server error occurred",
      data: { error },
    });

    return response.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      data: { error },
      metadata: null,
    });
  }
}

// login user
export async function loginUser(request: Request, response: Response) {
  const { username, password } = request.body;

  try {
    const is_valid_request = await validationHelper(
      request,
      response,
      loginUserSchema,
    );
    if (is_valid_request) {
      const [rows] = await pool.query(
        `SELECT * FROM users WHERE username=? AND isDeleted=0;`,
        [username],
      );
      const [user] = rows as Array<Users>;

      //if user exists and username matches
      if (user.username == username) {
        const is_valid = await bcrypt.compare(password, user.password);
        //if passwords match
        if (is_valid) {
          logger.log({
            level: "info",
            message: `${username} has successfully logged in`,
            data: {
              user: {
                username,
                role: user.role,
              },
            },
          });

          return response.status(200).json({
            code: 200,
            status: "success",
            message: `Congratulations ${user.username}! You have logged back in successfully`,
            data: {
              user: {
                username: user.username,
                email: user.email,
                role: user.role,
              },
            },
            metadata: null,
          });
          //if passwords do not match
        } else {
          logger.log({
            level: "error",
            message: "Incorrect username or password",
            data: {
              user: {
                username,
                password,
              },
            },
          });

          return response.status(401).json({
            code: 401,
            status: "error",
            message:
              "Oh no! You entered and incorrect username or password. Try again?",
            data: {
              user: {
                username,
                password,
              },
            },
            metadata: null,
          });
        }
        //else if user does not exist
      } else {
        logger.log({
          level: "error",
          message: "Account does not exist",
          data: {
            user: {
              username,
              password,
            },
          },
        });

        return response.status(404).json({
          code: 404,
          status: "error",
          message: "Account does not exist.Try creating on instead?",
          data: null,
          metadata: null,
        });
      }
    }
  } catch (error) {
    logger.log({
      level: "error",
      message: "Internal server error occurred",
      data: { error },
    });

    return response.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      data: { error },
      metadata: null,
    });
  }
}

// get users
export async function getUsers(request: Request, response: Response) {
  try {
    const [rows, fields] = await pool.query(
      `SELECT * FROM users WHERE isDeleted=0;`,
    );
    const users = rows as Array<Users[]>;
    if (users) {
      return response.status(200).send(users);
    } else {
      return response.status(401).json({
        error: `There are currently no users in your database. Try again later?`,
      });
    }
  } catch (error) {
    logger.log({
      level: "error",
      message: "Internal server error occurred",
      data: { error },
    });

    return response.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      data: { error },
      metadata: null,
    });
  }
}

// update user
export async function updateUser(
  request: Request<{ id: string }>,
  response: Response,
) {
  const id = request.params.id;
  const { username, email, password } = request.body;
  const { error } = updateUserSchema.validate(request.body);
  try {
    if (error) {
      return response.status(401).json({ error: error.details[0].message });
    } else {
      const [rows, fields] = await pool.query(
        `SELECT * FROM users
                WHERE id='${id}
                AND isDeleted=0;'`,
      );
      const [user] = rows as Array<Users>;
      if (user) {
        const hashedPassword = await bcrypt.hash(password, 9);
        await pool.query(
          `UPDATE users SET
                        username='${username}',
                        email='${email}',
                        password='${hashedPassword}'
                    WHERE id='${user.id}'
                    AND isDeleted=0;`,
        );
        return response.status(200).json({
          success:
            "Congratulations! Your details have been successfully updated.",
        });
      } else {
        return response
          .status(401)
          .json({ error: `User does not exist. Try again?` });
      }
    }
  } catch (error) {
    logger.log({
      level: "error",
      message: "Internal server error occurred",
      data: { error },
    });

    return response.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      data: { error },
      metadata: null,
    });
  }
}

// delete user
export async function deleteUser(
  request: Request<{ id: string }>,
  response: Response,
) {
  const id = request.params.id;
  try {
    const [rows, fields] = await pool.query(
      `SELECT * FROM users
            WHERE id='${id}'
            AND isDeleted=0;`,
    );
    const [user] = rows as Array<Users>;
    if (user) {
      const [rows, fields] = await pool.query(
        `UPDATE users SET isDeleted=1 WHERE id = '${id}';`,
      );
      return response.status(200).json({
        success: `Congratulations! You have successfully deleted you account.`,
      });
    } else {
      return response
        .status(401)
        .json({ error: `You do not have an account. Try again?` });
    }
  } catch (error) {
    logger.log({
      level: "error",
      message: "Internal server error occurred",
      data: { error },
    });

    return response.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      data: { error },
      metadata: null,
    });
  }
}
