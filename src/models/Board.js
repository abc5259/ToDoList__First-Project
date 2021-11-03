import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  createdAt: { type: Date, required: true, default: Date.now },
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }],
  backgroundColor: { type: String, default: "green" },
});

const Board = mongoose.model("Board", boardSchema);
export default Board;
