import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String },
  socialOnly: { type: Boolean, default: false },
  password: { type: String },
  name: { type: String, required: true },
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Board" }],
  // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const User = mongoose.model("User", userSchema);

export default User;
