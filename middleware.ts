import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Protected account routes
  if (request.nextUrl.pathname.startsWith("/account")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }

  // Protected admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    if ((session.user as any).role !== "ADMIN" && (session.user as any).role !== "STAFF") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/checkout/:path*"],
};
