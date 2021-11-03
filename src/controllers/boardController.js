//root
import { async } from "regenerator-runtime";
import Board from "../models/Board";
import User from "../models/User";

export const home = async (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

//board

export const watch = async (req, res) => {
  const { id } = req.params;
  const board = await Board.findById(id);
  if (!board) {
    return res
      .statue(404)
      .render("board/watch", { pageTitle: "Board Not Found" });
  }
  res.render("board/watch", { pageTitle: "Board Watch", board });
};

//api

export const createBoard = async (req, res) => {
  const {
    body: { backgroundColor, title },
    session: { user: sessionUser },
  } = req;
  const user = await User.findById(sessionUser._id);
  const board = await Board.create({
    title,
    owner: user._id,
    backgroundColor,
  });
  user.boards.push(board._id);
  await user.save();
  req.session.user = user;
  return res.status(201).json({ board });
};
