import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(
    "sb-vrhpumhbthgntyduinyq-auth-token"
  );

  const isAuthPage =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/signup";

  if (!token && !isAuthPage) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/projects/:path*",
    "/timer/:path*",
    "/earnings/:path*",
    "/team/:path*",
  ],
};