import Occasion from "../models/Occasion.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// Get all
export const getOccasions = async (req, res) => {
  try {
    const occasions = await Occasion.find({ isActive: true });
    res.status(200).json({ success: true, occasions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create
export const createOccasion = async (req, res) => {
  try {
    const { name } = req.body;
    let image = "";
    let imagePublicId = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.path, "occasions");
      image = result.secure_url;
      imagePublicId = result.public_id;
    }

    const newOccasion = new Occasion({
      name,
      image,
      imagePublicId,
    });

    await newOccasion.save();
    res.status(201).json({ success: true, occasion: newOccasion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete (Soft delete or hard delete - using hard for now for simplicity)
export const deleteOccasion = async (req, res) => {
  try {
    const { id } = req.params;
    await Occasion.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Occasion deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
