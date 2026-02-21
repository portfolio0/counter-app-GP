import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // ✅ Automatically adds createdAt (date & time)
  },
);

export default mongoose.model("Counter", counterSchema);
