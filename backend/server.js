import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import counterRoutes from "./routes/counterRoutes.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"));

const app = express();
// app.use(cors());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://counter-app-gp.vercel.app"],
    credentials: true,
  }),
);
app.options("*", cors());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/counter", counterRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
// app.listen(5000, () => console.log("Server running on port 5000"));
