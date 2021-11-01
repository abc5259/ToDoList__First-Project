import express from "express";
import { watch } from "../controllers/todoController";

const todoProjectRouter = express.Router();

todoProjectRouter.get("/:id", watch);

export default todoProjectRouter;
