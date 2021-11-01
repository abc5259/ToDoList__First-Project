import express from "express";
import { watch } from "../controllers/boardController";

const boardRouter = express.Router();

boardRouter.get("/:id", watch);

export default boardRouter;
