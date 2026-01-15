import express from "express";
import { registerUser, loginUser, getProfile, updateProfile } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// GET /api/auth/profile
router.get("/profile", verifyToken, getProfile);

// PUT /api/auth/profile
router.put("/profile", verifyToken, updateProfile);

export default router;
