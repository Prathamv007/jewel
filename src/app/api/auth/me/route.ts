import { NextResponse } from "next/server";
import { getAuthUser, signToken, setAuthCookie } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
  try {
    const payload = await getAuthUser();
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Auto-heal the token if their role escalated in the DB since they logged in
    if (user.role === 'admin' && payload.role !== 'admin') {
       const newToken = await signToken({
         userId: user._id,
         email: user.email,
         role: user.role,
       });
       await setAuthCookie(newToken);
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

