import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

export default mongoose.model("Category", categorySchema);
