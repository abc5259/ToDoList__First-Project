import mongoose from "mongoose";

const listSchema = new mongoose.Schema({
  board: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Board" },
  title: { type: String, required: true, maxlength: 20, trim: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

const List = mongoose.model("List", listSchema);
export default List;
