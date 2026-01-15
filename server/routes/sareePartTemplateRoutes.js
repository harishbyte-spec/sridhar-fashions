import express from "express";
import {
  createSareePartTemplate,
  getSareePartTemplates,
  deleteSareePartTemplate,
} from "../controllers/sareePartTemplateController.js";

import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------------------------------
   CREATE TEMPLATE
   body | border | pallu | blouse
--------------------------------------- */
router.post(
  "/",
  verifyToken,
  verifyAdmin,
  createSareePartTemplate
);

/* ---------------------------------------
   GET TEMPLATES
   /api/saree-parts?type=body
--------------------------------------- */
router.get(
  "/",
  verifyToken,
  verifyAdmin,
  getSareePartTemplates
);

/* ---------------------------------------
   DELETE TEMPLATE
--------------------------------------- */
router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  deleteSareePartTemplate
);

export default router;
