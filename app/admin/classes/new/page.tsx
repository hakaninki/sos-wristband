"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClassForSchool } from "@/lib/classes";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentSchoolId } from "@/lib/auth";
import { useSchoolStaff } from "@/src/modules/staff/application/useStaff";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewClassPage() {
    const [name, setName] = useState("");
    const [teacherId, setTeacherId] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [schoolId, setSchoolId] = useState<string | null>(null);
    const router = useRouter();

    const { data: teachers, isLoading: teachersLoading } = useSchoolStaff(schoolId || "", "teacher");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const sid = await getCurrentSchoolId(user.uid);
                if (sid) {
                    setSchoolId(sid);
                } else {
                    router.push("/admin/classes");
                }
            } else {
                router.push("/admin/login");
            }
        });
        return () => unsubscribe();
    }, [router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!schoolId) return;
        if (!teacherId) {
            alert("Please select a teacher.");
            return;
        }

        setLoading(true);
        try {
            await createClassForSchool(schoolId, {
                name,
                teacherId
            });
            router.push("/admin/classes");
            router.refresh();
        } catch (error) {
            console.error("Failed to create class:", error);
            alert("Failed to create class. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/classes">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Create New Class</h1>
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
                                placeholder="e.g. 10-A, Grade 5, etc."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="teacher">Assign Teacher (Required)</Label>
                            <Select value={teacherId} onValueChange={setTeacherId} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a teacher" />
                                </SelectTrigger>
                                <SelectContent>
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
                                disabled={loading}
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Class
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
