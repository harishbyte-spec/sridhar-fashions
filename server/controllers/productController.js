import Product from "../models/Product.js";
import {
  uploadToCloudinary,
  destroyFromCloudinary,
} from "../utils/cloudinaryUpload.js";

/* ================= CREATE PRODUCT ================= */
export const createProduct = async (req, res) => {
  try {
    const body = req.body;

    const productData = {
      title: body.title,
      price: body.price,
      productNo: body.productNo,
      category: body.category,
      collection: body.collection,
      fabric: body.fabric,
      shippingTime: body.shippingTime,
      origin: body.origin,
      jariType: body.jariType,
      silkMark: body.silkMark === "true" || body.silkMark === true,
      occasions: body.occasions ? JSON.parse(body.occasions) : [], // Parse JSON array string
    };

    /* ---------- GLOBAL THUMB ---------- */
    const thumb = req.files?.find(f => f.fieldname === "thumbnail");
    if (thumb) {
      const up = await uploadToCloudinary(
        thumb.buffer,
        "products/thumbnail"
      );
      productData.thumbnail = up.secure_url;
      productData.thumbnailPublicId = up.public_id;
    }

    /* ---------- TEXT TEMPLATES ---------- */
    [
      "description",
      "measurement",
      "washcare",
      "notes",
    ].forEach((k) => {
      productData[`${k}Type`] = body[`${k}Type`];
      productData[`${k}TemplateId`] = body[`${k}TemplateId`] || null;
      productData[`${k}Value`] = body[`${k}Value`] || "";
    });


    /* ---------- COLORS & PARTS PROCESSING ---------- */
    // Parse the colors metadata sent as JSON string
    const colorsMeta = JSON.parse(body.colors || "[]");
    productData.colors = [];

    for (let i = 0; i < colorsMeta.length; i++) {
      const cMeta = colorsMeta[i];

      // Initialize Color Object
      const colorObj = {
        name: cMeta.name,
        hexCode: cMeta.hexCode,
        images: [],
        videos: [],
        imagePublicIds: [],
        videoPublicIds: [],
        // Initialize Parts with Metadata (colorHex)
        body: { ...cMeta.parts?.body },
        border: { ...cMeta.parts?.border },
        pallu: { ...cMeta.parts?.pallu },
        blouse: { ...cMeta.parts?.blouse },
      };

      // 1. Process Main Images for this Color
      const colorImages = req.files?.filter(f => f.fieldname === `color_${i}_images`) || [];
      for (const img of colorImages) {
        const up = await uploadToCloudinary(img.buffer, "products/colors");
        colorObj.images.push(up.secure_url);
        colorObj.imagePublicIds.push(up.public_id);
      }

      // 2. Process Main Videos for this Color
      const colorVideos = req.files?.filter(f => f.fieldname === `color_${i}_videos`) || [];
      for (const vid of colorVideos) {
        const up = await uploadToCloudinary(vid.buffer, "products/colors", "video");
        colorObj.videos.push(up.secure_url);
        colorObj.videoPublicIds.push(up.public_id);
      }

      // 3. Process Saree Parts (Body, Border, Pallu, Blouse)
      const parts = ["body", "border", "pallu", "blouse"];
      for (const part of parts) {
        const partFile = req.files?.find(f => f.fieldname === `color_${i}_part_${part}`);
        if (partFile) {
          const up = await uploadToCloudinary(partFile.buffer, `products/${part}`);
          colorObj[part].image = up.secure_url;
          colorObj[part].imagePublicId = up.public_id;
        }
        // Ensure type defaults if not set
        colorObj[part].type = colorObj[part].type || "custom";
      }

      productData.colors.push(colorObj);
    }

    // FALLBACK: If no thumbnail was uploaded, use the first image of the first color
    if (!productData.thumbnail && productData.colors[0]?.images[0]) {
      productData.thumbnail = productData.colors[0].images[0];
      // Note: we don't necessarily need the public ID for fallback if we don't plan to delete it separately from the color images.
    }

    const product = await Product.create(productData);
    res.json({ success: true, product });

  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


/* --------------------------------------------------
   UPDATE PRODUCT
-------------------------------------------------- */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Not found" });

    const body = req.body;

    // 1. Basic Fields
    product.title = body.title;
    product.price = body.price;
    product.productNo = body.productNo;
    product.category = body.category;
    product.collection = body.collection;
    product.fabric = body.fabric;
    product.shippingTime = body.shippingTime;
    product.origin = body.origin;
    product.jariType = body.jariType;
    product.silkMark = body.silkMark === "true" || body.silkMark === true;

    if (body.occasions) {
      product.occasions = JSON.parse(body.occasions);
    }

    // 2. Global Thumbnail
    const thumb = req.files?.find(f => f.fieldname === "thumbnail");
    if (thumb) {
      // If there was an old thumbnail, we could delete it, but let's just overwrite reference for now or delete if needed
      if (product.thumbnailPublicId) {
        await destroyFromCloudinary(product.thumbnailPublicId);
      }
      const up = await uploadToCloudinary(thumb.buffer, "products/thumbnail");
      product.thumbnail = up.secure_url;
      product.thumbnailPublicId = up.public_id;
    }

    // 3. Templates
    [
      "description",
      "measurement",
      "washcare",
      "notes",
    ].forEach((k) => {
      product[`${k}Type`] = body[`${k}Type`];
      product[`${k}TemplateId`] = body[`${k}TemplateId`] || null;
      product[`${k}Value`] = body[`${k}Value`] || "";
    });

    // 4. Colors & Parts
    // We strictly rebuild colors from the metadata validation
    const colorsMeta = JSON.parse(body.colors || "[]");
    const newColors = [];

    for (let i = 0; i < colorsMeta.length; i++) {
      const cMeta = colorsMeta[i];

      const colorObj = {
        name: cMeta.name,
        hexCode: cMeta.hexCode,
        images: cMeta.existingImages || [], // Start with existing URLs sent from frontend
        videos: cMeta.existingVideos || [],
        imagePublicIds: [], // We might lose track of old public IDs if we don't send them, 
        // but usually we can live without them for now or assume they are managed elsewhere.
        // Ideally frontend should send publicIds too if we want to delete them later.
        videoPublicIds: [],

        body: { ...cMeta.parts?.body },
        border: { ...cMeta.parts?.border },
        pallu: { ...cMeta.parts?.pallu },
        blouse: { ...cMeta.parts?.blouse },
      };

      // 4a. Add NEW Main Images
      const colorImages = req.files?.filter(f => f.fieldname === `color_${i}_images`) || [];
      for (const img of colorImages) {
        const up = await uploadToCloudinary(img.buffer, "products/colors");
        colorObj.images.push(up.secure_url);
        colorObj.imagePublicIds.push(up.public_id);
      }

      // 4b. Add NEW Main Videos
      const colorVideos = req.files?.filter(f => f.fieldname === `color_${i}_videos`) || [];
      for (const vid of colorVideos) {
        const up = await uploadToCloudinary(vid.buffer, "products/colors", "video");
        colorObj.videos.push(up.secure_url);
        colorObj.videoPublicIds.push(up.public_id);
      }

      // 4c. Process Saree Parts
      const parts = ["body", "border", "pallu", "blouse"];
      for (const part of parts) {
        const partFile = req.files?.find(f => f.fieldname === `color_${i}_part_${part}`);

        // If there's a new file, upload it
        if (partFile) {
          const up = await uploadToCloudinary(partFile.buffer, `products/${part}`);
          colorObj[part].image = up.secure_url;
          colorObj[part].imagePublicId = up.public_id;
        } else {
          // Keep existing image if provided and no new file
          // The frontend sends `image: url` in cMeta.parts[part] if it exists
          if (cMeta.parts?.[part]?.image) {
            colorObj[part].image = cMeta.parts[part].image;
          }
        }
        colorObj[part].type = colorObj[part].type || "custom";
      }

      newColors.push(colorObj);
    }

    product.colors = newColors;

    await product.save();
    res.json({ success: true, product });

  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};




/* ================= GET ALL ================= */
export const getAllProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json({ success: true, products });
};

/* ================= GET ONE ================= */
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).json({ success: false });
  res.json({ success: true, product });
};

/* ================= DELETE ================= */
export const deleteProduct = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ success: false });

    if (prod.thumbnailPublicId)
      await destroyFromCloudinary(prod.thumbnailPublicId);

    for (const c of prod.colors) {
      for (const id of c.imagePublicIds)
        await destroyFromCloudinary(id, "image");
      for (const id of c.videoPublicIds)
        await destroyFromCloudinary(id, "video");
    }

    await prod.deleteOne();
    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
