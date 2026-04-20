import mongoose from "mongoose";

const BespokeDesignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  designImage: {
    type: String, // Cloudinary or S3 URL
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    enum: ["14k Gold", "18k Gold", "22k Gold", "925 Silver", "Platinum", "Rose Gold"],
    required: true,
  },
  gemstones: {
    type: String,
    default: "None",
  },
  budget: {
    type: String,
    required: true,
  },
  timeline: {
    type: String,
    enum: ["1-2 Weeks", "3-5 Weeks", "2 Months", "Flexible"],
    default: "Flexible",
  },
  status: {
    type: String,
    enum: ["Pending Review", "Design in Progress", "Quoted", "In Production", "Completed", "Cancelled"],
    default: "Pending Review",
  },
  adminNotes: {
    type: String,
    default: "",
  },
  quoteAmount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const BespokeDesign = mongoose.models.BespokeDesign || mongoose.model("BespokeDesign", BespokeDesignSchema);
