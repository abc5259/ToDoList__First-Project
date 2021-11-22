import express from "express";
import {
  getEditProfile,
  changePassword,
  userHome,
  postEditProfile,
  logout,
  profile,
} from "../controllers/userController";
import { protectedMiddleware, uploadFile } from "../middleware";

const userController = express.Router();

userController.get("/logout", protectedMiddleware, logout);
userController.get("/home", protectedMiddleware, userHome);
userController
  .route("/edit-profile")
  .all(protectedMiddleware)
  .get(getEditProfile)
  .post(uploadFile.single("avatar"), postEditProfile);
userController.get("/profile", protectedMiddleware, profile);
userController.get("/changePassword", changePassword);

export default userController;
