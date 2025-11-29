"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/shared/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { StudentForm } from "@/src/modules/students/ui/StudentForm";
import { useCurrentStaff } from "@/src/core/auth/user";
import { generateSlug } from "@/lib/utils";
import { useClassesByIds } from "@/src/modules/classes/application/useClasses";
import { useCreateStudent, useUploadStudentPhoto, useUpdateStudent } from "@/src/modules/students/application/useStudents";

export default function NewStudentPage() {
    const router = useRouter();
    const { staff, loading: staffLoading } = useCurrentStaff();

    // Fetch classes based on staff.classIds
    const { data: classes, isLoading: classesLoading } = useClassesByIds(staff?.classIds || []);

    const { mutateAsync: createStudent, isPending: isCreating } = useCreateStudent();
    const { mutateAsync: uploadPhoto, isPending: isUploading } = useUploadStudentPhoto();
    const { mutateAsync: updateStudent, isPending: isUpdating } = useUpdateStudent();

    if (staffLoading || classesLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!staff || staff.role !== "teacher") {
        return <div className="p-8 text-center">Unauthorized</div>;
    }

    const handleSubmit = async (data: any, photo: File | null) => {
        if (!staff.schoolId) {
            alert("Error: No school ID found for teacher.");
            return;
        }

        if (!photo) {
            alert("Please select a photo.");
            return;
        }

        try {
            const selectedClass = classes?.find(c => c.id === data.classId);

            // 1. Create student
            const studentData = {
                ...data,
                schoolId: staff.schoolId,
                className: selectedClass?.name || "", // Denormalized
                slug: generateSlug(data.firstName, data.lastName),
                photoUrl: "", // Placeholder
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const newStudentId = await createStudent(studentData);

            // 2. Upload photo
            const photoUrl = await uploadPhoto({ file: photo, studentId: newStudentId });

            // 3. Update student with photoUrl
            await updateStudent({ id: newStudentId, data: { photoUrl } });

            router.push("/teacher/students");
        } catch (error) {
            console.error("Failed to create student:", error);
            alert("Failed to create student. Please try again.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/teacher/students">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Add New Student</h1>
            </div>

            <StudentForm
                classes={classes || []}
                onSubmit={handleSubmit}
                isSubmitting={isCreating || isUploading || isUpdating}
            />
        </div>
    );
}
