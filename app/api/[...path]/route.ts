import { NextRequest, NextResponse } from "next/server";
import { API_BASE_URL, SESSION_COOKIE, USER_COOKIE } from "@/features/common/config";
import type { User } from "@/features/auth/domain/auth";

type RouteContext = { params: Promise<{ path: string[] }> };
const cookieSettings = (expires?: Date) => ({ httpOnly: false, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", expires });

function sessionUser(request: NextRequest): User | null {
  try {
    const encoded = request.cookies.get(USER_COOKIE)?.value;
    return encoded ? JSON.parse(decodeURIComponent(encoded)) as User : null;
  } catch { return null; }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  if (path.join("/") === "auth/session") return NextResponse.json({ user: sessionUser(request) });
  return forward(request, path);
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  if (path.join("/") === "auth/logout") {
    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE, "", cookieSettings(new Date(0)));
    response.cookies.set(USER_COOKIE, "", { ...cookieSettings(new Date(0)), httpOnly: false });
    return response;
  }
  return forward(request, path);
}

export async function PUT(request: NextRequest, context: RouteContext) { return forward(request, (await context.params).path); }
export async function DELETE(request: NextRequest, context: RouteContext) { return forward(request, (await context.params).path); }

async function forward(request: NextRequest, path: string[]) {
  const url = `${API_BASE_URL}/api/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer();

  let upstream: Response;
  try { upstream = await fetch(url, { method: request.method, headers, body, cache: "no-store" }); }
  catch { return NextResponse.json({ error: "No se pudo conectar con la API. Intenta de nuevo." }, { status: 503 }); }

  if (path.join("/") === "auth/login" && upstream.ok) {
    const payload = await upstream.json() as { token: string; user: User };
    const response = NextResponse.json({ user: payload.user }, { status: upstream.status });
    let expires: Date | undefined;
    try {
      const claims = JSON.parse(Buffer.from(payload.token.split(".")[1] ?? "", "base64url").toString("utf8")) as { exp?: number };
      if (claims.exp) expires = new Date(claims.exp * 1000);
    } catch { /* El backend verifica la firma en las peticiones protegidas. */ }
    response.cookies.set(SESSION_COOKIE, payload.token, cookieSettings(expires));
    response.cookies.set(USER_COOKIE, encodeURIComponent(JSON.stringify(payload.user)), { ...cookieSettings(expires), httpOnly: false });
    return response;
  }

  const responseBody = upstream.status === 204 ? null : await upstream.arrayBuffer();
  return new NextResponse(responseBody, { status: upstream.status, headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" } });
}
