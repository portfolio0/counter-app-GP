import express from "express";
import CounterLog from "../models/CounterLog.js";
import { protect } from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/action", protect, async (req, res) => {
  const { categoryId, action } = req.body;

  await CounterLog.create({
    userId: req.user._id,
    categoryId,
    action,
  });

  res.json({ message: "Recorded" });
});

router.get("/history", protect, async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { userId: req.user._id };

  const logs = await CounterLog.find(filter)
    .populate("categoryId")
    .populate("userId")
    .sort({ createdAt: -1 });

  res.json(logs);
});

router.get("/summary", protect, async (req, res) => {
  const match = req.user.role === "admin" ? {} : { userId: req.user._id };

  const summary = await CounterLog.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$categoryId",
        total: {
          $sum: {
            $cond: [{ $eq: ["$action", "increment"] }, 1, -1],
          },
        },
      },
    },
  ]);

  res.json(summary);
});

export default router;
