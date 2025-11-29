"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/src/core/config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { Mail, Loader2 } from "lucide-react";

export default function OwnerSettingsPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (auth.currentUser) {
            setEmail(auth.currentUser.email || "");
        }
    }, []);

    const handleResetPassword = async () => {
        if (!email) return;

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            alert(`Password reset email sent to ${email}. Please check your inbox.`);
        } catch (error: any) {
            console.error("Error sending reset email:", error);
            alert("Failed to send reset email: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account settings.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Email Address</Label>
                        <Input value={email} disabled className="bg-gray-50" />
                        <p className="text-xs text-muted-foreground">
                            System owner email cannot be changed here.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Security</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            To change your password, we will send a reset link to your email address.
                        </p>
                        <Button
                            onClick={handleResetPassword}
                            disabled={loading || !email}
                            variant="outline"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                                </>
                            ) : (
                                <>
                                    <Mail className="mr-2 h-4 w-4" /> Send Password Reset Email
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
