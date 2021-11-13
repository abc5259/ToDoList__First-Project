//root
import Board from "../models/Board";
import List from "../models/List";
import Task from "../models/Task";
import User from "../models/User";

export const home = async (req, res) => {
  return res.render("home", { pageTitle: "Home" });
};

//board

export const watch = async (req, res) => {
  const { id } = req.params;
  const board = await Board.findById(id).populate({
    path: "lists",
    populate: {
      path: "tasks",
      model: "Task",
    },
  });
  if (!board) {
    return res
      .statue(404)
      .render("board/watch", { pageTitle: "Board Not Found" });
  }
  res.render("board/watch", {
    pageTitle: "Board Watch",
    board,
  });
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

export const createList = async (req, res) => {
  const {
    params: { id },
    body: { title },
  } = req;
  const board = await Board.findById(id);
  console.log(board, "dawd");
  if (!board) {
    return res.sendStatus(404);
  }
  const list = await List.create({
    board: board._id,
    title,
  });
  board.lists.push(list._id);
  await board.save();
  console.log(board, list);
  return res.status(201).json({ listId: list._id });
};

export const updateList = async (req, res) => {
  const {
    params: { id },
    body: { listTitle, currentIndex },
  } = req;
  const board = await Board.findById(id).populate("lists");
  if (!board) {
    return res.sendStatus(404);
  }
  const preIndex = board.lists.findIndex(i => i.title === listTitle);
  const item = board.lists.splice(preIndex, 1);
  board.lists.splice(currentIndex, 0, item[0]);
  await board.save();
  return res.sendStatus(201);
};

export const editList = async (req, res) => {
  const {
    params: { id },
    body: { title },
  } = req;
  console.log(id, title);
  await List.findByIdAndUpdate(id, {
    title,
  });
  return res.sendStatus(201);
};

export const deleteList = async (req, res) => {
  const {
    params: { id },
    body: { listId },
  } = req;
  const board = await Board.findById(id);
  if (!board) {
    return res.sendStatus(404);
  }
  await List.findByIdAndDelete(id);
  board.lists.splice(board.lists.indexOf(listId), 1);
  await board.save();
  return res.sendStatus(200);
};

// Task

export const createTask = async (req, res) => {
  const {
    params: { id },
    body: { title },
  } = req;
  console.log(id, title);
  const list = await List.findById(id);
  if (!list) {
    return res.sendStatus(404);
  }
  const task = await Task.create({
    title,
    list: list.id,
    description: "",
  });
  if (!task) {
    return res.sendStatus(404);
  }
  list.tasks.push(task.id);
  await list.save();
  console.log(list);
  return res.status(201).json({ taskId: task.id });
};

export const watchTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) {
    return res.sendStatus(404);
  }
  console.log(task);
  return res.status(201).json({ task });
};

export const editTask = async (req, res) => {
  const {
    params: { id },
    body: { title },
  } = req;
  await Task.findByIdAndUpdate(id, {
    title,
  });
  return res.sendStatus(201);
};

export const deleteTask = async (req, res) => {
  const {
    params: { id: listId },
    body: { taskId },
  } = req;
  const list = await List.findById(listId);
  if (!list) {
    return res.sendStatus(404);
  }
  await Task.findByIdAndDelete(listId);
  list.tasks.splice(list.tasks.indexOf(taskId), 1);
  await list.save();
  return res.sendStatus(201);
};
