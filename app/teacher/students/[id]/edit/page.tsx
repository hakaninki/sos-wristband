"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getStudent, updateStudentForSchool, uploadStudentPhoto } from "@/lib/students";
import { getStaffProfile } from "@/lib/auth";
import { getClassById } from "@/lib/classes";
import { Class as SchoolClass } from "@/lib/types";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { QRCodeSVG } from "qrcode.react";
import { ArrowLeft, Loader2, Plus, Trash2, QrCode } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function EditStudentPage({ params }: { params: { id: string } }) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [schoolId, setSchoolId] = useState<string | null>(null);
    const [classes, setClasses] = useState<SchoolClass[]>([]);

    // Form State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [classId, setClassId] = useState("");
    const [notes, setNotes] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [currentPhotoUrl, setCurrentPhotoUrl] = useState("");
    const [slug, setSlug] = useState("");

    // Medical
    const [bloodType, setBloodType] = useState("");
    const [allergies, setAllergies] = useState("");
    const [chronicConditions, setChronicConditions] = useState("");
    const [medications, setMedications] = useState("");
    const [otherInfo, setOtherInfo] = useState("");

    // Emergency Contacts
    const [contacts, setContacts] = useState([{ name: "", relation: "", phone: "" }]);

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const profile = await getStaffProfile(user.uid);
                    if (profile && profile.schoolId) {
                        setSchoolId(profile.schoolId);

                        // Load assigned classes
                        if (profile.classIds && profile.classIds.length > 0) {
                            const classPromises = profile.classIds.map(id => getClassById(id));
                            const classDocs = await Promise.all(classPromises);
                            const validClasses = classDocs.filter((c): c is SchoolClass => c !== null);
                            setClasses(validClasses);

                            // Load student data
                            const student = await getStudent(params.id);
                            if (student) {
                                // Verify student belongs to one of the teacher's classes
                                if (!profile.classIds.includes(student.classId || "")) {
                                    alert("You are not authorized to edit this student.");
                                    router.push("/teacher/students");
                                    return;
                                }

                                setFirstName(student.firstName);
                                setLastName(student.lastName);
                                setClassId(student.classId || "");
                                setNotes(student.notes);
                                setCurrentPhotoUrl(student.photoUrl || "");
                                setSlug(student.slug || "");
                                setBloodType(student.medical.bloodType || "");
                                setAllergies(student.medical.allergies || "");
                                setChronicConditions(student.medical.chronicConditions || "");
                                setMedications(student.medical.medications || "");
                                setOtherInfo(student.medical.otherInfo || "");
                                setContacts(student.emergencyContacts || []);
                            } else {
                                alert("Student not found");
                                router.push("/teacher/students");
                            }
                        } else {
                            alert("You have no assigned classes.");
                            router.push("/teacher/dashboard");
                        }
                    }
                } catch (error) {
                    console.error("Error loading data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                router.push("/login");
            }
        });
        return () => unsubscribe();
    }, [router, params.id]);

    const addContact = () => {
        setContacts([...contacts, { name: "", relation: "", phone: "" }]);
    };

    const removeContact = (index: number) => {
        const newContacts = [...contacts];
        newContacts.splice(index, 1);
        setContacts(newContacts);
    };

    const updateContact = (index: number, field: string, value: string) => {
        const newContacts = [...contacts];
        // @ts-ignore
        newContacts[index][field] = value;
        setContacts(newContacts);
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!schoolId) return;

        setSaving(true);
        try {
            const selectedClass = classes.find(c => c.id === classId);

            let newPhotoUrl = currentPhotoUrl;
            if (photo) {
                newPhotoUrl = await uploadStudentPhoto(photo, params.id);
            }

            await updateStudentForSchool(params.id, {
                firstName,
                lastName,
                classId,
                className: selectedClass?.name || "",
                class: selectedClass?.name || "", // Legacy support
                schoolName: "Pending", // Placeholder
                notes,
                photoUrl: newPhotoUrl,
                medical: {
                    bloodType,
                    allergies,
                    chronicConditions,
                    medications,
                    otherInfo,
                },
                emergencyContacts: contacts,
            });
            router.push("/teacher/students");
        } catch (error) {
            console.error("Failed to update student:", error);
            alert("Failed to update student. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    const getPublicUrl = (slug?: string) => {
        if (typeof window !== "undefined" && slug) {
            return `${window.location.origin}/s/${slug}`;
        }
        return "";
    };

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <Link href="/teacher/students">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">Edit Student</h1>
            </div>

            {slug && (
                <Card className="bg-indigo-50 border-indigo-100">
                    <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                            <QRCodeSVG
                                value={getPublicUrl(slug)}
                                size={100}
                                level="M"
                            />
                        </div>
                        <div className="flex-1 space-y-2 text-center sm:text-left">
                            <h3 className="font-semibold text-indigo-900">Public Profile</h3>
                            <p className="text-sm text-indigo-700">
                                This QR code links to the student's public profile page.
                                Use this for wristbands or emergency access.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                                onClick={() => window.open(getPublicUrl(slug), "_blank")}
                            >
                                <QrCode className="mr-2 h-4 w-4" /> View Public Page
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="class">Class</Label>
                            <Select value={classId} onValueChange={setClassId} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="photo">Photo</Label>
                            <div className="flex items-center gap-4">
                                {currentPhotoUrl && (
                                    <div className="relative h-16 w-16 rounded-full overflow-hidden border">
                                        <Image
                                            src={currentPhotoUrl}
                                            alt="Current photo"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <Input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Additional notes..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Medical Profile */}
                <Card>
                    <CardHeader>
                        <CardTitle>Medical Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="bloodType">Blood Type</Label>
                                <Select value={bloodType} onValueChange={setBloodType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Blood Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"].map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="allergies">Allergies</Label>
                                <Input
                                    id="allergies"
                                    value={allergies}
                                    onChange={(e) => setAllergies(e.target.value)}
                                    placeholder="e.g. Peanuts, Penicillin"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                            <Input
                                id="chronicConditions"
                                value={chronicConditions}
                                onChange={(e) => setChronicConditions(e.target.value)}
                                placeholder="e.g. Asthma, Diabetes"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="medications">Medications</Label>
                            <Input
                                id="medications"
                                value={medications}
                                onChange={(e) => setMedications(e.target.value)}
                                placeholder="Current medications"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="otherInfo">Other Medical Info</Label>
                            <Textarea
                                id="otherInfo"
                                value={otherInfo}
                                onChange={(e) => setOtherInfo(e.target.value)}
                                placeholder="Any other relevant medical information..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Contacts */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Emergency Contacts</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={addContact}>
                            <Plus className="h-4 w-4 mr-2" /> Add Contact
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {contacts.map((contact, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg relative bg-gray-50/50">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        value={contact.name}
                                        onChange={(e) => updateContact(index, "name", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Relation</Label>
                                    <Input
                                        value={contact.relation}
                                        onChange={(e) => updateContact(index, "relation", e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input
                                        value={contact.phone}
                                        onChange={(e) => updateContact(index, "phone", e.target.value)}
                                        required
                                    />
                                </div>
                                {contacts.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => removeContact(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Link href="/teacher/students">
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white min-w-[150px]"
                        disabled={saving}
                    >
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
