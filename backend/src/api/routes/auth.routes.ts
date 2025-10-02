import express from "express";
import passport from "../../config/passport.config";
import { loginUser, registerUser } from "../controllers/auth.controllers";
import jwt from "jsonwebtoken";
import { IUsers } from "../models/users.models";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

// Google OAuth routes
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
  const user = req.user as IUsers;
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY as string, { expiresIn: "7 days" });

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4200";
  res.redirect(`${frontendUrl}/dashboard?token=${token}`);
});

export default authRouter;
