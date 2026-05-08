import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, budget, material, adminNotes } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (budget) updateData.budget = budget;
    if (material) updateData.material = material;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const updatedDesign = await prisma.bespokeDesign.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedDesign);
  } catch (error: any) {
    console.error("Bespoke PATCH error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const design = await prisma.bespokeDesign.findUnique({
      where: { id },
      include: { user: { select: { firstName: true, lastName: true, email: true } } }
    });

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    if (user.role !== "admin" && design.userId !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(design);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
