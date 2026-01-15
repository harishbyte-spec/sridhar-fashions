//server/utils/cloundiaryUpload.js
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (buffer, folder, resource_type = "image") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(buffer);
  });
};

export const destroyFromCloudinary = (publicId, resource_type = "image") => {
  return cloudinary.uploader.destroy(publicId, { resource_type });
};
