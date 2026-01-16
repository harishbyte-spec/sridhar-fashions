/**
 * urlHelper.js
 * Utility for manipulating Cloudinary URLs (e.g., adding watermarks)
 */

export const addWatermark = (url) => {
    if (!url || typeof url !== "string") return url;

    // Apply to Cloudinary assets (images and videos)
    if (url.includes("res.cloudinary.com")) {
        // Cloudinary dynamic transformation for text overlay
        // l_text:Playfair Display_20_bold:Sridhar Fashions -> Layer text
        // co_rgba:ffffff30 -> Color white with 30% opacity
        // g_center -> Position center
        // o_20 -> Layer opacity 20 (redundant with rgba but safe)
        // Use robust chained transformations for consistent relative sizing across all media

        // Logo: Load "sf_logo_watermark" -> Scale to 12% of container width -> Apply centered and slightly up
        const logoLayer = `l_site_assets:sf_logo_watermark/c_scale,w_0.12,fl_relative/fl_layer_apply,g_center,y_-0.05,o_60`;

        // Text: Load text -> Scale to 35% of container width -> Apply centered and slightly down
        const textLayer = `l_text:Arial_80_bold:Sridhar%20Fashions/c_scale,w_0.35,fl_relative/fl_layer_apply,g_center,y_0.05,o_40`;

        const transformation = `${logoLayer}/${textLayer}`;

        // Cloudinary URLs typically look like: .../upload/v12345678/path/to/image.jpg
        // We insert transformations after '/upload/'
        if (url.includes("/upload/")) {
            return url.replace("/upload/", `/upload/${transformation}/`);
        }
    }

    return url;
};
