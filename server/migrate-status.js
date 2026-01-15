import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/Product.js";

dotenv.config();

const migrate = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("MONGO_URI not found");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const result = await Product.updateMany(
            { status: { $exists: false } }, // filter
            { $set: { status: "published" } } // update
        );

        console.log(`Migration complete.`);
        console.log(`Matched: ${result.matchedCount}`);
        console.log(`Modified: ${result.modifiedCount}`);

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

migrate();
