// controllers/adminController.js
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email & password required" });

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashed });
    res.status(201).json({ success: true, admin: { id: admin._id, email: admin.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: admin.role, email: admin.email }, process.env.JWT_SECRET, { expiresIn: "8h" });

    res.json({ success: true, token, admin: { id: admin._id, email: admin.email, name: admin.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// stats (you already had)
export const getAdminStats = async (req, res) => {
  try {
    const userCount = await (await import("../models/User.js")).default.countDocuments().catch(() => 0);
    const productCount = await (await import("../models/product.js")).default.countDocuments();
    res.json({ success: true, users: userCount, products: productCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    const users = await User.find().select("name email phone role createdAt").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET WISHLIST INSIGHTS
export const getWishlistInsights = async (req, res) => {
  try {
    const User = (await import("../models/User.js")).default;
    // Find users who have items in their wishlist and populate the products
    const insights = await User.find({ wishlist: { $exists: true, $not: { $size: 0 } } })
      .select("name email wishlist")
      .populate("wishlist", "title price thumbnail");

    res.json({ success: true, insights });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ORDERS (WhatsApp Clicks)
export const getOrders = async (req, res) => {
  try {
    const Order = (await import("../models/Order.js")).default;
    const orders = await Order.find().sort({ clickedAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE USER BY ADMIN
export const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, password } = req.body;
    const User = (await import("../models/User.js")).default;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (role) user.role = role;

    // Admin can override password
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ success: true, message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const User = (await import("../models/User.js")).default;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
