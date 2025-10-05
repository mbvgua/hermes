import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";

import passport from "../../config/passport.config";
import { logger } from "../../config/winston.config";
import { IUsers } from "../models/users.models";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export async function googleLogin(request: Request, response: Response) {
  /*
   * login with google
   */
  try {
    passport.authenticate("google", { scope: ["profile", "email"] });
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

export async function googleAuthorise(request: Request, response: Response) {
  /*
   * google authorization and redirect to dashboard
   */
  // const frontendUrl = process.env.FRONTEND_URL
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4200";
  passport.authenticate("google", { failureRedirect: "/login" });

  try {
    const user = request.user as IUsers;
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    //token has payload(data to send),secret_key and expiration time
    const token = jwt.sign(payload, process.env.SECRET_KEY as string, {
      expiresIn: "7 days",
    });

    response.redirect(`${frontendUrl}/dashboard?token=${token}`);
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
