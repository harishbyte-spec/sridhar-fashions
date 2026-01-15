import HomeSettings from "../models/HomeSettings.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export const getHomeSettings = async (req, res) => {
    try {
        let settings = await HomeSettings.findOne();
        if (!settings) {
            settings = await HomeSettings.create({
                heroBanner: { url: "", publicId: "" },
                categories: [
                    { url: "", publicId: "", title: "" },
                    { url: "", publicId: "", title: "" },
                    { url: "", publicId: "", title: "" }
                ],
                accessorizeImage: { url: "", publicId: "" }
            });
        }
        res.json({ success: true, settings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateHomeSettings = async (req, res) => {
    try {
        const { type, index } = req.body; // type: hero, category, accessorize

        // Since we use upload.any(), the file will be in req.files
        const file = req.files?.find(f => f.fieldname === "image");

        if (!file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        // Use file.buffer because we use memoryStorage
        const uploadRes = await uploadToCloudinary(file.buffer, "homepage");
        let settings = await HomeSettings.findOne();

        if (!settings) {
            settings = new HomeSettings();
        }

        if (type === "hero") {
            settings.heroBanner = { url: uploadRes.secure_url, publicId: uploadRes.public_id };
            settings.markModified('heroBanner');
        } else if (type === "accessorize") {
            console.log("UPDATING ACCESSORIZE IMAGE...");
            settings.accessorizeImage = { url: uploadRes.secure_url, publicId: uploadRes.public_id };
            settings.markModified('accessorizeImage');
        } else if (type === "category" && index !== undefined) {
            const idx = parseInt(index);
            if (!settings.categories[idx]) {
                settings.categories[idx] = { url: "", publicId: "", title: "" };
            }
            settings.categories[idx].url = uploadRes.secure_url;
            settings.categories[idx].publicId = uploadRes.public_id;
            settings.markModified('categories');
        }

        await settings.save();
        console.log("SETTINGS SAVED SUCCESSFULLY");
        res.json({ success: true, settings });
    } catch (err) {
        console.error("HOME SETTINGS UPLOAD ERROR:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateCategoryTitle = async (req, res) => {
    try {
        const { index, title } = req.body;
        let settings = await HomeSettings.findOne();
        if (!settings) return res.status(404).json({ success: false, message: "Settings not found" });

        if (settings.categories[index]) {
            settings.categories[index].title = title;
        }
        await settings.save();
        res.json({ success: true, settings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
