import express from 'express'
import { cancellOrder, getAllOrders, getOrdersByUserId, makeOrder, updateOrder } from '../controllers/orders.controllers'

const orderRouter = express.Router()

orderRouter.post('/make-order/:id',makeOrder)
orderRouter.get('/get/',getAllOrders)
orderRouter.get('/get-by/:id/',getOrdersByUserId)
orderRouter.patch('/update/:userId/:orderId',updateOrder)
orderRouter.patch('/cancell/:userId/:orderId/',cancellOrder)

export default orderRouter