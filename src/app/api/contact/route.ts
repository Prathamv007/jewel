import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { name, email, subject, message } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Message received by the atelier.",
      id: contact.id 
    });
  } catch (err: any) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
