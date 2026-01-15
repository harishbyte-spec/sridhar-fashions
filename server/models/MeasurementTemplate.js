import mongoose from "mongoose";

const measurementTemplateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    measurements: { type: String, required: true },
    isLocked: { type: Boolean, default: false }, // NEW
  },
  { timestamps: true }
);

export default mongoose.model("MeasurementTemplate", measurementTemplateSchema);
