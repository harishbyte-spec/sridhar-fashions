import mongoose from "mongoose";

const colorTemplateSchema = new mongoose.Schema(
  {
    colorName: { type: String, required: true },
    colorHex: { type: String, required: true },
    partType: { type: String, default: "generic" }, // NEW: body, border, pallu, blouse, generic
    isLocked: { type: Boolean, default: false }, // NEW
  },
  { timestamps: true }
);

export default mongoose.model("ColorTemplate", colorTemplateSchema);
