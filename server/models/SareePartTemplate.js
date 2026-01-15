import mongoose from "mongoose";

const sareePartTemplateSchema = new mongoose.Schema(
  {
    partType: {
      type: String,
      enum: ["body", "border", "pallu", "blouse"],
      required: true,
    },

    title: {
      type: String,
      required: true,
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

export default mongoose.model("SareePartTemplate", sareePartTemplateSchema);
