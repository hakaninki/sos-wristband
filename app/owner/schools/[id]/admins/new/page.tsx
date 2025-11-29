"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card";
import { useCreateStaff } from "@/src/modules/staff/application/useStaff";
import { useSchool } from "@/src/modules/schools/application/useSchools";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewSchoolAdminPage() {
    const params = useParams();
    const router = useRouter();
    const schoolId = typeof params.id === "string" ? params.id : "";

    const { data: school, isLoading: schoolLoading } = useSchool(schoolId);
    const { mutateAsync: createStaff, isPending: isCreating } = useCreateStaff();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

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
                role: "admin",
                schoolId: schoolId,
                classIds: [],
            });
            router.push(`/owner/schools/${schoolId}/admins`);
        } catch (error: any) {
            console.error("Error creating admin:", error);
            alert(`Failed to create admin: ${error.message}`);
        }
    };

    if (schoolLoading) return <div className="p-8 text-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (!school) return <div className="p-8 text-center text-red-500">School not found</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href={`/owner/schools/${school.id}/admins`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add New Admin</h1>
                    <p className="text-muted-foreground text-sm">
                        For <span className="font-semibold text-indigo-600">{school.name}</span>
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Admin Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin@school.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                disabled={isCreating}
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" /> Create Admin Account
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
