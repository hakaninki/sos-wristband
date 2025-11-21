// app/s/[slug]/page.tsx
import { Metadata } from "next";
import { getStudentBySlug } from "@/lib/students";
import { notFound } from "next/navigation";
import { Phone, AlertCircle, School, HeartPulse, User, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const student = await getStudentBySlug(slug);

    if (!student) {
        return {
            title: "Student Not Found",
        };
    }

    return {
        title: `Emergency Profile: ${student.firstName} ${student.lastName}`,
    };
}

export default async function PublicStudentPage({ params }: Props) {
    const { slug } = await params;
    const student = await getStudentBySlug(slug);

    if (!student) {
        notFound();
    }

    const hasMedicalInfo = student.medical && (
        student.medical.bloodType ||
        student.medical.allergies ||
        student.medical.chronicConditions ||
        student.medical.medications ||
        student.medical.otherInfo
    );

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex items-center justify-center font-sans">
            <div className="w-full max-w-md space-y-6">
                {/* Profile Header Card */}
                <Card className="overflow-hidden border-none shadow-xl rounded-3xl">
                    <div className="bg-gradient-to-r from-teal-500 to-blue-600 h-32 relative">
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white relative">
                                {student.photoUrl ? (
                                    <Image
                                        src={student.photoUrl}
                                        alt={`${student.firstName} ${student.lastName}`}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-4xl font-bold">
                                        {student.firstName?.[0]}{student.lastName?.[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <CardContent className="pt-20 pb-8 text-center space-y-2">
                        <h1 className="text-3xl font-bold text-slate-900">
                            {student.firstName} {student.lastName}
                        </h1>
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-sm px-3 py-1 bg-slate-100 text-slate-600">
                                {student.class}
                            </Badge>
                            {student.schoolName && (
                                <Badge variant="outline" className="text-sm px-3 py-1 border-slate-200 text-slate-500">
                                    <School className="w-3 h-3 mr-1" />
                                    {student.schoolName}
                                </Badge>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Medical Alert Card */}
                {hasMedicalInfo && (
                    <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                        <CardHeader className="bg-red-50 border-b border-red-100 pb-4">
                            <div className="flex items-center gap-2 text-red-600">
                                <HeartPulse className="h-6 w-6" />
                                <CardTitle className="text-lg font-bold uppercase tracking-wide">Medical Alert</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {student.medical?.bloodType && (
                                <div className="flex justify-between items-center p-3 bg-red-50/50 rounded-xl border border-red-100">
                                    <span className="font-medium text-red-800">Blood Type</span>
                                    <span className="font-bold text-red-600 text-lg">{student.medical.bloodType}</span>
                                </div>
                            )}

                            {student.medical?.allergies && (
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Allergies</span>
                                    <p className="text-slate-800 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        {student.medical.allergies}
                                    </p>
                                </div>
                            )}

                            {student.medical?.chronicConditions && (
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Conditions</span>
                                    <p className="text-slate-800 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        {student.medical.chronicConditions}
                                    </p>
                                </div>
                            )}

                            {student.medical?.medications && (
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Medications</span>
                                    <p className="text-slate-800 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        {student.medical.medications}
                                    </p>
                                </div>
                            )}
                            {student.medical?.otherInfo && (
                                <div className="space-y-1">
                                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Other Info</span>
                                    <p className="text-slate-800 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        {student.medical.otherInfo}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Emergency Contacts Card */}
                <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                    <CardHeader className="bg-blue-50 border-b border-blue-100 pb-4">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Phone className="h-6 w-6" />
                            <CardTitle className="text-lg font-bold uppercase tracking-wide">Emergency Contacts</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {student.emergencyContacts && student.emergencyContacts.length > 0 ? (
                            student.emergencyContacts.map((contact, index) => (
                                <div key={index} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">{contact.name}</h3>
                                            <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-700 hover:bg-blue-100">
                                                {contact.relation}
                                            </Badge>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <User className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <a href={`tel:${contact.phone}`} className="block">
                                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 text-lg font-semibold shadow-md hover:shadow-lg transition-all">
                                            <Phone className="mr-2 h-5 w-5" /> Call Now
                                        </Button>
                                    </a>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-slate-400">
                                <p>No emergency contacts listed.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* General Notes Card */}
                {student.notes && (
                    <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Info className="h-6 w-6" />
                                <CardTitle className="text-lg font-bold uppercase tracking-wide">Additional Notes</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-slate-700 leading-relaxed">
                                {student.notes}
                            </p>
                        </CardContent>
                    </Card>
                )}

                <div className="text-center text-slate-400 text-xs pb-8">
                    <p>Powered by SOS Wristband System</p>
                </div>
            </div>
        </div>
    );
}
