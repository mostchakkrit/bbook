import { NextRequest, NextResponse } from "next/server";
import { decodeJwt, isJwtExpired } from "@/lib/jwt";

const protectedRoutes = ["/", "/bookings", "/liff-link"];
const publicOnlyRoutes = ["/login", "/register"];

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function isProtected(path: string): boolean {
  return protectedRoutes.includes(path) || path.startsWith("/admin");
}

function isAdminRoute(path: string): boolean {
  return path === "/admin" || path.startsWith("/admin/");
}

async function refreshTokens(refreshToken: string) {
  const res = await fetch(`${process.env.API_URL}/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return {
    accessToken: data.accessToken as string,
    refreshToken: data.refreshToken as string,
  };
}

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (!isProtected(path)) {
    return NextResponse.next();
  }

  let accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken || isJwtExpired(accessToken)) {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    const refreshed = refreshToken ? await refreshTokens(refreshToken) : null;

    if (!refreshed) {
      const response = NextResponse.redirect(new URL("/login", req.nextUrl));
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }

    // Forward the new token to this request's render so it isn't treated as logged out.
    req.cookies.set("accessToken", refreshed.accessToken);
    req.cookies.set("refreshToken", refreshed.refreshToken);
    accessToken = refreshed.accessToken;

    if (isAdminRoute(path) && decodeJwt(accessToken)?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    const response = NextResponse.next({ request: { headers: req.headers } });
    response.cookies.set("accessToken", refreshed.accessToken, authCookieOptions);
    response.cookies.set("refreshToken", refreshed.refreshToken, authCookieOptions);
    return response;
  }

  if (isAdminRoute(path) && decodeJwt(accessToken)?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
