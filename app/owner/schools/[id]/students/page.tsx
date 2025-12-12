"use client";

import { useState, use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Correct import for App Router
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import { Badge } from "@/src/shared/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, Save, X, Search } from "lucide-react";

import { useSchoolClasses } from "@/src/modules/classes/application/useClasses"; // Need to ensure this hook exists or make one
import { useSchoolStudents } from "@/src/modules/students/application/useStudents";
import { updateStudentForSchool } from "@/lib/students"; // Direct update function
import { Student } from "@/src/core/types/domain";

// Helper for status colors/labels
const STATUS_CONFIG: Record<string, { label: string; color: string; badgeClass: string }> = {
    none: { label: "No Band", color: "gray", badgeClass: "bg-gray-100 text-gray-800 border-gray-200" },
    needs_production: { label: "Needs Production", color: "yellow", badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    produced: { label: "Produced", color: "blue", badgeClass: "bg-blue-100 text-blue-800 border-blue-200" },
    shipped: { label: "Shipped", color: "purple", badgeClass: "bg-purple-100 text-purple-800 border-purple-200" },
    active: { label: "Active", color: "green", badgeClass: "bg-green-100 text-green-800 border-green-200" },
};

export default function OwnerSchoolStudentsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: schoolId } = use(params);
    const router = useRouter();

    // Data Fetching
    const { data: classes, isLoading: classesLoading } = useSchoolClasses(schoolId);
    const { data: students, isLoading: studentsLoading, refetch } = useSchoolStudents(schoolId);

    // Filters
    const [classFilter, setClassFilter] = useState("all");
    const [wristbandFilter, setWristbandFilter] = useState("all"); // 'all', 'has_band', 'no_band'
    const [statusFilter, setStatusFilter] = useState("all"); // specific statuses
    const [searchTerm, setSearchTerm] = useState("");

    // Editing State (Map of studentId -> Partial<Student>)
    const [editingState, setEditingState] = useState<Record<string, { wristbandStatus: string; schoolNumber: string }>>({});
    const [saving, setSaving] = useState<string | null>(null);

    // Derived Filters
    const filteredStudents = useMemo(() => {
        if (!students) return [];
        return students.filter((s) => {
            // Search
            const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
            if (searchTerm && !fullName.includes(searchTerm.toLowerCase())) return false;

            // Class Filter
            if (classFilter !== "all" && s.classId !== classFilter) return false;

            // Wristband Existence Filter
            if (wristbandFilter === "has_band" && s.wristbandStatus === "none") return false;
            if (wristbandFilter === "no_band" && s.wristbandStatus !== "none") return false;

            // Status Filter
            if (statusFilter !== "all" && s.wristbandStatus !== statusFilter) return false;

            return true;
        });
    }, [students, searchTerm, classFilter, wristbandFilter, statusFilter]);

    // Handlers
    const startEditing = (student: Student) => {
        setEditingState((prev) => ({
            ...prev,
            [student.id]: {
                wristbandStatus: (student as any).wristbandStatus || "none",
                schoolNumber: (student as any).schoolNumber || "",
            },
        }));
    };

    const cancelEditing = (studentId: string) => {
        setEditingState((prev) => {
            const next = { ...prev };
            delete next[studentId];
            return next;
        });
    };

    const handleEditChange = (studentId: string, field: "wristbandStatus" | "schoolNumber", value: string) => {
        setEditingState((prev) => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                [field]: value,
            },
        }));
    };

    const saveChanges = async (studentId: string) => {
        const edits = editingState[studentId];
        if (!edits) return;

        setSaving(studentId);
        try {
            await updateStudentForSchool(studentId, {
                wristbandStatus: edits.wristbandStatus as any,
                schoolNumber: edits.schoolNumber,
            });
            // Refetch or optimistically update? Refetch is safer for now.
            await refetch();
            cancelEditing(studentId);
        } catch (error) {
            console.error("Failed to update student:", error);
            alert("Failed to update student. Check permissions.");
        } finally {
            setSaving(null);
        }
    };

    if (studentsLoading || classesLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6 container mx-auto py-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-fit">
                    <Link href={`/owner/schools/${schoolId}`}>
                        <Button variant="ghost" size="sm" className="pl-0 gap-1">
                            <ArrowLeft className="h-4 w-4" /> Back to School
                        </Button>
                    </Link>
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
                    <p className="text-muted-foreground">Manage wristbands and school IDs for all students.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card p-4 rounded-lg border shadow-sm space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
                <div className="w-full md:w-auto">
                    <label className="text-sm font-medium mb-1 block">Search</label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-full md:w-[200px]"
                        />
                    </div>
                </div>

                <div className="w-full md:w-auto">
                    <label className="text-sm font-medium mb-1 block">Class</label>
                    <Select value={classFilter} onValueChange={setClassFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="All Classes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Classes</SelectItem>
                            {classes?.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full md:w-auto">
                    <label className="text-sm font-medium mb-1 block">Wristband</label>
                    <Select value={wristbandFilter} onValueChange={setWristbandFilter}>
                        <SelectTrigger className="w-full md:w-[150px]">
                            <SelectValue placeholder="All" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="has_band">Has Wristband</SelectItem>
                            <SelectItem value="no_band">No Wristband</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full md:w-auto">
                    <label className="text-sm font-medium mb-1 block">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                    {config.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium">Student Name</th>
                                <th className="px-6 py-3 font-medium">Class</th>
                                <th className="px-6 py-3 font-medium">School Number</th>
                                <th className="px-6 py-3 font-medium">Wristband Status</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No students found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => {
                                    const isEditing = !!editingState[student.id];
                                    const edits = editingState[student.id];

                                    // Safely access properties that might be missing on legacy data
                                    const currentStatus = (student as any).wristbandStatus || "none";
                                    const currentNumber = (student as any).schoolNumber || "";
                                    const displayClass = (student as any).className || (classes?.find(c => c.id === student.classId)?.name) || "Unknown";

                                    return (
                                        <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {student.firstName} {student.lastName}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                <Badge variant="outline" className="font-normal text-xs">{displayClass}</Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isEditing ? (
                                                    <Input
                                                        value={edits.schoolNumber}
                                                        onChange={(e) => handleEditChange(student.id, "schoolNumber", e.target.value)}
                                                        className="h-8 w-32 font-mono text-xs"
                                                        placeholder="2024-001"
                                                    />
                                                ) : (
                                                    <span className="font-mono text-xs text-gray-600">{currentNumber || "—"}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {isEditing ? (
                                                    <Select
                                                        value={edits.wristbandStatus}
                                                        onValueChange={(val) => handleEditChange(student.id, "wristbandStatus", val)}
                                                    >
                                                        <SelectTrigger className="h-8 w-[160px] text-xs">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                                                <SelectItem key={key} value={key}>
                                                                    {config.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${STATUS_CONFIG[currentStatus]?.badgeClass || "bg-gray-100 border-gray-200"}`}>
                                                        {STATUS_CONFIG[currentStatus]?.label || currentStatus}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {isEditing ? (
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => cancelEditing(student.id)}
                                                            disabled={saving === student.id}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 text-white"
                                                            onClick={() => saveChanges(student.id)}
                                                            disabled={saving === student.id}
                                                        >
                                                            {saving === student.id ? (
                                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                            ) : (
                                                                <Save className="h-3 w-3" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                                        onClick={() => startEditing(student)}
                                                    >
                                                        Edit
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="text-xs text-muted-foreground text-center">
                Showing {filteredStudents.length} students
            </div>
        </div>
    );
}
