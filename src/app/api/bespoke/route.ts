import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { BespokeDesign } from "@/models/BespokeDesign";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    
    // Admin Path: All requests
    if (user.role === "admin") {
      const designs = await BespokeDesign.find({})
        .populate("userId", "firstName lastName email")
        .sort({ createdAt: -1 });
      return NextResponse.json(designs);
    }

    // User Path: Own requests
    const designs = await BespokeDesign.find({ userId: user.userId }).sort({ createdAt: -1 });

    return NextResponse.json(designs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { designImage, description, material, gemstones, budget, timeline } = await request.json();

    if (!designImage || !description || !material || !budget) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();
    const newDesign = await BespokeDesign.create({
      userId: user.userId,
      designImage,
      description,
      material,
      gemstones,
      budget,
      timeline,
      status: "Pending Review",
    });

    return NextResponse.json(newDesign, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
