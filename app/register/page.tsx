"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/src/core/config/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/ui/card";
import { Loader2 } from "lucide-react";
import { verifyInvite, markInviteUsed } from "@/lib/invites";

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState(""); // Will be fetched from token

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!token) throw new Error("Invalid or missing registration token.");

            // 1. Verify Token
            const invite = await verifyInvite(token);
            if (!invite) throw new Error("Invalid or expired invite token.");

            // 2. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 3. Update Profile
            await updateProfile(user, { displayName: name });

            // 4. Create Staff Record
            await setDoc(doc(db, "staff", user.uid), {
                id: user.uid,
                schoolId: invite.schoolId,
                role: "admin", // Invites are currently only for admins
                name: name,
                email: email,
                active: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // 5. Mark Invite as Used
            if (invite.id) {
                await markInviteUsed(invite.id);
            }

            // 6. Redirect
            router.push("/admin/classes");

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to register.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center text-red-500">
                Invalid access. Please use the link provided in your invitation email.
            </div>
        );
    }

    return (
        <form onSubmit={handleRegister} className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                    {error}
                </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="john@school.com"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                />
            </div>
            <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Registration
            </Button>
        </form>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Admin Registration</CardTitle>
                    <CardDescription className="text-center">
                        Create your school admin account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin" /></div>}>
                        <RegisterForm />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
