"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

import { useCurrentStaff } from "@/src/core/auth/user";
import { useCreateStaff } from "@/src/modules/staff/application/useStaff";

export default function NewTeacherPage() {
    const router = useRouter();
    const { staff, loading: staffLoading } = useCurrentStaff();
    const { mutateAsync: createStaff, isPending: isCreating } = useCreateStaff();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    if (staffLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!staff || staff.role !== "admin") {
        return <div className="p-8 text-center">Unauthorized</div>;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (formData.password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        try {
            await createStaff({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: "teacher",
                schoolId: staff!.schoolId!,
                classIds: [], // Initialize with empty classes
            });

            router.push("/admin/teachers");
        } catch (error: any) {
            console.error("Failed to create teacher:", error);
            alert(`Failed to create teacher: ${error.message || error}`);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/teachers">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Create New Teacher</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Teacher Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="teacher@school.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                minLength={6}
                                placeholder="******"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href="/admin/teachers">
                                <Button variant="outline" type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-teal-500 to-blue-500 text-white"
                                disabled={isCreating}
                            >
                                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Teacher
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
