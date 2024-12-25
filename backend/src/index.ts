import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT

app.use(express.json())

// application midleware



// start server
app.listen(port, ()=>{
    console.log(`[server]:server running at http://localhost:${port}`)
})