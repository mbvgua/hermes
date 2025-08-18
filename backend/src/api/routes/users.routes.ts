import express from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/users.controllers";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware";

const userRouter = express.Router();

userRouter.get("/get-user", verifyToken, getUserById);
userRouter.get("/get-users", verifyToken, isAdmin, getUsers);
userRouter.patch("/update", verifyToken, updateUser);
userRouter.patch("/delete", verifyToken, deleteUser);

export default userRouter;
