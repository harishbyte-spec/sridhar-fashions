// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id and role if we sign that way
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid/expired" });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Missing user" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden - admin only" });
  next();
};
