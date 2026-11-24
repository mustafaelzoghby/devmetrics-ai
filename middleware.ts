import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
  const { pathname } = request.nextUrl

  // Protect main app routes
  const protectedPaths = ["/overview", "/analytics", "/ai-tools", "/projects", "/teams", "/notifications", "/settings", "/admin"]
  const isProtected = protectedPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Admin-only routes
  if (pathname.startsWith("/admin")) {
    const role = token?.role as string
    if (!["SUPER_ADMIN", "ADMIN"].includes(role)) {
      return NextResponse.redirect(new URL("/overview", request.url))
    }
  }

  // Redirect logged-in users away from auth pages
  if (pathname.startsWith("/login") && token) {
    return NextResponse.redirect(new URL("/overview", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/overview/:path*",
    "/analytics/:path*",
    "/ai-tools/:path*",
    "/projects/:path*",
    "/teams/:path*",
    "/notifications/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/login",
  ],
}
