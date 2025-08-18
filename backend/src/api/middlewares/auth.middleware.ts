import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

import { logger } from "../../config/winston.config";
import { ExtendedRequest, IPayload, UserRoles } from "../models/users.models";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export async function verifyToken(
  request: ExtendedRequest,
  response: Response,
  next: NextFunction,
) {
  /*
   * ensures a token is present in request
   */
  //read the token
  const token = request.headers["token"];

  try {
    //if token does not exists, exit with error
    if (!token) {
      logger.log({
        level: "error",
        message: "Unauthorized attempt with no token",
        data: null,
      });

      return response.status(403).json({
        code: 403,
        status: "error",
        message: "Unauthorized! No token provided",
        data: null,
        metadata: null,
      });
    }
    //else if token is present, continue
    next();
  } catch (error) {
    //log any error
    logger.log({
      level: "error",
      message: "Internal server error occurred",
      data: { error },
    });

    //return error
    return response.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      data: { error },
      metadata: null,
    });
  }
}

export async function isAdmin(
  request: ExtendedRequest,
  response: Response,
  next: NextFunction,
) {
  /*
   * ensure only users with admin roles gain excess to certain routes
   */
  //read the token
  const token = request.headers["token"];

  //else if token does exist
  try {
    //else if token present
    const decoded_token = jwt.verify(
      token,
      process.env.SECRET_KEY as string,
    ) as IPayload;
    request.info = decoded_token;

    //if not an admin
    if (request.info.role !== UserRoles.Admin) {
      logger.log({
        level: "error",
        message: "Unauthorized! User not an admin",
        data: null,
      });

      return response.status(401).json({
        code: 401,
        status: "error",
        message: "Unauthorized! Only admins can access this route",
        data: null,
        metadata: null,
      });
    }
    //else if user role is an admin, continue
    next();
  } catch (error) {
    //log any error
    logger.log({
      level: "error",
      message: "Internal server error occurred",
      data: { error },
    });

    //return error
    return response.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
      data: { error },
      metadata: null,
    });
  }
}
