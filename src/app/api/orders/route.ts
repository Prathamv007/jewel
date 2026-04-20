import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { Order } from "@/models/Order";

// Get user orders: High-end fulfillment tracking
export async function GET() {
  try {
    const payload = await getAuthUser();
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Admin path: can see all orders
    if (payload.role === "admin") {
      const orders = await Order.find({})
        .populate("userId", "firstName lastName email")
        .populate("items.product")
        .sort({ createdAt: -1 });
      return NextResponse.json({ orders });
    }

    // User path: only see own orders
    const orders = await Order.find({ userId: payload.userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Create order: Initializing checkout flow
export async function POST(req: Request) {
  try {
    const payload = await getAuthUser();
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    const { items, totalAmount, currency, shippingAddress, paymentGateway } = body;

    const order = await Order.create({
      userId: payload.userId,
      items,
      totalAmount,
      currency,
      shippingAddress,
      paymentGateway,
      paymentStatus: "pending",
    });

    return NextResponse.json({ message: "Order initialized", orderId: order._id });
  } catch (error) {
    return NextResponse.json({ error: "Order initialization failed" }, { status: 500 });
  }
}
