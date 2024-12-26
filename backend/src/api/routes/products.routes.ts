import express from 'express'
import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../controllers/products.controllers'

const productRouter = express.Router()

productRouter.post('/add/',addProduct)
productRouter.get('/get/',getProducts)
productRouter.get('/get-by/:id/',getProductById)
productRouter.patch('/update/:id',updateProduct)
productRouter.patch('/delete/:id',deleteProduct)

export default productRouter