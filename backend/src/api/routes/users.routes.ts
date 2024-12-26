import { Router } from 'express'
import { deleteUser, getUser, getUsers, loginUser, registerUser, updateUser } from '../controllers/users.controllers'

const userRouter = Router()

userRouter.post('/register-user/',registerUser)
userRouter.post('/login-user/',loginUser)
userRouter.get('/get-user/',getUser)
userRouter.get('/get-users/',getUsers)
userRouter.patch('/update-user',updateUser)
userRouter.patch('/delete-user',deleteUser)

export default userRouter