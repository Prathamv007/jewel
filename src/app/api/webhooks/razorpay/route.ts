import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import prisma from "@/lib/prisma";

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

    // 1. Update Order Status
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "completed",
        paymentId: paymentId,
        orderStatus: "placed",
      },
      include: { items: true }
    });

    // 2. Decrease Product Stock
    if (order && order.items) {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }
    }
  }

  return NextResponse.json({ status: "ok" });
}
