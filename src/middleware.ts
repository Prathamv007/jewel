import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_jewelry_vedika";
const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname, search } = request.nextUrl;


  // 2. Auth Page Protection (Prevent switching to login if already logged in)
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, secret);
        // If login page is visited with a direct intent (no callback), go to dashboard
        // If there is a search param for redirect, respect it (though usuallyhandled by login logic)
        if (payload.role === "admin") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.redirect(new URL("/account", request.url));
      } catch (e) {
        // Token invalid, allow login page
      }
    }
  }

  // 3. Admin Protection
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callback", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/account", request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 4. Protected Routes (Account, Checkout)
  if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      // Persist the destination so user returns after login
      loginUrl.searchParams.set("callback", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/checkout/:path*",
    "/login",
    "/register",
    "/bespoke/:path*"
  ],
};
