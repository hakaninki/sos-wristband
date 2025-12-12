"use client";

import { useState } from "react";
import { Card, CardContent } from "@/src/shared/ui/card";
import { Badge } from "@/src/shared/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAllStaff } from "@/src/modules/staff/application/useStaff";
import { useSchools } from "@/src/modules/schools/application/useSchools";
import { Shield, User, Loader2, Mail, School as SchoolIcon } from "lucide-react";

export default function StaffListPage() {
    const { data: staff, isLoading: staffLoading } = useAllStaff();
    const { data: schools, isLoading: schoolsLoading } = useSchools();
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>("all");

    const filteredStaff = staff?.filter(member => {
        if (selectedSchoolId === "all") return true;
        return member.schoolId === selectedSchoolId;
    }) || [];

    if (staffLoading || schoolsLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    const getSchoolName = (schoolId?: string) => {
        if (!schoolId) return "N/A (System Owner)";
        const school = schools?.find(s => s.id === schoolId);
        return school ? school.name : "Unknown School";
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">All Staff</h1>
                    <p className="text-muted-foreground mt-1">System-wide staff directory.</p>
                </div>
                <div className="w-full md:w-1/3">
                    <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by School" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Schools</SelectItem>
                            {schools?.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredStaff?.map((member) => (
                    <Card key={member.id} className="border-gray-200">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${member.role === 'owner' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'
                                    }`}>
                                    {member.role === 'owner' ? <Shield className="h-6 w-6" /> : <User className="h-6 w-6" />}
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900">{member.name || "No Name"}</h3>
                                        <Badge variant={member.role === 'owner' ? 'default' : 'secondary'} className="text-[10px] px-2">
                                            {member.role.toUpperCase()}
                                        </Badge>
                                        {member.active ? (
                                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 text-[10px] px-1 py-0">Active</Badge>
                                        ) : (
                                            <Badge variant="destructive" className="text-[10px] px-1 py-0">Inactive</Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Mail className="h-3 w-3" />
                                            {member.email}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <SchoolIcon className="h-3 w-3" />
                                            {getSchoolName(member.schoolId)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Joined: {member.createdAt ? new Date(member.createdAt instanceof Date ? member.createdAt : (member.createdAt as any).toDate()).toLocaleDateString() : "N/A"}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
