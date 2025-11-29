"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card";
import { Badge } from "@/src/shared/ui/badge";
import { useSchool } from "@/src/modules/schools/application/useSchools";
import { useSchoolStaff } from "@/src/modules/staff/application/useStaff";
import { useSchoolStudents } from "@/src/modules/students/application/useStudents";
import { ArrowLeft, Users, ShieldCheck, Settings, Loader2 } from "lucide-react";

export default function SchoolDetailsPage() {
    const params = useParams();
    const schoolId = typeof params.id === "string" ? params.id : "";

    const { data: school, isLoading: schoolLoading } = useSchool(schoolId);
    const { data: admins, isLoading: adminsLoading } = useSchoolStaff(schoolId, "admin");
    const { data: students, isLoading: studentsLoading } = useSchoolStudents(schoolId);

    if (schoolLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!school) return <div className="p-8 text-center text-red-500">School not found</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/owner/schools">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{school.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="font-mono text-xs">{school.slug}</Badge>
                        {school.active ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Active</Badge>
                        ) : (
                            <Badge variant="destructive">Inactive</Badge>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{adminsLoading ? "..." : admins?.length || 0}</h3>
                        <p className="text-sm text-muted-foreground mb-4">School Admins</p>
                        <Link href={`/owner/schools/${school.id}/admins`} className="w-full">
                            <Button variant="outline" className="w-full">Manage Admins</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-teal-100 text-teal-600 mb-4">
                            <Users className="h-6 w-6" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{studentsLoading ? "..." : students?.length || 0}</h3>
                        <p className="text-sm text-muted-foreground mb-4">Total Students</p>
                        <Button variant="outline" className="w-full" disabled>View Students (Read Only)</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className="p-3 rounded-full bg-gray-100 text-gray-600 mb-4">
                            <Settings className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Settings</h3>
                        <p className="text-sm text-muted-foreground mb-4">Edit school details</p>
                        <Link href={`/owner/schools/${school.id}/edit`} className="w-full">
                            <Button variant="outline" className="w-full">Edit School</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>School Information</CardTitle>
                    <Link href={`/owner/schools/${school.id}/edit`}>
                        <Button variant="outline" size="sm">Edit Info</Button>
                    </Link>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="space-y-4">
                            <div>
                                <span className="text-muted-foreground block mb-1">Address</span>
                                <span className="font-medium">{school.address || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Phone</span>
                                <span className="font-medium">{school.phone || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Email</span>
                                <span className="font-medium">{school.contactEmail || "N/A"}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Status</span>
                                {school.active ? (
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Active</Badge>
                                ) : (
                                    <Badge variant="destructive">Inactive</Badge>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <span className="text-muted-foreground block mb-1">Logo URL</span>
                                {school.logoUrl ? (
                                    <a href={school.logoUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block max-w-xs">
                                        {school.logoUrl}
                                    </a>
                                ) : (
                                    <span className="text-muted-foreground italic">None</span>
                                )}
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">Cover Image URL</span>
                                {school.coverImageUrl ? (
                                    <a href={school.coverImageUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate block max-w-xs">
                                        {school.coverImageUrl}
                                    </a>
                                ) : (
                                    <span className="text-muted-foreground italic">None</span>
                                )}
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1">School ID</span>
                                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{school.id}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
