import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const payload = await getAuthUser();
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (payload.role === "admin") {
      const orders = await prisma.order.findMany({
        include: { user: { select: { firstName: true, lastName: true, email: true } }, items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json({ orders });
    }

    const orders = await prisma.order.findMany({
      where: { userId: payload.userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await getAuthUser();
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, totalAmount, currency, shippingAddress, paymentGateway } = body;

    const order = await prisma.order.create({
      data: {
        userId: payload.userId,
        totalAmount,
        currency,
        shippingLine1: shippingAddress?.line1,
        shippingCity: shippingAddress?.city,
        shippingState: shippingAddress?.state,
        shippingPostalCode: shippingAddress?.postalCode,
        shippingCountry: shippingAddress?.country,
        paymentGateway,
        paymentStatus: "pending",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.price
          }))
        }
      }
    });

    return NextResponse.json({ message: "Order initialized", orderId: order.id });
  } catch (error) {
    return NextResponse.json({ error: "Order initialization failed" }, { status: 500 });
  }
}
