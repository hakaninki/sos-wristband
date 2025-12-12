"use client";

import { useState, useEffect } from "react";
import { getAllStudents } from "@/lib/students";
import { getSchools } from "@/lib/schools"; // Make sure this exists or use useSchools hook
import { Student, School } from "@/lib/types"; // Import types
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function GlobalStudentListPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        try {
            const [studentsData, schoolsData] = await Promise.all([
                getAllStudents(),
                getSchools()
            ]);
            setStudents(studentsData);
            setSchools(schoolsData);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredStudents = students.filter(s => {
        const matchesSchool = selectedSchoolId === "all" || s.schoolId === selectedSchoolId;
        // @ts-ignore - wristbandStatus might not be on type yet
        const matchesStatus = statusFilter === "all" || s.wristbandStatus === statusFilter;
        return matchesSchool && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">All Students (Global)</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/3">
                        <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Schools" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Schools</SelectItem>
                                {schools.map(s => (
                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-1/3">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                <SelectItem value="none">No Wristband</SelectItem>
                                <SelectItem value="needs_production">Needs Production</SelectItem>
                                <SelectItem value="produced">Produced</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <div className="bg-white rounded-md border">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-700 font-medium border-b">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">School</th>
                                <th className="p-4">Class</th>
                                <th className="p-4">School #</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredStudents.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium">{student.firstName} {student.lastName}</td>
                                    <td className="p-4">{student.schoolName}</td>
                                    <td className="p-4">{student.className || student.class || "-"}</td>
                                    <td className="p-4">{(student as any).schoolNumber || "-"}</td>
                                    <td className="p-4">
                                        <StatusBadge status={(student as any).wristbandStatus} />
                                    </td>
                                </tr>
                            ))}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        No students found matching filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    if (!status || status === "none") return <Badge variant="outline">None</Badge>;

    // "needs_production" | "produced" | "shipped" | "active"
    switch (status) {
        case "needs_production": return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Production Queue</Badge>;
        case "produced": return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Produced</Badge>;
        case "shipped": return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Shipped</Badge>;
        case "active": return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
}
