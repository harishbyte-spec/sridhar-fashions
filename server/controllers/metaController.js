// server/controllers/metaController.js
export const createItem = (Model) => async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // case-insensitive duplicate check
    const exists = await Model.findOne({
      name: { $regex: `^${name}$`, $options: "i" }
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "This name already exists",
      });
    }

    const item = await Model.create({ name });
    res.json({ success: true, item });

  } catch (err) {
    console.error("Create meta error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const getItems = (Model) => async (req, res) => {
  try {
    const items = await Model.find().sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (err) {
    console.error("Get meta error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const updateItem = (Model) => async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // check duplicate except this item
    const exists = await Model.findOne({
      _id: { $ne: id },
      name: { $regex: `^${name}$`, $options: "i" }
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Another item with this name already exists",
      });
    }

    const updated = await Model.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.json({ success: true, item: updated });

  } catch (err) {
    console.error("Update meta error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export const deleteItem = (Model) => async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Model.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: "Deleted successfully",
    });

  } catch (err) {
    console.error("Delete meta error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
