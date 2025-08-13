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

  ////make logs custom to this endpoint
  ////need to also add transports, else error
  //logger.configure({
  //  defaultMeta: { endpoint: "registerUser" },
  //});

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
    //log any errors
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
  console.log(username, password);
  const { error } = loginUserSchema.validate(request.body);
  try {
    if (error) {
      return response.status(401).json({ error: error.details[0].message });
    } else {
      const [rows, fields] = await pool.query(
        `SELECT * FROM users
                WHERE username='${username}'
                AND isDeleted=0;`,
      );
      const [user] = rows as Array<Users>;
      if (!user) {
        return response.status(401).json({
          error: `You do not have an account. Try creating one instead?`,
        });
      } else if (user.username === username) {
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
          return response.status(200).json({
            success: `Congratulations ${user.username}! You have logged back in successfuly.`,
          });
        } else {
          return response.status(401).json({
            error: `You have entered an incorrect username or password. Try again?`,
          });
        }
      } else {
        return response.status(401).json({
          error: `You do not have an account. Try creating one instead?`,
        });
      }
    }
  } catch (error) {
    console.error("An error occurred: ", error);
    return response.status(500).json({ error: error });
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
    console.error("An error occurred: ", error);
    return response.status(500).json({ error: error });
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
    console.error("An error occurred: ", error);
    return response.status(500).json({ error: error });
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
    console.error("An error occurred: ", error);
    return response.status(500).json({ error: error });
  }
}
