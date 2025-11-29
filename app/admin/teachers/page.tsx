"use client";

import { useCurrentStaff } from "@/src/core/auth/user";
import { useSchoolStaff, useDeleteStaff } from "@/src/modules/staff/application/useStaff";
import { useSchoolClasses } from "@/src/modules/classes/application/useClasses";
import { Button } from "@/src/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/shared/ui/table";
import { Badge } from "@/src/shared/ui/badge";
import { Plus, Pencil, Trash2, Loader2, Mail, Phone, BookOpen } from "lucide-react";
import Link from "next/link";

export default function AdminTeachersPage() {
    const { staff, loading: staffLoading } = useCurrentStaff();
    const { data: teachers, isLoading: teachersLoading } = useSchoolStaff(staff?.schoolId || "", "teacher");
    const { data: classes, isLoading: classesLoading } = useSchoolClasses(staff?.schoolId || "");
    const { mutateAsync: deleteTeacher } = useDeleteStaff();

    if (staffLoading || teachersLoading || classesLoading) {
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
        if (confirm("Are you sure you want to delete this teacher? This action cannot be undone.")) {
            try {
                await deleteTeacher(id);
            } catch (error) {
                console.error("Failed to delete teacher:", error);
                alert("Failed to delete teacher");
            }
        }
    };

    const getAssignedClasses = (classIds?: string[]) => {
        if (!classIds || classIds.length === 0) return [];
        return classes?.filter(c => classIds.includes(c.id)) || [];
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
                    <p className="text-muted-foreground">Manage your school's teaching staff</p>
                </div>
                <Link href="/admin/teachers/new">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Teacher
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Teachers</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Assigned Classes</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teachers?.map((teacher) => {
                                const teacherClasses = getAssignedClasses(teacher.classIds);
                                return (
                                    <TableRow key={teacher.id}>
                                        <TableCell className="font-medium">{teacher.name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1 text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Mail className="h-3 w-3" /> {teacher.email}
                                                </div>
                                                {teacher.phone && (
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Phone className="h-3 w-3" /> {teacher.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {teacherClasses.length > 0 ? (
                                                    teacherClasses.map(c => (
                                                        <Badge key={c.id} variant="secondary" className="text-xs">
                                                            {c.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-muted-foreground text-sm italic">No classes assigned</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/teachers/${teacher.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(teacher.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {teachers?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No teachers found. Add one to get started.
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
