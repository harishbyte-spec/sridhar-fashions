import mongoose from "mongoose";

const occasionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String, // Cloudinary URL
        required: false,
    },
    imagePublicId: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

export default mongoose.model("Occasion", occasionSchema);
