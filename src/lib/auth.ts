import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import prisma from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_jewelry_vedika";

if (!JWT_SECRET) {
  throw new Error("CRITICAL: JWT_SECRET environment variable is missing.");
}

const secret = new TextEncoder().encode(JWT_SECRET);

export interface CustomJwtPayload {
  userId: string;
  role: string;
  email?: string;
  [key: string]: any;
}

export async function signToken(payload: CustomJwtPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<CustomJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as CustomJwtPayload;
  } catch (error) {
    return null;
  }
}

export async function getAuthUser(): Promise<CustomJwtPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  return verifyToken(token);
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
}

/** 
 * Centralized, authoritative Admin check. 
 * Checks both JWT (fast) and Database (authoritative fallback).
 */
export async function isAdminUser(): Promise<boolean> {
  const payload = await getAuthUser();
  if (!payload?.userId) return false;

  // Faster path: JWT already says admin
  if (payload.role === "admin") return true;

  // Authoritative path: JWT might be stale, check DB
  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { role: true }
    });
    return user?.role === "admin";
  } catch (err) {
    console.error("Admin check failed:", err);
    return false;
  }
}
