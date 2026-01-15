// middleware/upload.js
import multer from "multer";

// Store files in memory (buffer) for Cloudinary
const storage = multer.memoryStorage();

// Accept only image & video
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
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
