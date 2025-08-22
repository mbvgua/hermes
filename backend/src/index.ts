import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productRouter from "./api/routes/products.routes";
import orderRouter from "./api/routes/orders.routes";
import authRouter from "./api/routes/auth.routes";
import userRouter from "./api/routes/users.routes";

dotenv.config();

const app = express();
const port = process.env.PORT;

// add body to requests
app.use(express.json());
app.use(cors());

// application middleware
app.use("/v1/auth", authRouter);
app.use("/v1/users", userRouter);
//app.use("/products", productRouter);
//app.use("/orders", orderRouter);

// start server
app.listen(port, () => {
  console.log(`[server]:server running at http://localhost:${port}`);
});
