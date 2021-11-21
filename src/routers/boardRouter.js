import express from "express";
import { watch } from "../controllers/boardController";
import { protectedMiddleware } from "../middleware";

const boardRouter = express.Router();

boardRouter.get("/:id", protectedMiddleware, watch);

export default boardRouter;
