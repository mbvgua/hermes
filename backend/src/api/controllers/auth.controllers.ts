import { NextFunction, Request, Response } from "express";
import { logger } from "../../config/winston.config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

import { pool } from "./../../config/db.config";
import {
  getUserSchema,
  loginUserSchema,
  registerUserSchema,
  updateUserSchema,
} from "../validators/users.validators";
import {
  UserRoles,
  IUsers,
  IPayload,
  ExtendedRequest,
} from "../models/users.models";
import { validationHelper } from "../helpers/validator.helpers";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export async function registerUser(request: Request, response: Response) {
  /*
   * register new users into system
   */
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

export async function loginUser(request: Request, response: Response) {
  /*
   * login existing users into the system
   */
  const { username, password } = request.body;

  try {
    const is_valid_request = await validationHelper(
      request,
      response,
      loginUserSchema,
    );
    if (is_valid_request) {
      const [rows] = await pool.query(
        `SELECT * FROM users WHERE username=? AND is_deleted=0;`,
        [username],
      );
      const [user] = rows as Array<IUsers>;

      //if user exists and username matches
      if (user.username == username) {
        const is_valid = await bcrypt.compare(password, user.password);
        //if passwords match
        if (is_valid) {
          const payload: IPayload = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          };

          //token has payload(data to send),secret_key and expiration time
          const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
            expiresIn: "7 days",
          });

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
            data: { token },
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

export async function getUserById(
  request: ExtendedRequest,
  response: Response,
) {
  /*
   * get user by their id, i.e user profile
   * else return an error
   */
  try {
    //get id from the user token
    //TODO:Also handle this massive error
    const token = request.headers["token"];
    const decoded_token = jwt.verify(
      token,
      process.env.SECRET_KEY as string,
    ) as IPayload;
    const user_id = decoded_token.id;

    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM users WHERE id=? AND is_deleted=0;",
      [user_id],
    );
    const user_making_request = rows as Array<IUsers>;

    //user does not exist
    if (!user_making_request || user_making_request.length < 0) {
      //TODO: find out why this does NOT run, it skips right to the catch block
      logger.log({
        level: "error",
        message: `Tried viewing profile of id:${user_id} which does not exist`,
        data: null,
      });

      return response.status(404).json({
        code: 404,
        status: "error",
        message: "User not found",
        data: null,
        metadata: null,
      });
    }

    //log action
    logger.log({
      level: "info",
      message: `${user_making_request[0].username} viewed their profile`,
      data: {
        user: {
          username: user_making_request[0].username,
          password: user_making_request[0].password,
        },
      },
    });

    //return profile
    return response.status(200).json({
      code: 200,
      status: "success",
      message: `Successfully retrieved ${user_making_request[0].username}'s profile`,
      data: {
        user: {
          id: user_id,
          username: user_making_request[0].username,
          email: user_making_request[0].email,
          role: user_making_request[0].role,
        },
      },
    });
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

export async function getUsers(request: Request, response: Response) {
  /*
   * admin only. get users in system
   * has pagination with limit-offset
   */
  const page = parseInt((request.query.page as string) ?? "1");
  const limit = parseInt((request.query.limit as string) ?? "10");
  const offset = (page - 1) * limit;

  //decode token to get user_id
  const token = request.headers["token"];
  //NOTE:Massive error, still runs though
  const decoded_token = jwt.verify(
    token,
    process.env.SECRET_KEY as string,
  ) as IPayload;
  const user_id = decoded_token.id;

  try {
    const connection = await pool.getConnection();

    //get user making request for logging
    const [user] = await connection.query(`SELECT * FROM users WHERE id=?;`, [
      user_id,
    ]);
    const user_making_request = user as Array<IUsers>;

    //get total number of users
    const [results]: any = await connection.query(
      "SELECT COUNT(*) as total FROM users;",
    );
    const total_items = results[0].total;

    //get paginated results
    const [rows] = await connection.query(
      "SELECT * FROM users LIMIT ? OFFSET ?;",
      [limit, offset],
    );
    const users = rows as Array<IUsers>;
    const total_pages = Math.ceil(total_items / limit);

    //log inormation
    logger.log({
      level: "info",
      message: `${user_making_request[0].username} queried all users in the database\n
                who are currently ${total_items}.\n
                They are on page ${page} displaying ${limit} users.`,
    });

    //return response
    return response.status(200).json({
      code: 200,
      status: "success",
      message: "Users successfully retrieved",
      data: { users },
      metadata: {
        previous_page: +page - 1,
        current_page: +page,
        next_page: +page + 1,
        total_items,
        total_pages,
      },
    });
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

//// update user
//export async function updateUser(
//  request: Request<{ id: string }>,
//  response: Response,
//) {
//  const id = request.params.id;
//  const { username, email, password } = request.body;
//  const { error } = updateUserSchema.validate(request.body);
//  try {
//    if (error) {
//      return response.status(401).json({ error: error.details[0].message });
//    } else {
//      const [rows, fields] = await pool.query(
//        `SELECT * FROM users
//                WHERE id='${id}
//                AND is_deleted=0;'`,
//      );
//      const [user] = rows as Array<Users>;
//      if (user) {
//        const hashedPassword = await bcrypt.hash(password, 9);
//        await pool.query(
//          `UPDATE users SET
//                        username='${username}',
//                        email='${email}',
//                        password='${hashedPassword}'
//                    WHERE id='${user.id}'
//                    AND is_deleted=0;`,
//        );
//        return response.status(200).json({
//          success:
//            "Congratulations! Your details have been successfully updated.",
//        });
//      } else {
//        return response
//          .status(401)
//          .json({ error: `User does not exist. Try again?` });
//      }
//    }
//  } catch (error) {
//    logger.log({
//      level: "error",
//      message: "Internal server error occurred",
//      data: { error },
//    });
//
//    return response.status(500).json({
//      code: 500,
//      status: "error",
//      message: "Internal server error",
//      data: { error },
//      metadata: null,
//    });
//  }
//}
//
//// delete user
//export async function deleteUser(
//  request: Request<{ id: string }>,
//  response: Response,
//) {
//  const id = request.params.id;
//  try {
//    const [rows, fields] = await pool.query(
//      `SELECT * FROM users
//            WHERE id='${id}'
//            AND is_deleted=0;`,
//    );
//    const [user] = rows as Array<Users>;
//    if (user) {
//      const [rows, fields] = await pool.query(
//        `UPDATE users SET is_deleted=1 WHERE id = '${id}';`,
//      );
//      return response.status(200).json({
//        success: `Congratulations! You have successfully deleted you account.`,
//      });
//    } else {
//      return response
//        .status(401)
//        .json({ error: `You do not have an account. Try again?` });
//    }
//  } catch (error) {
//    logger.log({
//      level: "error",
//      message: "Internal server error occurred",
//      data: { error },
//    });
//
//    return response.status(500).json({
//      code: 500,
//      status: "error",
//      message: "Internal server error",
//      data: { error },
//      metadata: null,
//    });
//  }
//}
