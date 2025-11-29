"use client";

import { useCurrentStaff } from "@/src/core/auth/user";
import { useSchoolClasses, useDeleteClass } from "@/src/modules/classes/application/useClasses";
import { Button } from "@/src/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/shared/ui/table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminClassesPage() {
    const { staff, loading: staffLoading } = useCurrentStaff();
    const { data: classes, isLoading: classesLoading } = useSchoolClasses(staff?.schoolId || "");
    const { mutateAsync: deleteClass } = useDeleteClass();
    const router = useRouter();

    if (staffLoading || classesLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!staff || staff.role !== "admin") {
        return <div className="p-8 text-center">Unauthorized</div>;
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this class?")) {
            try {
                await deleteClass(id);
            } catch (error) {
                console.error("Failed to delete class:", error);
                alert("Failed to delete class");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
                    <p className="text-muted-foreground">Manage your school's classes</p>
                </div>
                <Link href="/admin/classes/new">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Class
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Classes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Grade Level</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {classes?.map((cls) => (
                                <TableRow key={cls.id}>
                                    <TableCell className="font-medium">{cls.name}</TableCell>
                                    <TableCell>{cls.gradeLevel || "-"}</TableCell>
                                    <TableCell>{cls.description || "-"}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/admin/classes/${cls.id}/edit`}>
                                                <Button variant="ghost" size="icon">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(cls.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {classes?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No classes found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
