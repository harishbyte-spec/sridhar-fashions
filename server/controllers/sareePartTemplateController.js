import SareePartTemplate from "../models/SareePartTemplate.js";

/* ---------------- CREATE TEMPLATE ---------------- */
export const createSareePartTemplate = async (req, res) => {
  try {
    const { partType, title, content, isLocked } = req.body;

    if (!partType || !title || !content) {
      return res.status(400).json({
        success: false,
        message: "partType, title and content are required",
      });
    }

    const template = await SareePartTemplate.create({
      partType,
      title,
      content,
      isLocked: isLocked || false,
    });

    res.json({ success: true, template });
  } catch (err) {
    console.error("Create SareePartTemplate error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ---------------- GET ALL TEMPLATES ---------------- */
export const getSareePartTemplates = async (req, res) => {
  try {
    const { type } = req.query;

    const filter = type ? { partType: type } : {};

    const templates = await SareePartTemplate.find(filter)
      .sort({ createdAt: -1 });

    res.json({ success: true, templates });
  } catch (err) {
    console.error("Get SareePartTemplates error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------------- UPDATE TEMPLATE ---------------- */
export const updateSareePartTemplate = async (req, res) => {
  try {
    const updated = await SareePartTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    res.json({ success: true, template: updated });
  } catch (err) {
    console.error("Update saree part template error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------------- DELETE TEMPLATE ---------------- */
export const deleteSareePartTemplate = async (req, res) => {
  try {
    const template = await SareePartTemplate.findById(req.params.id);

    if (!template) {
      return res.status(404).json({
        success: false,
        message: "Template not found",
      });
    }

    if (template.isLocked) {
      return res.status(403).json({
        success: false,
        message: "Locked template cannot be deleted",
      });
    }

    await template.deleteOne();

    res.json({ success: true, message: "Template deleted" });
  } catch (err) {
    console.error("Delete SareePartTemplate error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};