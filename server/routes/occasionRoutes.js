import express from "express";
import { getOccasions, createOccasion, deleteOccasion } from "../controllers/occasionController.js";
import upload from "../middleware/upload.js"; // Assuming you have multer upload mw

const router = express.Router();

router.get("/", getOccasions);
router.post("/", upload.single("image"), createOccasion);
router.delete("/:id", deleteOccasion);

export default router;
