import mongoose from "mongoose";

const counterLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    action: { type: String, enum: ["increment", "decrement"] },
  },
  { timestamps: true },
);

export default mongoose.model("CounterLog", counterLogSchema);
