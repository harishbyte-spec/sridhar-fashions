// server/routes/orderRoutes.js
import express from "express";
import { logOrder } from "../controllers/orderController.js";

const router = express.Router();

// POST /api/orders (Used for logging WhatsApp clicks)
router.post("/", logOrder);

export default router;
