import mongoose from "mongoose";

const notesTemplateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    notes: { type: String, required: true },
    isLocked: { type: Boolean, default: false }, // NEW
  },
  { timestamps: true }
);

export default mongoose.model("NotesTemplate", notesTemplateSchema);
