import express from "express";
import {
  deleteUser,
  getUserById,
  getUsers,
  loginUser,
  registerUser,
  updateUser,
} from "../controllers/auth.controllers";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-user", getUserById);
userRouter.patch("/update/:id", updateUser);
userRouter.patch("/delete/:id", deleteUser);

export default userRouter;
