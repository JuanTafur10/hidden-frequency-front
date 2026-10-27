import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/features/common/config";

function readClaims(token: string): { id?: string; role?: string; exp?: number } | null {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8")) as { id?: string; role?: string; exp?: number };
  } catch { return null; }
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const claims = token ? readClaims(token) : null;
  const active = Boolean(claims?.id && claims.exp && claims.exp * 1000 > Date.now());
  const isAdminPage = path.startsWith("/admin");
  const isUserPage = path.startsWith("/mis-reservas");
  const isAuthPage = path === "/login" || path === "/registro";

  if (isAuthPage && active) return NextResponse.redirect(new URL("/", request.url));
  if ((isAdminPage || isUserPage) && !active) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", path);
    return NextResponse.redirect(login);
  }
  if (isAdminPage && claims?.role !== "admin") return NextResponse.redirect(new URL("/", request.url));

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/mis-reservas/:path*", "/login", "/registro"] };
