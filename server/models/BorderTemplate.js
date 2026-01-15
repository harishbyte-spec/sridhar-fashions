// models/PalluTemplate.js
import mongoose from "mongoose";

const BorderTemplateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("BorderTemplate", BorderTemplateSchema);
