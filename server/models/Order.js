// server/models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        userEmail: { type: String, required: true },
        productName: { type: String, required: true },
        productImage: { type: String },
        clickedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
