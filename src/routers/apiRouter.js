import express from "express";
import {
  createBoard,
  createList,
  deleteList,
  updateList,
} from "../controllers/boardController";

const apiRouter = express.Router();

apiRouter.post("/board/create", createBoard);
apiRouter.post("/board/:id/list/create", createList);
apiRouter.post("/board/:id/list/update", updateList);
apiRouter.delete("/board/:id/list/delete", deleteList);

export default apiRouter;
