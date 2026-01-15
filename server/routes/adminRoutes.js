import express from "express";
import { getAdminStats, getAllUsers, getWishlistInsights, getOrders, updateUserByAdmin, deleteUser } from "../controllers/adminController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Stats
router.get("/stats", verifyToken, verifyAdmin, getAdminStats);

// Insights & Management
router.get("/users", verifyToken, verifyAdmin, getAllUsers);
router.put("/users/:id", verifyToken, verifyAdmin, updateUserByAdmin);
router.delete("/users/:id", verifyToken, verifyAdmin, deleteUser);

router.get("/wishlist-insights", verifyToken, verifyAdmin, getWishlistInsights);
router.get("/orders", verifyToken, verifyAdmin, getOrders);

export default router;
