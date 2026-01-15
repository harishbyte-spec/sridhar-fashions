import express from "express";
import { getHomeSettings, updateHomeSettings, updateCategoryTitle } from "../controllers/homeSettingsController.js";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import { handleUpload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getHomeSettings);
router.post("/update-image", verifyToken, verifyAdmin, handleUpload, updateHomeSettings);
router.post("/update-title", verifyToken, verifyAdmin, updateCategoryTitle);

export default router;
