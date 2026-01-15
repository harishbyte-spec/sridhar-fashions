import express from "express";
import {
  createItem,
  getItems,
  updateItem,
  deleteItem
} from "../controllers/metaController.js";

import Category from "../models/Category.js";
import Collection from "../models/Collection.js";
import Fabric from "../models/Fabric.js";
import Origin from "../models/Origin.js";
import JariType from "../models/JariType.js";

import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* Category */
router.post("/category", verifyToken, verifyAdmin, createItem(Category));
router.get("/category", getItems(Category));
router.put("/category/:id", verifyToken, verifyAdmin, updateItem(Category));
router.delete("/category/:id", verifyToken, verifyAdmin, deleteItem(Category));

/* Collection */
router.post("/collection", verifyToken, verifyAdmin, createItem(Collection));
router.get("/collection", getItems(Collection));
router.put("/collection/:id", verifyToken, verifyAdmin, updateItem(Collection));
router.delete("/collection/:id", verifyToken, verifyAdmin, deleteItem(Collection));

/* Fabric */
router.post("/fabric", verifyToken, verifyAdmin, createItem(Fabric));
router.get("/fabric", getItems(Fabric));
router.put("/fabric/:id", verifyToken, verifyAdmin, updateItem(Fabric));
router.delete("/fabric/:id", verifyToken, verifyAdmin, deleteItem(Fabric));

/* Origin */
router.post("/origin", verifyToken, verifyAdmin, createItem(Origin));
router.get("/origin", getItems(Origin));
router.put("/origin/:id", verifyToken, verifyAdmin, updateItem(Origin));
router.delete("/origin/:id", verifyToken, verifyAdmin, deleteItem(Origin));

/* Jari Type */
router.post("/jari", verifyToken, verifyAdmin, createItem(JariType));
router.get("/jari", getItems(JariType));
router.put("/jari/:id", verifyToken, verifyAdmin, updateItem(JariType));
router.delete("/jari/:id", verifyToken, verifyAdmin, deleteItem(JariType));

export default router;
