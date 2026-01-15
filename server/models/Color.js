import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    hexCode: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Color", colorSchema);
