import express from "express";
import { createBoard, createList } from "../controllers/boardController";

const apiRouter = express.Router();

apiRouter.post("/board/create", createBoard);
apiRouter.post("/board/:id/list/create", createList);

export default apiRouter;
