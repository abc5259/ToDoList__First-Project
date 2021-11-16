import express from "express";
import {
  createBoard,
  createList,
  createTask,
  deleteList,
  deleteTask,
  editList,
  editTask,
  editTaskDescription,
  updateList,
  updateTask,
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
apiRouter.post("/list/:id/task/update", updateTask);
apiRouter.post("/task/:id", watchTask);
apiRouter.post("/task/:id/edit", editTask);
apiRouter.post("/task/:id/edit-description", editTaskDescription);
apiRouter.delete("/list/:id/task/delete", deleteTask);

export default apiRouter;
