import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';

// Routes that don't require authentication
const publicRoutes = [
  "/",
  "/login", 
  "/signup",
  "/forgot-password",
  "/verify-email",
  "/onboarding",
];

// Routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/data-clock-in",
  "/heatmap", 
  "/trends-forecast",
  "/ai-recommendations",
  "/notifications",
  "/settings",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname === route);

  // Get token from cookie (SSR compatible)
  const token = request.cookies.get("afyametrix_token")?.value;

  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Enhanced JWT validation with signature verification
    try {
      const JWT_SECRET = process.env.JWT_SECRET_KEY;
      
      if (JWT_SECRET) {
        // Full JWT signature verification
        jwt.verify(token, JWT_SECRET);
      } else {
        // Fallback to expiration check only when no secret is available
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp <= Date.now() / 1000;
        
        if (isExpired) {
          throw new Error('Token expired');
        }
      }
    } catch (error) {
      // Clear invalid/expired tokens and redirect
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("afyametrix_token");
      response.cookies.delete("afyametrix_user");
      return response;
    }
  }

  // Redirect authenticated users from auth pages
  if (isPublicRoute && token && pathname !== "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();

  // Security headers for production
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)"
  );

  return response;
}

// Configure which routes use the middleware
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)"
  ],
};
