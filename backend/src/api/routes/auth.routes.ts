import express from "express";
import {
  getUserById,
  getUsers,
  loginUser,
  registerUser,
} from "../controllers/auth.controllers";
import { isAdmin } from "../middlewares/auth.middleware";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-user", getUserById);
userRouter.get("/get-users", isAdmin, getUsers);

export default userRouter;
