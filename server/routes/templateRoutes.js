import express from "express";
import {
  createDescription,
  getDescriptions,
  createMeasurement,
  getMeasurements,
  createWashCare,
  getWashCare,
  createColor,
  getColors,
  createNotes,
  getNotes,
  createSareePartTemplate,
  getSareePartTemplates,
  deleteTemplateByType,
} from "../controllers/templateController.js";


import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// DESCRIPTION
router.post("/description", verifyToken, verifyAdmin, createDescription);
router.get("/description", verifyToken, verifyAdmin, getDescriptions);

// MEASUREMENT
router.post("/measurement", verifyToken, verifyAdmin, createMeasurement);
router.get("/measurement", verifyToken, verifyAdmin, getMeasurements);

// WASHCARE
router.post("/washcare", verifyToken, verifyAdmin, createWashCare);
router.get("/washcare", verifyToken, verifyAdmin, getWashCare);

// COLOR TEMPLATE
router.post("/color", verifyToken, verifyAdmin, createColor);
router.get("/color", getColors); // Public endpoint for Shop page

// NOTES TEMPLATE
router.post("/notes", verifyToken, verifyAdmin, createNotes);
router.get("/notes", verifyToken, verifyAdmin, getNotes);

// SAREE PART TEMPLATES
router.post(
  "/saree-part",
  verifyToken,
  verifyAdmin,
  createSareePartTemplate
);

// usage: /saree-part?partType=blouse
router.get("/saree-part", getSareePartTemplates);

// GENERIC DELETE
router.delete("/delete/:type/:id", verifyToken, verifyAdmin, deleteTemplateByType);

export default router;
