import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// 🔥 STATIC ADMIN
const ADMIN_EMAIL = "admin@counter.com";
const ADMIN_PASSWORD = "admin123";

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: "user",
  });

  res.json(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 🔥 STATIC ADMIN LOGIN
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign(
      { id: "admin", role: "admin" },
      process.env.JWT_SECRET,
    );

    return res.json({
      token,
      role: "admin",
      name: "Administrator",
    });
  }

  // Normal user login
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: user._id, role: "user" },
    process.env.JWT_SECRET,
  );

  res.json({
    token,
    role: "user",
    name: user.name,
  });
});

export default router;
