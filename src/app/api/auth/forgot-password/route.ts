// import { NextResponse } from "next/server";
// import connectToDatabase from "@/lib/mongodb";
// import { User } from "@/models/User";
// import crypto from "crypto";

// export async function POST(req: Request) {
//   try {
//     const { email } = await req.json();
//     await connectToDatabase();

//     const user = await User.findOne({ email: email.toLowerCase() });

//     if (!user) {
//       // For security, don't reveal if user exists or not
//       return NextResponse.json({ message: "If an account with that email exists, we have sent a reset link." });
//     }

//     // Generate reset token
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

//     // Set expiry (1 hour)
//     user.resetPasswordToken = hashedToken;
//     user.resetPasswordExpires = Date.now() + 3600000;
//     await user.save();

//     // In a real app, send email here. For local dev, we log it.
//     const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
//     console.log("-----------------------------------------");
//     console.log("PASSWORD RESET REQUEST");
//     console.log(`Email: ${email}`);
//     console.log(`Reset Link: ${resetUrl}`);
//     console.log("-----------------------------------------");

//     return NextResponse.json({ 
//       message: "If an account with that email exists, we have sent a reset link." 
//     });

//   } catch (error: any) {
//     console.error("Forgot password error:", error);
//     return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
//   }
// }
