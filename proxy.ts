import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, SESSION_COOKIE, USER_COOKIE } from "@/features/common/config";

function readClaims(token: string): { id?: string; role?: string; exp?: number } | null {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8")) as { id?: string; role?: string; exp?: number };
  } catch { return null; }
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const claims = token ? readClaims(token) : null;
  const notExpired = Boolean(claims?.id && claims.exp && claims.exp * 1000 > Date.now());
  const active = notExpired && token ? await verifySession(token) : false;
  const isAdminPage = path.startsWith("/admin");
  const isUserPage = path.startsWith("/mis-reservas");
  const isAuthPage = path === "/login" || path === "/registro";

  if (isAuthPage && active) return NextResponse.redirect(new URL("/", request.url));
  if ((isAdminPage || isUserPage) && !active) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", path);
    const response = NextResponse.redirect(login);
    clearSession(response);
    return response;
  }
  if (isAdminPage && claims?.role !== "admin") return NextResponse.redirect(new URL("/", request.url));

  const response = NextResponse.next();
  if (token && !active) clearSession(response);
  return response;
}

async function verifySession(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reservations/mias?page=1&limit=1`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch { return false; }
}

function clearSession(response: NextResponse) {
  const expired = { expires: new Date(0), path: "/", sameSite: "lax" as const, secure: process.env.NODE_ENV === "production" };
  response.cookies.set(SESSION_COOKIE, "", { ...expired, httpOnly: false });
  response.cookies.set(USER_COOKIE, "", { ...expired, httpOnly: false });
}

export const config = { matcher: ["/admin/:path*", "/mis-reservas/:path*", "/login", "/registro"] };
