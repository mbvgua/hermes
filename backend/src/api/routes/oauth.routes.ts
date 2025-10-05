import express from "express";
import { googleLogin, googleAuthorise } from "../controllers/oauth.controllers";

const oauthRouter = express.Router();

oauthRouter.get("/google", googleLogin);
oauthRouter.get("/google/callback", googleAuthorise);

export default oauthRouter;
