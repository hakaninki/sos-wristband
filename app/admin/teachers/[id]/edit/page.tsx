"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateTeacherAssignments } from "@/lib/teachers";
import { listClassesForSchool } from "@/lib/classes";
import { getStaffProfile } from "@/lib/auth";
import { Class } from "@/lib/types";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

export default function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [availableClasses, setAvailableClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Safety check
        if (!id) return;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push("/admin/login");
                return;
            }

            try {
                // 1. Get Teacher Profile
                const teacherProfile = await getStaffProfile(id);
                if (!teacherProfile || teacherProfile.role !== "teacher") {
                    alert("Teacher not found");
                    router.push("/admin/teachers");
                    return;
                }

                if (teacherProfile.classIds) {
                    setSelectedClasses(teacherProfile.classIds);
                }

                // 2. Get Available Classes
                if (teacherProfile.schoolId) {
                    const classes = await listClassesForSchool(teacherProfile.schoolId);
                    setAvailableClasses(classes);
                }
            } catch (error) {
                console.error("Error fetching teacher:", error);
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [id, router]);

    const handleClassToggle = (classId: string) => {
        setSelectedClasses((prev) =>
            prev.includes(classId)
                ? prev.filter((id) => id !== classId)
                : [...prev, classId]
        );
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!id) {
            alert("Error: Missing teacher ID");
            return;
        }

        setSaving(true);
        try {
            await updateTeacherAssignments(id, selectedClasses);
            router.push("/admin/teachers");
        } catch (error) {
            console.error("Failed to update teacher:", error);
            alert("Failed to update teacher. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    if (!id) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <p className="text-gray-500">Error: No teacher ID provided</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/teachers">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Edit Teacher Assignments</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Class Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Assign Classes</Label>
                            <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
                                {availableClasses.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No classes available.</p>
                                ) : (
                                    availableClasses.map((c) => (
                                        <div key={c.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`class-${c.id}`}
                                                checked={selectedClasses.includes(c.id)}
                                                onCheckedChange={() => handleClassToggle(c.id)}
                                            />
                                            <Label
                                                htmlFor={`class-${c.id}`}
                                                className="text-sm font-normal cursor-pointer"
                                            >
                                                {c.name}
                                            </Label>
                                        </div>
                                    ))
                                )}
                            </div>
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
                                disabled={saving}
                            >
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
