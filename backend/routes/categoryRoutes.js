import express from "express";
import Category from "../models/Category.js";
import CounterLog from "../models/CounterLog.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 CREATE CATEGORY (User Only)
router.post("/", protect, async (req, res) => {
  if (req.user.role === "admin") {
    return res.status(403).json({ message: "Admin cannot create counters" });
  }

  const category = await Category.create({
    name: req.body.name,
    userId: req.user._id,
  });

  res.json(category);
});

// 🔹 GET CATEGORIES
router.get("/", protect, async (req, res) => {
  const categories =
    req.user.role === "admin"
      ? await Category.find()
      : await Category.find({ userId: req.user._id });

  res.json(categories);
});

// 🔹 UPDATE CATEGORY NAME (User Only)
router.put("/:id", protect, async (req, res) => {
  if (req.user.role === "admin") {
    return res.status(403).json({ message: "Admin cannot edit counters" });
  }

  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { name: req.body.name },
    { new: true },
  );

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json(category);
});

// 🔹 DELETE CATEGORY (User Only)
router.delete("/:id", protect, async (req, res) => {
  if (req.user.role === "admin") {
    return res.status(403).json({ message: "Admin cannot delete counters" });
  }

  const category = await Category.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  // Delete related logs
  await CounterLog.deleteMany({
    categoryId: req.params.id,
  });

  res.json({ message: "Category deleted successfully" });
});

export default router;
