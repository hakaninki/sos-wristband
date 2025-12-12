"use client";

import { useState } from "react";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";
import { Textarea } from "@/src/shared/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/shared/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Student, SchoolClass } from "@/src/core/types/domain";

interface StudentFormProps {
    initialData?: Partial<Student>;
    classes: SchoolClass[];
    onSubmit: (data: any, photo: File | null) => Promise<void>;
    isSubmitting: boolean;
}

export function StudentForm({ initialData, classes, onSubmit, isSubmitting }: StudentFormProps) {
    const [firstName, setFirstName] = useState(initialData?.firstName || "");
    const [lastName, setLastName] = useState(initialData?.lastName || "");
    const [classId, setClassId] = useState(initialData?.classId || "");
    const [wristbandId, setWristbandId] = useState(initialData?.wristbandId || "");
    const [schoolNumber, setSchoolNumber] = useState(initialData?.schoolNumber || "");
    const [wristbandStatus, setWristbandStatus] = useState(initialData?.wristbandStatus || "none");
    const [notes, setNotes] = useState(initialData?.notes || "");
    const [photo, setPhoto] = useState<File | null>(null);
    const [currentPhotoUrl, setCurrentPhotoUrl] = useState(initialData?.photoUrl || "");

    // Medical
    const [bloodType, setBloodType] = useState(initialData?.medical?.bloodType || "");
    const [allergies, setAllergies] = useState(initialData?.medical?.allergies || "");
    const [chronicConditions, setChronicConditions] = useState(initialData?.medical?.chronicConditions || "");
    const [medications, setMedications] = useState(initialData?.medical?.medications || "");
    const [otherInfo, setOtherInfo] = useState(initialData?.medical?.otherInfo || "");

    // Emergency Contacts
    const [contacts, setContacts] = useState(initialData?.emergencyContacts || [{ name: "", relation: "", phone: "" }]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            firstName,
            lastName,
            classId,
            wristbandId,
            schoolNumber,
            wristbandStatus,
            notes,
            medical: {
                bloodType,
                allergies,
                chronicConditions,
                medications,
                otherInfo,
            },
            emergencyContacts: contacts,
        };
        onSubmit(data, photo);
    };

    return (
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
                        <Label htmlFor="wristbandId">Wristband ID (Optional)</Label>
                        <Input
                            id="wristbandId"
                            value={wristbandId}
                            onChange={(e) => setWristbandId(e.target.value)}
                            placeholder="Scan or enter ID"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="schoolNumber">School Number (Optional)</Label>
                            <Input
                                id="schoolNumber"
                                value={schoolNumber}
                                onChange={(e) => setSchoolNumber(e.target.value)}
                                placeholder="e.g. 2023-001"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="wristbandStatus">Wristband Status</Label>
                            <Select value={wristbandStatus} onValueChange={setWristbandStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                    <SelectItem value="needs_production">Needs Production</SelectItem>
                                    <SelectItem value="produced">Produced</SelectItem>
                                    <SelectItem value="shipped">Shipped</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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
                <Button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white min-w-[150px]"
                    disabled={isSubmitting}
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Student
                </Button>
            </div>
        </form>
    );
}
