// app/admin/students/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StudentForm } from "@/components/admin/StudentForm";
import { getStudent, Student } from "@/lib/students";

export default function EditStudentPage() {
    const params = useParams();
    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStudent() {
            if (typeof params.id === "string") {
                const data = await getStudent(params.id);
                setStudent(data);
            }
            setLoading(false);
        }
        fetchStudent();
    }, [params.id]);

    if (loading) {
        return <div className="text-center py-8">Loading student data...</div>;
    }

    if (!student) {
        return <div className="text-center py-8 text-red-500">Student not found</div>;
    }

    return (
        <div className="py-8">
            <StudentForm initialData={student} isEditing />
        </div>
    );
}
