import express from "express";
import morgan from "morgan";
import { localsMiddleware } from "./middleware";
import apiRouter from "./routers/apiRouter";
import rootRouter from "./routers/rootRouter";
import todoProjectRouter from "./routers/todoProject";
import userController from "./routers/userRouter";

const app = express();

app.set("views", `${process.cwd()}/src/views`);
app.set("view engine", "pug");
app.use(morgan("dev"));
app.use(localsMiddleware);

app.use("/", rootRouter);
app.use("/todos", todoProjectRouter);
app.use("/users", userController);
app.use("/api", apiRouter);

export default app;
