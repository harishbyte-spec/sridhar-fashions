import mongoose from "mongoose";

const jariTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("JariType", jariTypeSchema);
