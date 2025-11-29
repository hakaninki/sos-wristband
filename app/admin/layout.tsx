// app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogOut } from "lucide-react";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user && pathname !== "/admin/login") {
                router.push("/admin/login");
            } else if (user && pathname === "/admin/login") {
                router.push("/admin/students");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router, pathname]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white shadow-md">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600">
                            SOS System
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/admin/classes"
                            className={`text-sm font-medium transition-colors hover:text-teal-600 ${pathname.startsWith("/admin/classes") ? "text-teal-600" : "text-muted-foreground"
                                }`}
                        >
                            Classes
                        </Link>
                        <Link
                            href="/admin/teachers"
                            className={`text-sm font-medium transition-colors hover:text-teal-600 ${pathname.startsWith("/admin/teachers") ? "text-teal-600" : "text-muted-foreground"
                                }`}
                        >
                            Teachers
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50">
                            <div className="h-6 w-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                                A
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Admin</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => signOut(auth)}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
