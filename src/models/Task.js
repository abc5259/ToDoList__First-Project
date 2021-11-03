import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  list: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "List" },
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now, required: true },
  labelColor: { type: String },
  // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
