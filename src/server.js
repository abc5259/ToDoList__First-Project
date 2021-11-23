import express from "express";
import morgan from "morgan";
import { localsMiddleware } from "./middleware";
import apiRouter from "./routers/apiRouter";
import rootRouter from "./routers/rootRouter";
import userController from "./routers/userRouter";
import boardRouter from "./routers/boardRouter";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "express-flash";

const app = express();

app.set("views", `${process.cwd()}/src/views`);
app.set("view engine", "pug");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
  })
);
app.use(flash());
app.use(localsMiddleware);
app.use("/static", express.static("assets"));
app.use("/uploads", express.static("uploads"));

app.use("/", rootRouter);
app.use("/boards", boardRouter);
app.use("/users", userController);
app.use("/api", apiRouter);

export default app;
