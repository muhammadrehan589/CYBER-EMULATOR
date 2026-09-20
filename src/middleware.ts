import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/sysadmin") || path.startsWith("/api/sysadmin")) {
    if (path === "/sysadmin/login" || path === "/api/sysadmin/auth") {
      return NextResponse.next();
    }

    const sysadminToken = req.cookies.get("sysadmin_token");
    if (!sysadminToken) {
      if (path.startsWith("/api/sysadmin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/sysadmin/login", req.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/sysadmin/:path*", "/api/sysadmin/:path*", "/sysadmin"],
};
