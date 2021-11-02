import express from "express";
import { home } from "../controllers/boardController";
import {
  getJoin,
  getLogin,
  login,
  postJoin,
  postLogin,
} from "../controllers/userRouter";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);

export default rootRouter;
