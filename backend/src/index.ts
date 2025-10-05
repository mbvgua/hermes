import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport.config";
import authRouter from "./api/routes/auth.routes";
import userRouter from "./api/routes/users.routes";
import productRouter from "./api/routes/products.routes";
import oauthRouter from "./api/routes/oauth.routes";
// import orderRouter from "./api/routes/orders.routes";

dotenv.config();

const app = express();
const port = process.env.PORT;
const session_secret = process.env.SESSION_SECRET as string;

// application middleware
app.use(express.json());
app.use(cors());

// session for passport
app.use(
  session({
    secret: session_secret,
    resave: false,
    saveUninitialized: false,
  }),
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// application middleware
app.use("/v1/auth", authRouter);
app.use("/v1/oauth", oauthRouter);
app.use("/v1/users", userRouter);
app.use("/v1/products", productRouter);
//app.use("/v1/orders", orderRouter);

// start server
app.listen(port, () => {
  console.log(`[server]:server running at http://localhost:${port}`);
});
