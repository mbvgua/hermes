import express from "express";
import {
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/users.controllers";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware";

const userRouter = express.Router();

userRouter.get("/get-user", verifyToken, getUserById);
userRouter.get("/get-users", verifyToken, isAdmin, getUsers);
userRouter.patch("/update", verifyToken, updateUser);

export default userRouter;
