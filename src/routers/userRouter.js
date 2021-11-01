import express from "express";
import { watch } from "../controllers/userRouter";

const userController = express.Router();

userController.get("/:id", watch);

export default userController;
