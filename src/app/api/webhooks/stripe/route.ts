import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2023-10-16",
} as any);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_placeholder"
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed.`, err.message);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  // Handle successful payments
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const paymentId = session.payment_intent as string;

    if (orderId) {
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
  }

  return NextResponse.json({ received: true });
}
