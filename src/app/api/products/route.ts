import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { getAuthUser, isAdminUser } from "@/lib/auth";

// Public: Get all jewelry pieces
export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let query: any = {};
    if (category) query.category = category;
    if (featured === "true") query.featured = true;

    const products = await Product.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Admin Only: Add new jewelry piece
export async function POST(req: Request) {
  try {
    const admin = await isAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    await connectToDatabase();
    const body = await req.json();

    const allowedCategories = ["Rings", "Necklaces", "Earrings", "Bracelets", "Pendants", "Bespoke"];
    if (!allowedCategories.includes(body.category)) {
      return NextResponse.json({ error: "Invalid jewelry category" }, { status: 400 });
    }

    const product = await Product.create(body);
    return NextResponse.json({ message: "Product created successfully", product }, { status: 201 });
  } catch (error: any) {
    console.error("Product Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
