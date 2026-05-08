import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    if (!user) {
      // For security, don't reveal if user exists or not
      return NextResponse.json({ message: "If an account with that email exists, we have sent a reset link." });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Set expiry (1 hour)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 3600000),
      }
    });

    // In a real app, send email here. For local dev, we log it.
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    console.log("-----------------------------------------");
    console.log("PASSWORD RESET REQUEST");
    console.log(`Email: ${email}`);
    console.log(`Reset Link: ${resetUrl}`);
    console.log("-----------------------------------------");

    return NextResponse.json({ 
      message: "If an account with that email exists, we have sent a reset link." 
    });

  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
