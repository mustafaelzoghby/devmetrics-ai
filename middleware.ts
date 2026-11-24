import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Protect dashboard and admin routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/overview") || pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
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
  matcher: ["/dashboard/:path*", "/overview/:path*", "/admin/:path*", "/login"],
}
