import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectToDatabase from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export async function POST(req: Request) {
  const body = await req.json();
  const signature = req.headers.get("x-razorpay-signature") as string;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "razorpay_secret_placeholder";

  const isValid = Razorpay.validateWebhookSignature(JSON.stringify(body), signature, webhookSecret);

  if (!isValid) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  const event = body.event;

  if (event === "order.paid") {
    const orderId = body.payload.order.entity.notes.orderId;
    const paymentId = body.payload.payment.entity.id;

    await connectToDatabase();
    
    // 1. Update Order Status
    const order = await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "completed",
      paymentId: paymentId,
      orderStatus: "placed",
    }, { new: true });

    // 2. Decrease Product Stock
    if (order && order.items) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}
