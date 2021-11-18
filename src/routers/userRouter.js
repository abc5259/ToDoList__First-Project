import express from "express";
import {
  getEditProfile,
  logout,
  changePassword,
  userHome,
  postEditProfile,
} from "../controllers/userController";
import { uploadFile } from "../middleware";

const userController = express.Router();

userController.get("/home", userHome);
userController.get("/logout", logout);
userController
  .route("/edit-profile")
  .get(getEditProfile)
  .post(uploadFile.single("avatar"), postEditProfile);
userController.get("/changePassword", changePassword);

export default userController;
