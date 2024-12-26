import { Request,Response } from 'express'
import { Users } from '../models/users.models'
import { pool } from '../helpers/db.helpers'
import { Orders } from '../models/orders.models'
import { makeOrderSchema, updateOrderSchema } from '../validators/orders.validators'

// make order
export async function makeOrder(request:Request<{id:string}>,response:Response){
    const userId = request.params.id
    const {orderDetails,totalPrice} = request.body
    const {error} = makeOrderSchema.validate(request.body)
    try{
        if(error){
            return response.status(401).json({error:error})
        } else {
            const [rows,fields] = await pool.query(
                `SELECT * FROM users
                WHERE id='${userId}'
                AND isDeleted=0;`
            )
            const [user] = rows as Array<Users[]>
            if(user.length !== 0){
                await pool.query(
                    `INSERT INTO orders(userId,orderDetails,totalPrice) VALUES (
                    '${userId}',
                    '${orderDetails}',
                    '${totalPrice}'
                    );`
                )
                return response.status(200).json({success:`New order has been successfully made!`})
            } else {
                return response.status(401).json({error:`User does not exists. Try again?`})
            }
        }
    } catch(error) {
        console.error('An error occurred: ',error)
        return response.status(500).json({error:error})
    }

}

// update order
export async function updateOrder(request:Request<{userId:string,orderId:string}>,response:Response){
    const userId = request.params.userId
    const orderId = request.params.orderId
    const {orderDetails,totalPrice} = request.body
    const {error} = updateOrderSchema.validate(request.body)
    try {
        if(error){
            return response.status(401).json({error:error})
        } else {
            // see if user exists
            const [rows,fields] = await pool.query(
                `SELECT * FROM users
                WHERE id='${userId}'
                AND isDeleted=0;`
            )
            const [user] = rows as Array<Users>
            if(user){
                // if yes. if he made the order. 
                const [rows,fields] = await pool.query(
                    `SELECT * FROM orders
                    WHERE id='${orderId}'
                    AND isCancelled=0;`
                )
                const [order] = rows as Array<Orders>
    
                if(user.id === order.userId){
                    await pool.query(
                        `UPDATE orders SET
                        orderDetails='${orderDetails}',
                        totalPrice='${totalPrice}'
                        WHERE id='${orderId}'
                        AND isCancelled=0;`
                    )
                    return response.status(200).json({success:`You order have been successfully updated!`})
                } else if(user.role === 'admin'){
                    await pool.query(
                        `UPDATE orders SET
                        orderDetails='${orderDetails}',
                        totalPrice='${totalPrice}'
                        WHERE id='${orderId}'
                        AND isCancelled=0;`
                    )
                    return response.status(200).json({success:`As an admin, you have successfully updated order no.${order.id}!`})
                } else {
                    return response.status(401).json({error:`That order does not exist.Create one instead?`})
                }
            } else {
                return response.status(401).json({error:`You do not have an account.Create one instead?`})
            }
        }
    } catch (error) {
        console.error('An error occurred: ',error)
        return response.status(500).json({error:error})
    }
}

// get orders by user id
export async function getOrdersByUserId(request:Request<{id:string}>,response:Response){
    const id = request.params.id
    try {
        const [rows,fields] = await pool.query(
            `SELECT * FROM users
            WHERE id='${id}'
            AND isDeleted=0;`
        )
        const [user] = rows as Array<Users>
        if(user){
            const [rows,fields] = await pool.query(
                `SELECT * FROM orders
                WHERE userId='${id}'
                AND isCancelled=0;`
            )
            const [orders] = rows as Array<Orders[]>
            if(orders.length !== 0){
                return response.status(200).send(orders)
            }else {
                return response.status(201).json({error:`User no.${user.id} has not made any orders yet. Try again later?`})
            }
        } else {
            return response.status(401).json({error:`You do not have an account. Try creating on first?`})
        }
    } catch (error) {
        console.error('An error occurred: ',error)
        return response.status(500).json({error:error}) 
    }
}

// get orders
export async function getAllOrders(request:Request<{id:string}>,response:Response){
    const id = request.params.id
    try{
        const [rows,fields] = await pool.query(
            `SELECT * FROM users
            WHERE id= '${id}'
            AND isDeleted=0;`
        )
        const [user] = rows as Array<Users>
        if(user){
            if(user.role === 'admin'){
                const [rows,fields] = await pool.query(
                    `SELECT * FROM orders WHERE isCancelled=0;`
                )
                const [orders] = rows as Array<Orders[]>
                return response.status(200).send(orders)
            } else {
                return response.status(401).json({error:`You are not authorized to access this. Contact the administrator.`})
            }
        } else {
            return response.status(401).json({error:`You do not have an account.Create one instead?`})
        }
    } catch(error) {
        console.error('An error occurred: ',error)
        return response.status(500).json({error:error})
    }
}

// delete order
export async function cancelOrder(request:Request<{userId:string,orderId:string}>,response:Response){
    const userId = request.params.userId
    const orderId = request.params.orderId
    try {
        // get user
        const [rows,fields] = await pool.query(
            `SELECT * FROM users WHERE id='${userId} AND isDeleted=0';`
        )
        const [user] = rows as Array<Users>

       if(user){
         // get order
         const [rows,fields] = await pool.query(
            `SELECT * FROM orders WHERE id='${orderId} AND isCancelled=0';`
        )
        const [order] = rows as Array<Orders>

        // see if user matches order id
        if(user.id === order.userId){
            // if yes delete
            await pool.query(
                `UPDATE orders SET 
                isCancelled=1
                WHERE id='${orderId}';`
            )
            return response.status(200).json({success:`Your order has successfully been cancelled!`})
        } else if (user.role === 'admin'){
            // else if user role is admin. then delete order
            await pool.query(
                `UPDATE orders SET 
                isCancelled=1
                WHERE id='${orderId}';`
            )
            return response.status(200).json({success:`As an admin, you have successfully cancelled order no.${order.id}!`})
        } else {
            // else error
            return response.status(401).json({error:`You cannot delete an order that you did not make. Try again?`})
        }
       } else {
            return response.status(401).json({error:`You do not have an account. Create on instead?`})
       }
        
    } catch (error) {
        console.error('An error occurred: ',error)
        return response.status(500).json({error:error})
    }
}