"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { StudentForm } from "@/src/modules/students/ui/StudentForm";
import { getStudent, updateStudentForSchool, uploadStudentPhoto } from "@/lib/students";
import { Student, SchoolClass } from "@/src/core/types/domain";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentUserSchoolId } from "@/lib/staff";
import { getClassById } from "@/lib/classes";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function EditStudentPage() {
    const params = useParams();
    const router = useRouter();
    const [student, setStudent] = useState<Student | null>(null);
    const [classes, setClasses] = useState<SchoolClass[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [schoolId, setSchoolId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const sid = await getCurrentUserSchoolId(user);
                if (!sid) {
                    setError("No school assigned to your account.");
                    setLoading(false);
                    return;
                }
                setSchoolId(sid);

                // Fetch classes
                const q = query(collection(db, "classes"), where("schoolId", "==", sid));
                const snapshot = await getDocs(q);
                const classList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SchoolClass));
                setClasses(classList);

                if (typeof params.id === "string") {
                    const data = await getStudent(params.id);
                    if (data) {
                        // @ts-ignore - Ignoring timestamp vs Date mismatch for now
                        setStudent(data as Student);
                    } else {
                        setError("Student not found.");
                    }
                }
            } else {
                router.push("/admin/login");
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [params.id, router]);

    const handleSubmit = async (data: any, photo: File | null) => {
        if (!schoolId || !student) return;
        setIsSubmitting(true);
        try {
            let photoUrl = student.photoUrl;
            if (photo) {
                photoUrl = await uploadStudentPhoto(photo, student.id);
            }

            const selectedClass = classes.find(c => c.id === data.classId);

            await updateStudentForSchool(student.id, {
                ...data,
                className: selectedClass?.name || "",
                class: selectedClass?.name || "", // Legacy
                photoUrl,
            });
            router.push("/admin/students");
        } catch (error) {
            console.error("Failed to update student:", error);
            alert("Failed to update student.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    if (!student) return null;

    return (
        <div className="py-8">
            <h1 className="text-2xl font-bold mb-6">Edit Student</h1>
            <StudentForm
                initialData={student}
                classes={classes}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
