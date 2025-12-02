import { getAdminDb } from "@/lib/firebase-admin";
import { Student } from "@/lib/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Phone, AlertCircle, Heart, Pill, FileText, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Force dynamic rendering since we're fetching data based on slug
export const dynamic = "force-dynamic";

interface PublicStudentProfile extends Omit<Student, "className"> {
    schoolName: string;
    teacherName: string;
    className: string;
}

async function getStudentBySlug(slug: string | undefined | null): Promise<PublicStudentProfile | null> {
    if (!slug) return null;

    try {
        const adminDb = getAdminDb();
        const snapshot = await adminDb
            .collection("students")
            .where("slug", "==", slug)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();
        const student = { id: doc.id, ...data } as Student;

        // Fetch related data in parallel
        const promises = [];

        // 1. Fetch School
        if (student.schoolId) {
            promises.push(
                adminDb.collection("schools").doc(student.schoolId).get()
                    .then(snap => snap.exists ? snap.data()?.name : null)
                    .catch(() => null)
            );
        } else {
            promises.push(Promise.resolve(null));
        }

        // 2. Fetch Class and Teacher
        if (student.classId) {
            promises.push(
                adminDb.collection("classes").doc(student.classId).get()
                    .then(async (classSnap) => {
                        if (!classSnap.exists) return { className: null, teacherName: null };
                        const classData = classSnap.data();
                        const className = classData?.name;

                        let teacherName = null;
                        if (classData?.teacherId) {
                            const teacherSnap = await adminDb.collection("staff").doc(classData.teacherId).get();
                            if (teacherSnap.exists) {
                                teacherName = teacherSnap.data()?.name;
                            }
                        }
                        return { className, teacherName };
                    })
                    .catch(() => ({ className: null, teacherName: null }))
            );
        } else {
            promises.push(Promise.resolve({ className: null, teacherName: null }));
        }

        const [schoolName, classInfo] = await Promise.all(promises);

        return {
            ...student,
            schoolName: schoolName || "Unknown School",
            className: (classInfo as any)?.className || student.className || "Unknown Class",
            teacherName: (classInfo as any)?.teacherName || "Unknown Teacher",
        } as PublicStudentProfile;

    } catch (error) {
        console.error("Error fetching student:", error);
        return null;
    }
}

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const student = await getStudentBySlug(slug);

    if (!student) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto space-y-6">
                {/* Header Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-gradient-to-r from-teal-500 to-blue-600 h-32 relative">
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                            <div className="relative h-32 w-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                                {student.photoUrl ? (
                                    <Image
                                        src={student.photoUrl}
                                        alt={`${student.firstName} ${student.lastName}`}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400 text-4xl font-bold">
                                        {student.firstName[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="pt-20 pb-8 px-6 text-center space-y-2">
                        <h1 className="text-3xl font-bold text-slate-900">
                            {student.firstName} {student.lastName}
                        </h1>

                        <div className="flex flex-col items-center gap-1 text-slate-600">
                            <p className="font-semibold text-lg text-teal-700">{student.schoolName}</p>
                            <p className="font-medium">{student.teacherName}</p>
                            <Badge variant="secondary" className="mt-1 bg-slate-100 text-slate-700 hover:bg-slate-200">
                                {student.className}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Emergency Contacts */}
                <Card className="border-l-4 border-l-red-500 shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-red-600 flex items-center gap-2 text-lg">
                            <Phone className="h-5 w-5" /> Emergency Contacts
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                        {student.emergencyContacts && student.emergencyContacts.length > 0 ? (
                            student.emergencyContacts.map((contact, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                                    <div>
                                        <p className="font-bold text-slate-900">{contact.name}</p>
                                        <p className="text-sm text-slate-500">{contact.relation}</p>
                                    </div>
                                    <a
                                        href={`tel:${contact.phone}`}
                                        className="flex items-center justify-center h-10 w-10 bg-white rounded-full text-red-600 shadow-sm border border-red-100 hover:bg-red-600 hover:text-white transition-colors"
                                    >
                                        <Phone className="h-5 w-5" />
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 italic">No emergency contacts listed.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Medical Info */}
                <Card className="shadow-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-slate-800 flex items-center gap-2 text-lg">
                            <ShieldAlert className="h-5 w-5 text-blue-500" /> Medical Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Blood Type</p>
                                <p className="text-lg font-bold text-slate-900">{student.medical.bloodType || "Unknown"}</p>
                            </div>
                            <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Allergies</p>
                                <p className="text-sm font-medium text-slate-900">{student.medical.allergies || "None"}</p>
                            </div>
                        </div>

                        {student.medical.chronicConditions && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-2 mb-2 text-slate-700 font-semibold">
                                    <Heart className="h-4 w-4 text-red-500" />
                                    <span>Chronic Conditions</span>
                                </div>
                                <p className="text-slate-600 text-sm">{student.medical.chronicConditions}</p>
                            </div>
                        )}

                        {student.medical.medications && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-2 mb-2 text-slate-700 font-semibold">
                                    <Pill className="h-4 w-4 text-purple-500" />
                                    <span>Medications</span>
                                </div>
                                <p className="text-slate-600 text-sm">{student.medical.medications}</p>
                            </div>
                        )}

                        {student.medical.otherInfo && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div className="flex items-center gap-2 mb-2 text-slate-700 font-semibold">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span>Other Information</span>
                                </div>
                                <p className="text-slate-600 text-sm">{student.medical.otherInfo}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center pt-8 pb-4">
                    <p className="text-xs text-slate-400">
                        Powered by SOS Wristband System
                    </p>
                </div>
            </div>
        </div>
    );
}
