import { NextFunction, Request, Response } from "express";
import { logger } from "../../config/winston.config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

import { pool } from "./../../config/db.config";
import {
  getUserSchema,
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

// update user
export async function updateUser(request: ExtendedRequest, response: Response) {
  const { username, email, password } = request.body;
  try {
    // get token from response body
    const token = request.headers["token"];
    const decoded_token = jwt.verify(
      token,
      process.env.SECRET_KEY as string,
    ) as IPayload;
    const user_id = decoded_token.id;

    //error validation
    const is_valid_request = await validationHelper(
      request,
      response,
      updateUserSchema,
    );

    if (is_valid_request) {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        `SELECT * FROM users WHERE id=? AND is_deleted=0;`,
        [user_id],
      );
      const [user] = rows as Array<IUsers>;
      if (!user) {
        logger.log({
          level: "error",
          message: `Tried to update user of id:${user_id} but they do not exist`,
          data: {
            user: {
              id: user_id,
              username,
            },
          },
        });
        return response.status(404).json({
          code: 404,
          status: "error",
          message: "User not found",
          data: null,
          metadata: null,
        });
      }

      //else if user exists
      const salt_rounds = 9;
      const hashed_password = await bcrypt.hash(password, salt_rounds);
      const [results] = await connection.query(
        "UPDATE users SET username=?, email=?, password=? WHERE id=? AND is_deleted=0;",
        [username, email, hashed_password, user_id],
      );

      //update token
      const payload: IPayload = {
        id: user.id,
        username: username,
        email: email,
        role: user.role,
      };
      const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
        expiresIn: "7 days",
      });

      logger.log({
        level: "info",
        message: `Updated ${user.username}'s of id:${user_id} profile`,
        data: {
          user: {
            username,
            role: user.role,
          },
        },
      });

      return response.status(201).json({
        code: 201,
        status: "success",
        message: `Congratulations ${username}! Your details have been successfully updated.`,
        data: {
          token: token,
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
