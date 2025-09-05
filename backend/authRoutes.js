import express from "express";
import multer from "multer";
import path from "path";
import { signupCollege, signinCollege, getCollegeProfile } from "./controllers.js";
import authMiddleware from "./authMiddleware.js";

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
    // const ext = path.extname(file.originalname);
    // const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, unique + ext);
  },
});

const upload = multer({ storage });

// Routes
router.post("/signup", upload.single("logo"), signupCollege);
router.post("/login", signinCollege);
// Profile route - requires auth
router.get("/profile", authMiddleware, getCollegeProfile);

export default router;
