import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/Product.js";

dotenv.config();

const checkExistence = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("MONGO_URI not found");
      process.exit(1);
    }
    
    await mongoose.connect(process.env.MONGO_URI);
    
    const existsCount = await Product.countDocuments({ status: { $exists: true } });
    const missingCount = await Product.countDocuments({ status: { $exists: false } });

    console.log(`Products WITH status field: ${existsCount}`);
    console.log(`Products WITHOUT status field: ${missingCount}`);

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

checkExistence();
