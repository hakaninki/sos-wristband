"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/shared/ui/button";
import { Card, CardContent, CardFooter } from "@/src/shared/ui/card";
import { Input } from "@/src/shared/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/shared/ui/select";
import { useCurrentStaff } from "@/src/core/auth/user";
import { useSchoolStudents, useDeleteStudent } from "@/src/modules/students/application/useStudents";
import { useClassesByIds } from "@/src/modules/classes/application/useClasses";
import { Trash2, Edit, Plus, Search, Phone, Loader2 } from "lucide-react";
import Image from "next/image";

export default function TeacherStudentsPage() {
    const { staff, loading: staffLoading } = useCurrentStaff();
    const { data: allStudents, isLoading: studentsLoading, error: studentsError } = useSchoolStudents(staff?.schoolId || "");

    // Fetch only the classes assigned to this teacher
    const classIds = staff?.classIds || [];
    const { data: myClassesData, isLoading: classesLoading } = useClassesByIds(classIds);
    const myClasses = myClassesData || [];

    const { mutateAsync: deleteStudent } = useDeleteStudent();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedClassId, setSelectedClassId] = useState<string>("all");

    const searchParams = useSearchParams();
    const initialClassId = searchParams.get("classId");

    useEffect(() => {
        if (initialClassId) {
            setSelectedClassId(initialClassId);
        }
    }, [initialClassId]);

    if (staffLoading || studentsLoading || (classesLoading && classIds.length > 0)) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    const myClassIds = myClasses.map(c => c.id);

    // Filter students:
    // 1. Must be in one of the teacher's classes
    // 2. Must match search term
    // 3. Must match selected class filter
    const filteredStudents = allStudents?.filter((s) => {
        const isInMyClasses = s.classId && myClassIds.includes(s.classId);
        if (!isInMyClasses) return false;

        const matchesSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesClass = selectedClassId === "all" || s.classId === selectedClassId;

        return matchesSearch && matchesClass;
    }) || [];

    async function handleDelete(id: string) {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await deleteStudent(id);
            } catch (error) {
                console.error("Failed to delete student:", error);
                alert("Failed to delete student.");
            }
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Students</h1>
                    <p className="text-muted-foreground mt-1">Manage students in your classes.</p>
                </div>
                <Link href="/teacher/students/new">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md rounded-full px-6 transition-all hover:shadow-lg">
                        <Plus className="mr-2 h-4 w-4" /> Add Student
                    </Button>
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white shadow-sm border-border/50 focus:ring-indigo-500"
                    />
                </div>
                <div className="w-full sm:w-48">
                    <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Filter by Class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            {myClasses.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {filteredStudents.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                    <p className="text-muted-foreground">No students found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredStudents.map((student) => (
                        <Card key={student.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 group bg-white">
                            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-indigo-50 shadow-inner">
                                    {student.photoUrl ? (
                                        <Image
                                            src={student.photoUrl}
                                            alt={`${student.firstName} ${student.lastName}`}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                                            <span className="text-2xl font-bold">
                                                {student.firstName?.[0]}
                                                {student.lastName?.[0]}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">
                                        {student.firstName} {student.lastName}
                                    </h3>
                                    <p className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full inline-block mt-1">
                                        {(student as any).className || (student as any).class || "Class"}
                                    </p>
                                </div>
                                <div className="w-full pt-2 border-t border-gray-100">
                                    <div className="flex items-center justify-center text-sm text-muted-foreground gap-2">
                                        <Phone className="h-3 w-3" />
                                        <span>
                                            {student.emergencyContacts?.[0]?.phone || "No contact"}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-gray-50/50 p-3 flex justify-end items-center border-t border-gray-100 gap-1">
                                <Link
                                    href={{
                                        pathname: `/teacher/students/${student.id}/edit`,
                                        query: { from: `/teacher/students?${searchParams.toString()}` }
                                    }}
                                >
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => handleDelete(student.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
