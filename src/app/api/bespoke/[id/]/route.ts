import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { BespokeDesign } from "@/models/BespokeDesign";

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

    await connectToDatabase();
    
    const updateData: any = {};
    if (status) updateData.status = status;
    if (budget) updateData.budget = budget;
    if (material) updateData.material = material;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const updatedDesign = await BespokeDesign.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedDesign) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

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

    await connectToDatabase();
    const design = await BespokeDesign.findById(id).populate("userId", "firstName lastName email");

    if (!design) {
      return NextResponse.json({ error: "Design not found" }, { status: 404 });
    }

    // Authorization check: Only admin or the owner can see it
    if (user.role !== "admin" && design.userId.toString() !== user.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(design);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
