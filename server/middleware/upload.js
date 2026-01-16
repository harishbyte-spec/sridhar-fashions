// middleware/upload.js
import multer from "multer";
import path from "path";

// Store files in memory (buffer) for Cloudinary
const storage = multer.memoryStorage();

// Accept only image & video
const fileFilter = (req, file, cb) => {
  const allowedMimes = ["image", "video"];
  const isMimeAllowed = allowedMimes.some(type => file.mimetype.startsWith(type));

  // Allow octet-stream IF extension is valid
  // (Browser sometimes sends octet-stream for images in some contexts)
  const isOctetStream = file.mimetype === "application/octet-stream";
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = [
    ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".svg",
    ".heic", ".heif",
    ".mp4", ".mov", ".webm", ".avi", ".mkv"
  ];
  const isExtAllowed = allowedExts.includes(ext);

  if (isMimeAllowed || (isOctetStream && isExtAllowed)) {
    cb(null, true);
  } else {
    const err = new multer.MulterError("LIMIT_UNEXPECTED_FILE");
    err.message = "Only image/video files are allowed";
    cb(err, false);
  }
};

// Multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 60 * 1024 * 1024, // 60MB
    files: 50, // safe upper limit
  },
});

// ----- SAFE WRAPPER TO CATCH MULTER ERRORS -----
export const handleUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "Upload error",
      });
    } else if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "Upload failed",
      });
    }
    next();
  });
};

export default upload;
