import { Schema, model, models, Types } from "mongoose";

const OrderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        priceAtPurchase: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
    shippingAddress: {
      line1: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    paymentId: { type: String },
    paymentGateway: { type: String, enum: ["Razorpay", "Stripe"] },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true }
);

export const Order = models.Order || model("Order", OrderSchema);
