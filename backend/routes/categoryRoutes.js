import express from "express";
import Category from "../models/Category.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
    userId: req.user._id,
  });
  res.json(category);
});

router.get("/", protect, async (req, res) => {
  const categories =
    req.user.role === "admin"
      ? await Category.find()
      : await Category.find({ userId: req.user._id });

  res.json(categories);
});

export default router;
