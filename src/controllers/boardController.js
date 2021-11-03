//root
import Board from "../models/Board";
import User from "../models/User";

export const home = (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

//board

export const watch = (req, res) => {
  res.render("board/watch", { pageTitle: "Board Watch" });
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
