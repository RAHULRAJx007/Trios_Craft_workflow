import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// NOTE:
// This app uses client-side role/session checks (see RoleGuard/AuthGuard +
// getCurrentUserRole()).
// Middleware must NOT rely on Supabase cookie-name patterns, because the
// cookie naming differs across environments and can cause auth to appear
// "stuck".
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|signup|_next|api|favicon.ico).*)"],
};

