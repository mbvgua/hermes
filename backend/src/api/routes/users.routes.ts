import express from "express";
import { getUserById, getUsers } from "../controllers/auth.controllers";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware";

const userRouter = express.Router();

userRouter.get("/get-user", verifyToken, getUserById);
userRouter.get("/get-users", verifyToken, isAdmin, getUsers);

export default userRouter;
