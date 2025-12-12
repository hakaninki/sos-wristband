import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const session = request.cookies.get("__session");
    const role = request.cookies.get("role")?.value;
    const path = request.nextUrl.pathname;

    // If no session, redirect to login
    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Role-based protection

    // Owner routes
    if (path.startsWith("/owner")) {
        if (role !== "owner") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Admin routes
    if (path.startsWith("/admin")) {
        // Allow owner to access admin panel as well, as they are superusers
        if (role !== "admin" && role !== "owner") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Teacher routes
    if (path.startsWith("/teacher")) {
        if (role !== "teacher") {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match only protected routes.
         * Public routes (/, /login, /assets/*, etc.) will bypass this middleware entirely.
         */
        "/owner/:path*",
        "/admin/:path*",
        "/teacher/:path*",
    ],
};
