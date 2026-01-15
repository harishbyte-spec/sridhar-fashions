import mongoose from "mongoose";

/* ---------------- SAREE PART ---------------- */
const sareePartSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["custom", "template"],
    default: "custom",
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  content: {
    type: String,
    default: "",
  },
  colorHex: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  imagePublicId: {
    type: String,
    default: "",
  },
}, { _id: false });

/* ---------------- COLOR VARIANT ---------------- */
const colorSchema = new mongoose.Schema({
  name: { type: String, required: false },
  hexCode: { type: String, required: false },

  /* Main Media */
  images: [{ type: String }],
  videos: [{ type: String }],
  imagePublicIds: [{ type: String }],
  videoPublicIds: [{ type: String }],

  /* Saree Parts Per Color */
  body: sareePartSchema,
  border: sareePartSchema,
  pallu: sareePartSchema,
  blouse: sareePartSchema,
});

/* ---------------- PRODUCT ---------------- */
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, default: 0 },
    productNo: { type: String, required: true },

    category: { type: String, required: false },
    collection: { type: String, required: false },
    fabric: { type: String, required: false },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },

    occasions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Occasion" }], // New Field

    origin: { type: String },        // meta select
    jariType: { type: String },      // meta select

    shippingTime: { type: String },

    /* ---------- SILK MARK ---------- */
    silkMark: {
      type: Boolean,
      default: false,
    },

    /* ---------- GLOBAL THUMB ---------- */
    thumbnail: { type: String },
    thumbnailPublicId: { type: String },

    /* ---------- TEMPLATE SYSTEM ---------- */
    descriptionType: { type: String, enum: ["custom", "template"], default: "custom" },
    descriptionTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: "DescriptionTemplate", default: null },
    descriptionValue: { type: String, default: "" },

    measurementType: { type: String, enum: ["custom", "template"], default: "custom" },
    measurementTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: "MeasurementTemplate", default: null },
    measurementValue: { type: String, default: "" },

    washcareType: { type: String, enum: ["custom", "template"], default: "custom" },
    washcareTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: "WashCareTemplate", default: null },
    washcareValue: { type: String, default: "" },

    notesType: { type: String, enum: ["custom", "template"], default: "custom" },
    notesTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: "NotesTemplate", default: null },
    notesValue: { type: String, default: "" },

    /* ---------- COLORS (NOW INCLUDES PARTS) ---------- */
    colors: [colorSchema],
  },
  { timestamps: true }
);

if (mongoose.models.Product) {
  delete mongoose.models.Product;
}
const Product = mongoose.model("Product", productSchema);
export default Product;
