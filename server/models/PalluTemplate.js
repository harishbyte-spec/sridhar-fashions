import mongoose from "mongoose";

const PalluTemplateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    isLocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("PalluTemplate", PalluTemplateSchema);
