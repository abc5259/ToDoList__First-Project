import express from "express";
import {
  createBoard,
  createList,
  createTask,
  deleteList,
  editList,
  updateList,
  watchTask,
} from "../controllers/boardController";

const apiRouter = express.Router();

// Board
apiRouter.post("/board/create", createBoard);

// List
apiRouter.post("/list/:id/edit", editList);
apiRouter.post("/board/:id/list/create", createList);
apiRouter.post("/board/:id/list/update", updateList);
apiRouter.delete("/board/:id/list/delete", deleteList);

// Task
apiRouter.post("/list/:id/task/create", createTask);
apiRouter.post("/task/:id", watchTask);

export default apiRouter;
