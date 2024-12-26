import express from 'express'
import { deleteUser, getUsers, loginUser, registerUser, updateUser } from '../controllers/users.controllers'

const userRouter = express.Router()

userRouter.post('/register/',registerUser)
userRouter.post('/login/',loginUser)
userRouter.get('/get-users/',getUsers)
userRouter.patch('/update/:id',updateUser)
userRouter.patch('/delete/:id',deleteUser)

export default userRouter