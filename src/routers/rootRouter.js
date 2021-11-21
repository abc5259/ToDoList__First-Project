import express from "express";
import { home } from "../controllers/boardController";
import {
  getJoin,
  getLogin,
  logout,
  postJoin,
  postLogin,
} from "../controllers/userController";
import { protectedMiddleware, publicOnlyMiddleware } from "../middleware";

const rootRouter = express.Router();

rootRouter.get("/", publicOnlyMiddleware, home);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);

export default rootRouter;
