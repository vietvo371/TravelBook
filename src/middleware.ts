import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't need authentication
  const isPublicRoute = 
    pathname === "/" || 
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/tours") ||
    pathname.startsWith("/api/tours") ||
    (pathname.startsWith("/api/blogs") && request.method === "GET") ||
    pathname.startsWith("/blog");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if token exists and is valid
  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    // Clear invalid token cookie
    const response = pathname.startsWith("/api/") 
      ? NextResponse.json({ error: "Invalid token" }, { status: 401 })
      : NextResponse.redirect(new URL("/", request.url));
    
    response.cookies.set('token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    return response;
  }

  // Role-based access control for TravelBook
  const userRole = payload.vai_tro;

  // Admin (admin) - Full admin access
  if (pathname.startsWith("/admin")) {
    if (userRole !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // API routes access control
  if (pathname.startsWith("/api/")) {
    // Tours API - public GET, admin POST/PUT/DELETE
    if (pathname.startsWith("/api/tours")) {
      if (request.method === "GET") {
        return NextResponse.next(); // Public read access
      }
      // POST/PUT/DELETE require admin
      if (userRole !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 });
      }
      return NextResponse.next();
    }
    
    // Blogs API - public GET, admin POST/PUT/DELETE
    if (pathname.startsWith("/api/blogs")) {
      if (request.method === "GET") {
        return NextResponse.next(); // Public read access
      }
      // POST/PUT/DELETE require admin
      if (userRole !== "admin") {
        return NextResponse.json({ error: "Admin access required" }, { status: 403 });
      }
      return NextResponse.next();
    }
    
    // Bookings API - public POST, authenticated GET
    if (pathname.startsWith("/api/bookings")) {
      if (request.method === "POST") {
        return NextResponse.next(); // Public booking
      }
      // GET requires authentication (handled above)
      return NextResponse.next();
    }
    
    // Admin-only APIs
    if (pathname.startsWith("/api/admin") && userRole !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/tours/:path*",
  ],
};

