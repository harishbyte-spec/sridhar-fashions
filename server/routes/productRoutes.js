import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct
} from "../controllers/productController.js";

import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
import { handleUpload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  verifyAdmin,
  handleUpload,
  createProduct
);

router.put(
  "/:id",
  verifyToken,
  verifyAdmin,
  handleUpload,
  updateProduct
);

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  deleteProduct
);

router.patch("/:id/occasions", verifyToken, verifyAdmin, updateProduct); // We can reuse updateProduct or make a specific one

export default router;
