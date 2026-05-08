import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser, isAdminUser } from "@/lib/auth";

// Public: Get all jewelry pieces
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let where: any = {};
    if (category) where.category = category;
    if (featured === "true") where.featured = true;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
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

    const { imageUrl, ...validData } = await req.json();

    const allowedCategories = ["Rings", "Necklaces", "Earrings", "Bracelets", "Pendants", "Bespoke"];
    if (!allowedCategories.includes(validData.category)) {
      return NextResponse.json({ error: "Invalid jewelry category" }, { status: 400 });
    }

    const product = await prisma.product.create({ data: validData });
    return NextResponse.json({ message: "Product created successfully", product }, { status: 201 });
  } catch (error: any) {
    console.error("Product Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
