import { NextRequest, NextResponse } from "next/server";

const roleRoutes: Record<string, string> = {
  "/dashboard/admin": "ADMIN",
  "/dashboard/provider": "PROVIDER",
  "/dashboard/customer": "CUSTOMER",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("userRole")?.value;

  const matchedRoute = Object.keys(roleRoutes).find((route) =>
    pathname.startsWith(route),
  );

  if (matchedRoute) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== roleRoutes[matchedRoute]) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
