// server/controllers/orderController.js
import Order from "../models/Order.js";

export const logOrder = async (req, res) => {
    try {
        const { userEmail, productName, productImage } = req.body;

        if (!userEmail || !productName) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const order = await Order.create({
            userEmail,
            productName,
            productImage,
        });

        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error("Log Order error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
