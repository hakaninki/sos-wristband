// components/admin/StudentForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { createStudent, updateStudent, uploadStudentPhoto, Student, EmergencyContact } from "@/lib/students";
import { Plus, Trash2, Save, ArrowLeft, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentFormProps {
    initialData?: Student;
    isEditing?: boolean;
}

export function StudentForm({ initialData, isEditing = false }: StudentFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(initialData?.photoUrl || null);

    const [formData, setFormData] = useState({
        firstName: initialData?.firstName || "",
        lastName: initialData?.lastName || "",
        schoolName: initialData?.schoolName || "",
        class: initialData?.class || "",
        notes: initialData?.notes || "",
        medical: {
            bloodType: initialData?.medical?.bloodType || "",
            allergies: initialData?.medical?.allergies || "",
            chronicConditions: initialData?.medical?.chronicConditions || "",
            medications: initialData?.medical?.medications || "",
            otherInfo: initialData?.medical?.otherInfo || "",
        },
        emergencyContacts: initialData?.emergencyContacts || [] as EmergencyContact[],
    });

    const [newContact, setNewContact] = useState<EmergencyContact>({
        name: "",
        relation: "",
        phone: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("medical.")) {
            const field = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                medical: { ...prev.medical, [field]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const addContact = () => {
        if (!newContact.name || !newContact.phone) {
            alert("Please enter at least a name and phone number for the contact.");
            return;
        }
        setFormData((prev) => ({
            ...prev,
            emergencyContacts: [...prev.emergencyContacts, newContact],
        }));
        setNewContact({ name: "", relation: "", phone: "" });
    };

    const removeContact = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            emergencyContacts: prev.emergencyContacts.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let photoUrl = initialData?.photoUrl || "";

            if (isEditing && initialData) {
                if (photo) {
                    photoUrl = await uploadStudentPhoto(photo, initialData.id);
                }
                await updateStudent(initialData.id, { ...formData, photoUrl });
            } else {
                // Create
                const newStudentId = await createStudent({ ...formData, photoUrl: "" });
                if (photo) {
                    photoUrl = await uploadStudentPhoto(photo, newStudentId);
                    await updateStudent(newStudentId, { photoUrl });
                }
            }

            router.push("/admin/students");
            router.refresh();
        } catch (error) {
            console.error("Error saving student:", error);
            alert("Failed to save student. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing ? "Edit Student" : "Add New Student"}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {isEditing ? "Update student details and medical info." : "Create a new student profile."}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? "Saving..." : "Save Student"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Basic Info & Photo */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle>Profile Photo</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center">
                            <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-teal-50 shadow-inner mb-4 bg-gray-100">
                                {photoPreview ? (
                                    <Image
                                        src={photoPreview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                        <Upload className="h-10 w-10" />
                                    </div>
                                )}
                            </div>
                            <Label htmlFor="photo" className="cursor-pointer">
                                <div className="flex items-center gap-2 text-sm font-medium text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-2 rounded-full transition-colors">
                                    <Upload className="h-4 w-4" />
                                    {photoPreview ? "Change Photo" : "Upload Photo"}
                                </div>
                                <Input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </Label>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="schoolName">School Name</Label>
                                <Input
                                    id="schoolName"
                                    name="schoolName"
                                    value={formData.schoolName}
                                    onChange={handleChange}
                                    placeholder="Springfield Elementary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="class">Class / Grade</Label>
                                <Input
                                    id="class"
                                    name="class"
                                    value={formData.class}
                                    onChange={handleChange}
                                    required
                                    placeholder="Grade 5A"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">General Notes</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Any general notes about the student..."
                                    className="min-h-[100px]"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Medical & Contacts */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-l-4 border-l-red-500 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-red-700">Medical Profile</CardTitle>
                            <CardDescription>Critical medical information for emergencies.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="medical.bloodType">Blood Type</Label>
                                <select
                                    id="medical.bloodType"
                                    name="medical.bloodType"
                                    value={formData.medical.bloodType}
                                    onChange={handleChange as any}
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select Blood Type</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="medical.allergies">Allergies</Label>
                                    <Textarea
                                        id="medical.allergies"
                                        name="medical.allergies"
                                        value={formData.medical.allergies}
                                        onChange={handleChange}
                                        placeholder="Peanuts, Penicillin, etc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="medical.chronicConditions">Chronic Conditions</Label>
                                    <Textarea
                                        id="medical.chronicConditions"
                                        name="medical.chronicConditions"
                                        value={formData.medical.chronicConditions}
                                        onChange={handleChange}
                                        placeholder="Asthma, Diabetes, etc."
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="medical.medications">Current Medications</Label>
                                <Textarea
                                    id="medical.medications"
                                    name="medical.medications"
                                    value={formData.medical.medications}
                                    onChange={handleChange}
                                    placeholder="Inhaler, Insulin, etc."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="medical.otherInfo">Other Medical Info</Label>
                                <Textarea
                                    id="medical.otherInfo"
                                    name="medical.otherInfo"
                                    value={formData.medical.otherInfo}
                                    onChange={handleChange}
                                    placeholder="Any other critical medical details..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-blue-700">Emergency Contacts</CardTitle>
                            <CardDescription>People to contact in case of emergency.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Existing Contacts List */}
                            {formData.emergencyContacts.length > 0 ? (
                                <div className="space-y-3">
                                    {formData.emergencyContacts.map((contact, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg border border-blue-100"
                                        >
                                            <div>
                                                <p className="font-bold text-gray-900">{contact.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {contact.relation} • {contact.phone}
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeContact(index)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No emergency contacts added yet.</p>
                            )}

                            {/* Add New Contact Form */}
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-semibold mb-3 text-gray-700">Add New Contact</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Input
                                        placeholder="Name"
                                        value={newContact.name}
                                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Relation (e.g. Father)"
                                        value={newContact.relation}
                                        onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Phone Number"
                                        value={newContact.phone}
                                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={addContact}
                                    className="mt-3 w-full"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Add Contact
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </form>
    );
}
