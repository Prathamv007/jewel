import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminUser } from "@/lib/auth";

// Public: Get specific jewelry detail
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const product = await prisma.product.findUnique({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ error: "Jewelry piece not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Admin Only: Update jewelry metadata
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const admin = await isAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const product = await prisma.product.update({
      where: { id: params.id },
      data: body
    });

    return NextResponse.json({ message: "Product updated successfully", product });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Admin Only: Remove jewelry piece from catalog
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const admin = await isAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const product = await prisma.product.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
