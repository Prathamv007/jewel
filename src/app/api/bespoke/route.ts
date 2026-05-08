import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role === "admin") {
      const designs = await prisma.bespokeDesign.findMany({
        include: { user: { select: { firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json(designs);
    }

    const designs = await prisma.bespokeDesign.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' }
    });

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

    const newDesign = await prisma.bespokeDesign.create({
      data: {
        userId: user.userId,
        designImage,
        description,
        material,
        gemstones: gemstones || "None",
        budget,
        timeline: timeline || "Flexible",
        status: "Pending Review",
      }
    });

    return NextResponse.json(newDesign, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
