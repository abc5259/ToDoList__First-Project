import express from "express";
import {
  edit,
  logout,
  profile,
  changePassword,
  userHome,
} from "../controllers/userRouter";

const userController = express.Router();

userController.get("/home", userHome);
userController.get("/logout", logout);
userController.get("/edit", edit);
userController.get("/changePassword", changePassword);
userController.get("/:id", profile);

export default userController;
