import express from "express";
import Product from "../models/product.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    await Product.deleteMany({});

    const seedProducts = [
      {
        title: "Soft Silk Saree",
        price: 8499,
        category: "Silk",
        collection: "Classic",
        image: "/mnt/data/059ca268-aa41-4fd0-aff0-ec1ba65bb48a.png",
        colors: [
          {
            id: "red",
            displayName: "Red",
            swatch: "#c62828",
            images: [
              "/mnt/data/15c3caa1-f7a6-479c-a137-bfbb8c55a181.png",
              "/mnt/data/15c3caa1-f7a6-479c-a137-bfbb8c55a181.png"
            ]
          },
          {
            id: "blue",
            displayName: "Blue",
            swatch: "#1976a7",
            images: [
              "/mnt/data/059ca268-aa41-4fd0-aff0-ec1ba65bb48a.png",
              "/mnt/data/059ca268-aa41-4fd0-aff0-ec1ba65bb48a.png"
            ]
          }
        ]
      },

      {
        title: "Kanchipuram Silk Saree",
        price: 12999,
        category: "Silk",
        collection: "Wedding",
        image: "/mnt/data/810baefd-0d0a-4f2c-8e54-877704280e2b.png",
        colors: [
          {
            id: "green",
            displayName: "Green",
            swatch: "#5cc442",
            images: [
              "/mnt/data/810baefd-0d0a-4f2c-8e54-877704280e2b.png",
              "/mnt/data/810baefd-0d0a-4f2c-8e54-877704280e2b.png"
            ]
          }
        ]
      }
    ];

    await Product.insertMany(seedProducts);

    res.json({
      success: true,
      message: "Database seeded successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


export default router;
