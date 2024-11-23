import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};

export function middleware(request: NextRequest) {
  const role = request.cookies.get("role")?.value; // 'admin' or 'student'
  const isLoggedIn = request.cookies.get("isLoggedIn")?.value == "true"; 
  const pathname = request.nextUrl.pathname;

  console.log(role, request.cookies.get("isLoggedIn")?.value);
  const isRestrictedPath =
    pathname.startsWith("/admin") || pathname.startsWith("/student");

  // Block access to admin or student routes unless logged in
  if (!isLoggedIn && isRestrictedPath) {
    console.log(
      "Unauthenticated access to restricted area, redirecting to /login"
    );
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // "Student trying to access admin route, redirecting to /student/dashboard"
  if (role === "student" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/student/dashboard", request.url));
  }

  // "Admin trying to access student route, redirecting to /admin/dashboard"
  if (role === "admin" && pathname.startsWith("/student")) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}
