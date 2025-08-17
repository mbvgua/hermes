import express from "express";
import {
  getUserById,
  getUsers,
  loginUser,
  registerUser,
} from "../controllers/auth.controllers";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-user", getUserById);
userRouter.get("/get-users", getUsers);

export default userRouter;
