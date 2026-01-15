import mongoose from "mongoose";

const HomeSettingsSchema = new mongoose.Schema({
    heroBanner: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" }
    },
    categories: [
        {
            url: { type: String, default: "" },
            publicId: { type: String, default: "" },
            title: { type: String, default: "" }
        }
    ],
    accessorizeImage: {
        url: { type: String, default: "" },
        publicId: { type: String, default: "" }
    }
}, { timestamps: true });

export default mongoose.model("HomeSettings", HomeSettingsSchema);
