import express from "express";
import { home } from "../controllers/boardController";
import { join, login } from "../controllers/userRouter";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/join", join);
rootRouter.get("/login", login);

export default rootRouter;
