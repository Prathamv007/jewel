import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
      type: String, 
      required: true, 
      enum: ["Rings", "Necklaces", "Earrings", "Bracelets", "Bespoke"] 
    },
    images: [{ type: String, required: true }],
    stock: { type: Number, default: 0 },
    material: { type: String, enum: ["18K Gold", "14K Gold", "Platinum", "Silver", "Brass"] },
    plating: { type: String, enum: ["18K Gold Plated", "Rose Gold Plated", "Rhodium", "None"], default: "None" },
    isAntiTarnish: { type: Boolean, default: false },
    gemstone: { type: String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = models.Product || model("Product", ProductSchema);
