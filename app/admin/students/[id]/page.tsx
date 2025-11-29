"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStudent } from "@/lib/students";
import { getClassById } from "@/lib/classes";
import { getStaffByUid } from "@/lib/staff";
import { Student, SchoolClass } from "@/src/core/types/domain";
import { Staff } from "@/lib/types";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getCurrentUserSchoolId } from "@/lib/staff";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card";
import { Button } from "@/src/shared/ui/button";
import { ArrowLeft, Phone, Mail, Calendar, MapPin, AlertCircle, User, QrCode, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/src/shared/ui/badge";
import { QRCodeSVG } from "qrcode.react";

export default function StudentDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [student, setStudent] = useState<Student | null>(null);
    const [schoolClass, setSchoolClass] = useState<SchoolClass | null>(null);
    const [teacher, setTeacher] = useState<Staff | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const sid = await getCurrentUserSchoolId(user);
                if (!sid) {
                    setError("No school assigned to your account.");
                    setLoading(false);
                    return;
                }

                if (typeof params.id === "string") {
                    const data = await getStudent(params.id);
                    if (data) {
                        // Verify student belongs to the same school
                        if (data.schoolId !== sid) {
                            setError("Unauthorized access to this student.");
                            setStudent(null);
                        } else {
                            // @ts-ignore
                            setStudent(data as Student);

                            // Fetch Class and Teacher details
                            if (data.classId) {
                                try {
                                    const classData = await getClassById(data.classId);
                                    if (classData) {
                                        // @ts-ignore
                                        setSchoolClass(classData as SchoolClass);

                                        if (classData.teacherId) {
                                            const teacherData = await getStaffByUid(classData.teacherId);
                                            if (teacherData) {
                                                setTeacher(teacherData);
                                            }
                                        }
                                    }
                                } catch (err) {
                                    console.error("Error fetching class/teacher details:", err);
                                }
                            }
                        }
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

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
    if (!student) return null;

    const getPublicUrl = (slug?: string) => {
        if (typeof window !== "undefined" && slug) {
            return `${window.location.origin}/s/${slug}`;
        }
        return "";
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin/students">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Photo & Basic Info */}
                <Card className="md:col-span-1">
                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                        <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-indigo-50 shadow-md">
                            {student.photoUrl ? (
                                <Image
                                    src={student.photoUrl}
                                    alt={`${student.firstName} ${student.lastName}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <User className="h-12 w-12" />
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{student.firstName} {student.lastName}</h2>
                            {/* Raw ID removed as requested */}
                            <Badge className="mt-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-indigo-200">
                                {(student as any).className || "Unassigned Class"}
                            </Badge>
                        </div>

                        <div className="w-full pt-4 border-t border-gray-100 flex flex-col items-center gap-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                <QRCodeSVG
                                    value={getPublicUrl(student.slug)}
                                    size={120}
                                    level="M"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => window.open(getPublicUrl(student.slug), "_blank")}
                            >
                                <QrCode className="mr-2 h-4 w-4" /> View Public Page
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Details */}
                <div className="md:col-span-2 space-y-6">
                    {/* Assigned Teacher Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-indigo-500" />
                                Assigned Teacher
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {teacher ? (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">{teacher.name}</span>
                                        <Badge variant="outline">Teacher</Badge>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        {teacher.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <a href={`tel:${teacher.phone}`} className="hover:underline">{teacher.phone}</a>
                                            </div>
                                        )}
                                        {teacher.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <a href={`mailto:${teacher.email}`} className="hover:underline">{teacher.email}</a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground italic">No teacher assigned to this class yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-500" />
                                Emergency Contact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {student.emergencyContacts?.map((contact, index) => (
                                <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-100 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-gray-900">{contact.name}</span>
                                        <Badge variant="outline" className="bg-white">{contact.relation}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <Phone className="h-4 w-4 text-red-400" />
                                        <a href={`tel:${contact.phone}`} className="hover:underline">{contact.phone}</a>
                                    </div>
                                </div>
                            ))}
                            {(!student.emergencyContacts || student.emergencyContacts.length === 0) && (
                                <p className="text-muted-foreground italic">No emergency contacts listed.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-orange-500" />
                                Medical Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <span className="text-muted-foreground block mb-1 text-sm">Allergies</span>
                                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                                    {student.medical?.allergies || "None listed"}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1 text-sm">Chronic Conditions</span>
                                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                                    {student.medical?.chronicConditions || "None listed"}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1 text-sm">Medications</span>
                                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                                    {student.medical?.medications || "None listed"}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground block mb-1 text-sm">Other Info</span>
                                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                                    {student.medical?.otherInfo || "None listed"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
