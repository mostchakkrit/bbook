import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/", "/bookings", "/liff-link"];
const publicOnlyRoutes = ["/login", "/register"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const hasToken = req.cookies.has("accessToken");

  if (protectedRoutes.includes(path) && !hasToken) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
