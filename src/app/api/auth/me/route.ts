import { NextResponse } from "next/server";
import { getAuthUser, signToken, setAuthCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const payload = await getAuthUser();
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Auto-heal the token if their role escalated in the DB since they logged in
    if (user.role === 'admin' && payload.role !== 'admin') {
       const newToken = await signToken({
         userId: user.id,
         email: user.email,
         role: user.role,
       });
       await setAuthCookie(newToken);
    }

    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
