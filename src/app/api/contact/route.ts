import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

// Simple Contact model (inline for speed, usually in models/Contact.ts)
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    const { name, email, subject, message } = body;
    
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    return NextResponse.json({ 
      success: true, 
      message: "Message received by the atelier.",
      id: contact._id 
    });
  } catch (err: any) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
