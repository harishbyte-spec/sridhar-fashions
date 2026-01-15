// models/Admin.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // store hashed
  role: { type: String, default: "admin" }
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);
