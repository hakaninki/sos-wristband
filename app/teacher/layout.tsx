"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/login");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/teacher/dashboard" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white shadow-md">
                                <GraduationCap className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                Teacher Portal
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                            <Link
                                href="/teacher/dashboard"
                                className={`transition-colors hover:text-foreground/80 ${pathname === '/teacher/dashboard' ? 'text-foreground' : 'text-foreground/60'}`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/teacher/students"
                                className={`transition-colors hover:text-foreground/80 ${pathname.startsWith('/teacher/students') ? 'text-foreground' : 'text-foreground/60'}`}
                            >
                                Students
                            </Link>
                        </nav>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50">
                            <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                                T
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">Teacher</span>
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
