"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getStaffByUid } from "@/lib/staff";
import { Shield, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // 1. Firebase Auth Login
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Fetch Staff Role
            const staff = await getStaffByUid(user.uid);

            if (!staff) {
                throw new Error("Account misconfigured. Contact system administrator.");
            }

            // 3. Role-based Redirect
            // Set cookies for middleware
            // Note: In production, use a secure, server-minted session cookie with signed claims.
            const token = await user.getIdToken();
            document.cookie = `__session=${token}; path=/; max-age=3600; SameSite=Strict; Secure`;
            document.cookie = `role=${staff.role}; path=/; max-age=3600; SameSite=Strict; Secure`;

            switch (staff.role) {
                case "owner":
                    router.push("/owner");
                    break;
                case "admin":
                    router.push("/admin/students");
                    break;
                case "teacher":
                    router.push("/teacher/dashboard");
                    break;
                default:
                    throw new Error("Unknown role. Contact support.");
            }

        } catch (err: any) {
            console.error("Login error:", err);
            if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
                setError("Invalid email or password.");
            } else if (err.message) {
                setError(err.message);
            } else {
                setError("An error occurred. Please try again.");
            }
            setLoading(false); // Only stop loading on error, otherwise keep it while redirecting
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-zinc-100">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-teal-600 rounded-xl flex items-center justify-center">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-zinc-900 tracking-tight">
                        Sign in to SOS System
                    </h2>
                    <p className="mt-2 text-sm text-zinc-600">
                        Access your dashboard securely
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors"
                                    placeholder="you@school.edu"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-zinc-300 rounded-lg shadow-sm placeholder-zinc-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4 border border-red-100 animate-in fade-in slide-in-from-top-2">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
