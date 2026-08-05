import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { logger } from "./lib/utils/logger";

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

  logger.log('🔒 MIDDLEWARE:', {
    pathname,
    isProtectedRoute,
    isPublicRoute,
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
  });

  if (isProtectedRoute) {
    if (!token) {
      logger.log('❌ MIDDLEWARE: No token, redirecting to login');
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // EDGE RUNTIME COMPATIBLE: Basic token structure check only
    try {
      logger.log('🔐 MIDDLEWARE: Using Edge-compatible token validation');
      
      // Verify token has 3 parts (header.payload.signature)
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      // Decode payload to check expiration (no crypto needed)
      const payload = JSON.parse(atob(parts[1]));
      const isExpired = payload.exp <= Date.now() / 1000;
      
      if (isExpired) {
        throw new Error('Token expired');
      }

      logger.log('✅ MIDDLEWARE: Token validation successful');
      // Token looks valid - let it through
      // Full validation will happen on API calls
    } catch (error) {
      logger.error('❌ MIDDLEWARE: Token validation failed:', error);
      // Clear invalid token and redirect
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("afyametrix_token");
      response.cookies.delete("afyametrix_user");
      return response;
    }
  }

  // Redirect authenticated users from auth pages
  if (isPublicRoute && token && pathname !== "/") {
    logger.log('🔄 MIDDLEWARE: Authenticated user on auth page, redirecting to dashboard');
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
  
  // TEMPORARY: Disable CSP to fix white dashboard
  // response.headers.set("Content-Security-Policy", "...");

  return response;
}

// Configure which routes use the middleware
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)"
  ],
};
