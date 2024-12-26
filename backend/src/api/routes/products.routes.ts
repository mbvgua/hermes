import { Router } from 'express'
import { addProduct, deleteProduct, getProductById, updateProduct } from '../controllers/products.controllers'

const productRouter = Router()

productRouter.post('/add-product/',addProduct)
productRouter.get('/get-product/:id/',getProductById)
productRouter.patch('/update-product/',updateProduct)
productRouter.patch('/delete-product/:id',deleteProduct)

export default productRouter