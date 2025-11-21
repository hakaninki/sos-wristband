// app/admin/students/page.tsx
// app/admin/students/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getStudents, deleteStudent, Student } from "@/lib/students";
import { Trash2, Edit, QrCode, ExternalLink, Plus, Search, Phone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedQrStudent, setSelectedQrStudent] = useState<Student | null>(null);
    const router = useRouter();

    const loadStudents = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getStudents();
            setStudents(data);
        } catch (error) {
            console.error("Failed to load students:", error);
            alert("Failed to load students. Check console for details.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStudents();
    }, [loadStudents]);

    async function handleDelete(id: string, photoUrl: string) {
        if (window.confirm("Are you sure you want to delete this student?")) {
            await deleteStudent(id, photoUrl);
            await loadStudents();
            router.refresh();
        }
    }

    const filteredStudents = students.filter((s) => {
        const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
        return (
            fullName.includes(searchTerm.toLowerCase()) ||
            s.class.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const getPublicUrl = (slug: string) => {
        if (typeof window !== "undefined") {
            return `${window.location.origin}/s/${slug}`;
        }
        return "";
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Students</h1>
                    <p className="text-muted-foreground mt-1">Manage student records and emergency profiles.</p>
                </div>
                <Link href="/admin/students/new">
                    <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-md rounded-full px-6 transition-all hover:shadow-lg">
                        <Plus className="mr-2 h-4 w-4" /> Add Student
                    </Button>
                </Link>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or class..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 max-w-md bg-white shadow-sm border-border/50 focus:ring-teal-500"
                />
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : (
                <>
                    {filteredStudents.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                            <p className="text-muted-foreground">No students found matching your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredStudents.map((student) => (
                                <Card key={student.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 group bg-white">
                                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                        <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-teal-50 shadow-inner">
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
                                            <p className="text-sm font-medium text-teal-600 bg-teal-50 px-3 py-1 rounded-full inline-block mt-1">
                                                {student.class}
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
                                    <CardFooter className="bg-gray-50/50 p-3 flex justify-between items-center border-t border-gray-100">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                                                    onClick={() => setSelectedQrStudent(student)}
                                                >
                                                    <QrCode className="h-4 w-4 mr-1" /> QR
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-md rounded-2xl">
                                                <DialogHeader>
                                                    <DialogTitle className="text-center text-xl">Student QR Code</DialogTitle>
                                                </DialogHeader>
                                                <div className="flex flex-col items-center justify-center p-6 space-y-6">
                                                    {selectedQrStudent && (
                                                        <>
                                                            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                                                                <QRCodeSVG
                                                                    value={getPublicUrl(selectedQrStudent.slug)}
                                                                    size={200}
                                                                    level="H"
                                                                    fgColor="#0F172A"
                                                                />
                                                            </div>
                                                            <div className="text-center space-y-1">
                                                                <p className="font-bold text-lg">
                                                                    {selectedQrStudent.firstName} {selectedQrStudent.lastName}
                                                                </p>
                                                                <p className="text-sm text-muted-foreground">
                                                                    Scan to view emergency profile
                                                                </p>
                                                            </div>
                                                            <Button
                                                                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl"
                                                                onClick={() => window.open(getPublicUrl(selectedQrStudent.slug), "_blank")}
                                                            >
                                                                <ExternalLink className="mr-2 h-4 w-4" /> Open Public Page
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <div className="flex gap-1">
                                            <Link href={`/admin/students/${student.id}/edit`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(student.id, student.photoUrl)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
