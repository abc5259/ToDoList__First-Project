import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  board: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Board" },
  title: { type: String, required: true },
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

const Card = mongoose.model("Card", cardSchema);
export default Card;
