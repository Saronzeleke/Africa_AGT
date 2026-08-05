import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// For static export, we need to handle middleware differently
// This middleware will only run on client-side routing

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
  // For static export, we only handle basic routing
  // Authentication will be handled client-side
  
  const { pathname } = request.nextUrl;

  // Add security headers
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
