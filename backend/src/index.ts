import express from 'express'
import dotenv from 'dotenv'
import userRouter from './api/routes/users.routes'
import productRouter from './api/routes/products.routes'
import orderRouter from './api/routes/orders.routes'

dotenv.config()

const app = express()
const port = process.env.PORT

// add body to requests
app.use(express.json())

// application middleware
app.use('/auth',userRouter)
app.use('/products',productRouter)
app.use('/orders',orderRouter)


// start server
app.listen(port, ()=>{
    console.log(`[server]:server running at http://localhost:${port}`)
})