import DescriptionTemplate from "../models/DescriptionTemplate.js";
import MeasurementTemplate from "../models/MeasurementTemplate.js";
import WashCareTemplate from "../models/WashCareTemplate.js";
import ColorTemplate from "../models/ColorTemplate.js";
import NotesTemplate from "../models/NotesTemplate.js";
import SareePartTemplate from "../models/SareePartTemplate.js";


// ------------------------
// CREATE DESCRIPTION TEMPLATE
// ------------------------
// controllers/templateController.js

export const createDescription = async (req, res) => {
  try {
    const { title, content, isLocked } = req.body;

    const doc = await DescriptionTemplate.create({
      title,
      content,
      isLocked: Boolean(isLocked),
    });

    res.json({ success: true, template: doc });
  } catch (err) {
    console.error("Create description error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



// ------------------------
// GET ALL DESCRIPTION TEMPLATES
// ------------------------
export const getDescriptions = async (req, res) => {
  try {
    const templates = await DescriptionTemplate.find();
    res.json({ success: true, templates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------
// CREATE MEASUREMENT TEMPLATE
// ------------------------
export const createMeasurement = async (req, res) => {
  try {
    const { title, measurements, isLocked } = req.body;

    const template = await MeasurementTemplate.create({
      title,
      measurements,
      isLocked: isLocked === "true" || isLocked === true
    });

    res.json({ success: true, template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET MEASUREMENT TEMPLATES
export const getMeasurements = async (req, res) => {
  try {
    const templates = await MeasurementTemplate.find();
    res.json({ success: true, templates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------
// CREATE WASHCARE TEMPLATE
// ------------------------
export const createWashCare = async (req, res) => {
  try {
    const { title, instructions, isLocked } = req.body;

    const template = await WashCareTemplate.create({
      title,
      instructions,
      isLocked: isLocked === "true" || isLocked === true
    });

    res.json({ success: true, template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET WASH CARE TEMPLATES
export const getWashCare = async (req, res) => {
  try {
    const templates = await WashCareTemplate.find();
    res.json({ success: true, templates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------
// CREATE COLOR TEMPLATE
// ------------------------
export const createColor = async (req, res) => {
  try {
    const { colorName, colorHex, partType, isLocked } = req.body;
    const effectivePartType = partType || "generic";

    // Check if color exists (by name or hex) WITHIN the same partType
    const existing = await ColorTemplate.findOne({
      partType: effectivePartType,
      $or: [{ colorName }, { colorHex }],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Color with this name or HEX code already exists for ${effectivePartType}`,
      });
    }

    const color = await ColorTemplate.create({
      colorName,
      colorHex,
      partType: effectivePartType,
      isLocked: isLocked === "true" || isLocked === true,
    });

    res.json({ success: true, color });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// GET COLOR TEMPLATES
export const getColors = async (req, res) => {
  try {
    const { partType } = req.query;
    const filter = partType ? { partType } : {};
    const colors = await ColorTemplate.find(filter);
    res.json({ success: true, colors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



// CREATE NOTES TEMPLATE
export const createNotes = async (req, res) => {
  try {
    const { title, notes, isLocked } = req.body;

    const template = await NotesTemplate.create({
      title,
      notes,
      isLocked: isLocked === "true" || isLocked === true
    });

    res.json({ success: true, template });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET NOTES TEMPLATES
export const getNotes = async (req, res) => {
  try {
    const templates = await NotesTemplate.find();
    res.json({ success: true, templates });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const createSareePartTemplate = async (req, res) => {
  try {
    const { partType, title, content } = req.body;

    if (!partType || !title || !content) {
      return res.status(400).json({
        success: false,
        message: "partType, title and content are required",
      });
    }

    const item = await SareePartTemplate.create({
      partType,
      title,
      content,
    });

    res.json({ success: true, item });
  } catch (err) {
    console.error("Create saree part error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------------- GET SAREE PART TEMPLATES ---------------- */
export const getSareePartTemplates = async (req, res) => {
  try {
    const { partType } = req.query;

    const filter = partType ? { partType } : {};

    const items = await SareePartTemplate.find(filter).sort({
      createdAt: -1,
    });

    res.json({ success: true, items });
  } catch (err) {
    console.error("Get saree part error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* --------------------------------------------------
   GENERIC DELETE TEMPLATE
-------------------------------------------------- */
export const deleteTemplateByType = async (req, res) => {
  try {
    const { type, id } = req.params;

    let Model;
    switch (type) {
      case "description":
        Model = DescriptionTemplate;
        break;
      case "measurement":
        Model = MeasurementTemplate;
        break;
      case "washcare":
        Model = WashCareTemplate;
        break;
      case "color":
        Model = ColorTemplate;
        break;
      case "notes":
        Model = NotesTemplate;
        break;
      case "saree-part":
        Model = SareePartTemplate;
        break;
      default:
        return res.status(400).json({ success: false, message: "Invalid template type" });
    }

    const deleted = await Model.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }

    res.json({ success: true, message: "Template deleted successfully" });
  } catch (err) {
    console.error("Delete template error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};