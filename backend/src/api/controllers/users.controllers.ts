import { Request,Response } from 'express'
import { pool } from '../helpers/db.helpers'
import bcrypt  from 'bcrypt'
import { getUserSchema, loginUserSchema, registerUserSchema, updateUserSchema } from '../validators/users.validators'
import { UserRoles, Users } from '../models/users.models'


// register user
export async function registerUser(request:Request,response:Response){
    const { username,email,password} = request.body
    const role = UserRoles.Customer
    const {error} = registerUserSchema.validate(request.body)
    try{
        if(error){
            return response.status(401).json({error:error.details[0].message})
        } else {
            const hashedPassword = await bcrypt.hash(password,9)
            await pool.query(
                `INSERT INTO users(username,email,password,role) VALUES (
                    '${username}',
                    '${email}',
                    '${hashedPassword}',
                    '${role}'
                );`
            )
            console.log(role,password,hashedPassword)
            return response.status(200).json({success:`Congratulations! You have successfully created a new account.`})
        }
    } catch(error){
        console.error('Error occurred at: ', error)
        return response.status(500).json({error:error})
    }
}

// login user
export async function loginUser(request:Request,response:Response){
    const {username,password} = request.body
    console.log(username,password)
    const {error} = loginUserSchema.validate(request.body)
    try{
        if(error){
            return response.status(401).json({error:error.details[0].message})
        } else {
            const [rows,fields] = await pool.query(
                `SELECT * FROM users
                WHERE username='${username}'
                AND isDeleted=0;`
            )
            const [user] = rows as Array<Users>
            if(!user){
                return response.status(401).json({error:`You do not have an account. Try creating one instead?`})
            } else if(user.username === username) {
                const isValid = await bcrypt.compare(password,user.password)
                if(isValid){
                    return response.status(200).json({success:`Congratulations ${user.username}! You have logged back in successfuly.`})
                } else {
                    return response.status(401).json({error:`You have entered an incorrect username or password. Try again?`})
                }
            } else {
                return response.status(401).json({error:`You do not have an account. Try creating one instead?`})
            }
        }
    }catch(error){
        console.error('An error occurred: ',error)
        return response.status(500).json({error:error})
    }
}

// get users
export async function getUsers(request:Request,response:Response){
    try{
        const [rows,fields] = await pool.query(
            `SELECT * FROM users WHERE isDeleted=0;`
        )
        const users = rows as Array<Users[]>
        if(users){
            return response.status(200).send(users)
        } else {
            return response.status(401).json({error:`There are currently no users in your database. Try again later?`})
        }
    } catch(error){
        console.error('An error occurred: ',error)
        return response.status(500).json({error:error})
    }
}


// update user
export async function updateUser(request:Request<{id:string}>,response:Response){
    const id = request.params.id
    const {username,email,password} = request.body
    const {error} = updateUserSchema.validate(request.body)
    try{
        if(error){
            return response.status(401).json({error:error.details[0].message})
        } else {
            const [rows,fields] = await pool.query(
                `SELECT * FROM users
                WHERE id='${id}
                AND isDeleted=0;'`
            )
            const [user] = rows as Array<Users>
            if(user){
                const hashedPassword = await bcrypt.hash(password,9)
                await pool.query(
                    `UPDATE users SET
                        username='${username}',
                        email='${email}',
                        password='${hashedPassword}'
                    WHERE id='${user.id}'
                    AND isDeleted=0;`
                )
                return response.status(200).json({success:'Congratulations! Your details have been successfully updated.'})
            } else {
                return response.status(401).json({error:`User does not exist. Try again?`})
            }
        }
    } catch(error){
        console.error('An error occurred: ',error)
        return response.status(500).json({error:error})
    }
}

// delete user
export async function deleteUser(request:Request<{id:string}>,response:Response){
    const id = request.params.id
    try{
        const [rows,fields] = await pool.query(
            `SELECT * FROM users
            WHERE id='${id}'
            AND isDeleted=0;`
        )
        const [user] = rows as Array<Users>
        if(user){
            const [rows,fields] = await pool.query(
                `UPDATE users SET isDeleted=1 WHERE id = '${id}';`
            )
            return response.status(200).json({success:`Congratulations! You have successfully deleted you account.`})
        } else {
            return response.status(401).json({error:`You do not have an account. Try again?`})
        }
    } catch(error){
        console.error('An error occurred: ',error)
        return response.status(500).json({error:error})
    }
}