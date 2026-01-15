import jwt from "jsonwebtoken";
import { ADMIN_EMAILS } from "../config/admins.js";
import { sendNewUserNotification, sendWelcomeEmail } from "../utils/emailService.js";

import User from "../models/User.js";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// =======================
// REGISTER USER
// (for now: open; later we can restrict)
// =======================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // Only allow role set if first user OR manually later
    let userRole = "user";
    const userCount = await User.countDocuments();

    if (userCount === 0 && role === "admin") {
      // First-ever user can be admin
      userRole = "admin";
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    const token = generateToken(user);

    // Send email notifications (non-blocking)
    sendNewUserNotification(user.name, user.email);
    sendWelcomeEmail(user.name, user.email);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================
// LOGIN USER
// =======================
// =======================
// LOGIN USER (Updated for Admin Role)
// =======================

// =======================
// LOGIN USER (FINAL & CLEAN)
// =======================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ----------------------------
    // ADMIN ROLE DETECTION
    // ----------------------------
    let detectedRole = user.role;

    if (ADMIN_EMAILS.includes(email)) {
      detectedRole = "admin";

      // Sync database role
      if (user.role !== "admin") {
        user.role = "admin";
        await user.save();
      }
    }

    // ----------------------------
    // CREATE TOKEN WITH UPDATED ROLE
    // ----------------------------
    const token = jwt.sign(
      { id: user._id, role: detectedRole },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: detectedRole,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================
// GET USER PROFILE
// =======================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error("Get Profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// =======================
// UPDATE USER PROFILE
// =======================
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (addresses) user.addresses = addresses;
    if (wishlist) user.wishlist = wishlist;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update Profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
