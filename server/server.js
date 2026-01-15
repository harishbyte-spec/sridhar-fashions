import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import productRoutes from "./routes/productRoutes.js";
import seedRoutes from "./routes/seedRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import templateRoutes from "./routes/templateRoutes.js";
import metaRoutes from "./routes/metaRoutes.js";
import sareePartTemplateRoutes from "./routes/sareePartTemplateRoutes.js";
import occasionRoutes from "./routes/occasionRoutes.js";
import homeSettingsRoutes from "./routes/homeSettingsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // <-- allow image access

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✔"))
  .catch((err) => console.log("MongoDB Error ❌", err));

// Routes
app.use("/api/seed", seedRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/saree-parts", sareePartTemplateRoutes);
app.use("/api/occasions", occasionRoutes);
app.use("/api/home-settings", homeSettingsRoutes);
app.use("/api/orders", orderRoutes);






// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
  console.log("Deployed Version: Fix-Edit-Validation-v3"); // Force Refresh
});
