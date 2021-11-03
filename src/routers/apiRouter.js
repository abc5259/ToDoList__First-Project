import express from "express";
import { createBoard } from "../controllers/boardController";

const apiRouter = express.Router();

apiRouter.post("/board/create", createBoard);

export default apiRouter;
