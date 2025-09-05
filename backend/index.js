import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./authRoutes.js";
import path from "path";
import { fileURLToPath } from 'url';
import batchRoutes from "./batchRoutes.js";
import mongoose from "mongoose";
const PORT = process.env.PORT || 5000;



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app  = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api", authRoutes);          // prefix ALL routes with /api
app.use("/api", batchRoutes);          // prefix ALL routes with /api

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Mongo connected"))
  .catch((err) => {
    console.error("Mongo failed:", err.message);
    process.exit(1);
  });

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));