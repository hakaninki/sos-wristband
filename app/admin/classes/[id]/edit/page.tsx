"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getClassById, updateClass, deleteClass } from "@/lib/classes";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentSchoolId } from "@/lib/auth";
import { useSchoolStaff } from "@/src/modules/staff/application/useStaff";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditClassPage() {
    const params = useParams<{ id: string }>();
    const classId = params?.id;
    const [name, setName] = useState("");
    const [teacherId, setTeacherId] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [schoolId, setSchoolId] = useState<string | null>(null);
    const router = useRouter();

    const { data: teachers, isLoading: teachersLoading } = useSchoolStaff(schoolId || "", "teacher");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                router.push("/admin/login");
                return;
            }

            const sid = await getCurrentSchoolId(user.uid);
            if (sid) {
                setSchoolId(sid);
            }

            if (!classId) return;

            try {
                const classData = await getClassById(classId);
                if (classData) {
                    setName(classData.name);
                    setTeacherId(classData.teacherId || "");
                } else {
                    alert("Class not found");
                    router.push("/admin/classes");
                }
            } catch (error) {
                console.error("Error fetching class:", error);
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [classId, router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!classId) return;

        setSaving(true);
        try {
            await updateClass(classId, {
                name,
                teacherId: teacherId || undefined
            });
            router.push("/admin/classes");
        } catch (error) {
            console.error("Failed to update class:", error);
            alert("Failed to update class. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!classId) return;

        if (window.confirm("Are you sure you want to delete this class?")) {
            setSaving(true);
            try {
                await deleteClass(classId);
                router.push("/admin/classes");
            } catch (error) {
                console.error("Failed to delete class:", error);
                alert("Failed to delete class.");
                setSaving(false);
            }
        }
    }

    if (loading || teachersLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/classes">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Edit Class</h1>
                </div>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={saving}
                >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Class
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Class Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Class Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="teacher">Assign Teacher</Label>
                            <Select value={teacherId} onValueChange={setTeacherId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a teacher" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                    {teachers?.map((teacher) => (
                                        <SelectItem key={teacher.id} value={teacher.id}>
                                            {teacher.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href="/admin/classes">
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
