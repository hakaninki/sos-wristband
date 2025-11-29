"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/src/shared/ui/button";
import { Card, CardContent } from "@/src/shared/ui/card";
import { useSchoolStaff } from "@/src/modules/staff/application/useStaff";
import { useSchool } from "@/src/modules/schools/application/useSchools";
import { ArrowLeft, Plus, Shield, Mail, Phone, User } from "lucide-react";
import { Badge } from "@/src/shared/ui/badge";

export default function SchoolAdminsPage() {
    const params = useParams();
    const schoolId = typeof params.id === "string" ? params.id : "";

    const { data: school, isLoading: schoolLoading } = useSchool(schoolId);
    const { data: admins, isLoading: adminsLoading } = useSchoolStaff(schoolId, "admin");

    if (schoolLoading || adminsLoading) return <div className="p-8 text-center">Loading...</div>;
    if (!school) return <div className="p-8 text-center text-red-500">School not found</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link href={`/owner/schools/${school.id}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">School Admins</h1>
                        <p className="text-muted-foreground text-sm">
                            Managing admins for <span className="font-semibold text-indigo-600">{school.name}</span>
                        </p>
                    </div>
                </div>
                <Link href={`/owner/schools/${school.id}/admins/new`}>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Admin
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4">
                {admins?.map((admin) => (
                    <Card key={admin.id} className="border-gray-200">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                                        {admin.active ? (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 text-[10px] px-1 py-0">Active</Badge>
                                        ) : (
                                            <Badge variant="destructive" className="text-[10px] px-1 py-0">Inactive</Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Mail className="h-3 w-3" />
                                            {admin.email}
                                        </div>
                                        {admin.phone && (
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {admin.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" disabled>Details</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {admins?.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                        <p className="text-muted-foreground">No admins found for this school.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
