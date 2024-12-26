import { Router } from 'express'
import { cancelOrder, getAllOrders, getOrdersByUserId, makeOrder, updateOrder } from '../controllers/orders.controllers'

const orderRouter = Router()

orderRouter.post('/make-order/',makeOrder)
orderRouter.get('/get-orders/:id/',getOrdersByUserId)
orderRouter.get('/get-orders/:id/',getAllOrders)
orderRouter.patch('/update-order/',updateOrder)
orderRouter.patch('/cancell-order/:userId/:orderId/',cancelOrder)

export default orderRouter