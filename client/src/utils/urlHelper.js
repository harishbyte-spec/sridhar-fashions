/**
 * urlHelper.js
 * Utility for manipulating Cloudinary URLs (e.g., adding watermarks)
 */

export const addWatermark = (url) => {
    if (!url || typeof url !== "string") return url;

    // Only apply to Cloudinary images
    if (url.includes("res.cloudinary.com") && !url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/)) {
        // Cloudinary dynamic transformation for text overlay
        // l_text:Playfair Display_20_bold:Sridhar Fashions -> Layer text
        // co_rgba:ffffff30 -> Color white with 30% opacity
        // g_center -> Position center
        // o_20 -> Layer opacity 20 (redundant with rgba but safe)
        const transformation = "l_text:Arial_40_bold:Sridhar%20Fashions,co_rgb:ffffff,o_30,g_center";

        // Cloudinary URLs typically look like: .../upload/v12345678/path/to/image.jpg
        // We insert transformations after '/upload/'
        if (url.includes("/upload/")) {
            return url.replace("/upload/", `/upload/${transformation}/`);
        }
    }

    return url;
};
