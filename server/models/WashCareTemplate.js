import mongoose from "mongoose";

const washCareTemplateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    instructions: { type: String, required: true },
    isLocked: { type: Boolean, default: false }, // NEW
  },
  { timestamps: true }
);

export default mongoose.model("WashCareTemplate", washCareTemplateSchema);
