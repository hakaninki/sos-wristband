import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const session = request.cookies.get("__session");
    const role = request.cookies.get("role")?.value;
    const path = request.nextUrl.pathname;

    // Public paths that don't require authentication
    const publicPaths = ["/", "/login", "/admin/login"];
    if (publicPaths.includes(path) || path.startsWith("/public") || path.startsWith("/s/")) {
        return NextResponse.next();
    }

    // If no session, redirect to login
    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Role-based protection
    if (path.startsWith("/owner")) {
        if (role !== "owner") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    if (path.startsWith("/admin")) {
        // Allow owner to access admin panel as well, as they are superusers
        if (role !== "admin" && role !== "owner") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    if (path.startsWith("/teacher")) {
        if (role !== "teacher") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Default redirect for root path based on role
    if (path === "/") {
        if (role === "owner") return NextResponse.redirect(new URL("/owner", request.url));
        if (role === "admin") return NextResponse.redirect(new URL("/admin/students", request.url));
        if (role === "teacher") return NextResponse.redirect(new URL("/teacher/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - next.svg, vercel.svg (public images)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|next.svg|vercel.svg).*)",
    ],
};
