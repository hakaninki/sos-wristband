import { Timestamp } from "firebase/firestore";

export interface School {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
    // Contact Info
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    // Address
    address?: string; // using 'address' to map to requirements 'schoolAddress'
    city?: string;
    country?: string;
    // Website
    website?: string;
    // Internal
    ownerNotes?: string;

    phone?: string; // Legacy/existing phone field
    active: boolean; // NEW: Soft delete / deactivation
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Class {
    id: string;
    schoolId: string;
    name: string;
    teacherId?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type StaffRole = "owner" | "admin" | "teacher";

export interface Staff {
    id: string; // Auth UID
    schoolId: string | null; // Null for owner
    role: StaffRole;
    name: string;
    email: string;
    phone?: string;
    active: boolean;
    classIds?: string[]; // For teachers
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface EmergencyContact {
    name: string;
    relation: string;
    phone: string;
}

export interface MedicalProfile {
    bloodType: string;
    allergies: string;
    chronicConditions: string;
    medications: string;
    otherInfo: string;
}

export interface Student {
    id: string;
    slug: string;
    schoolId: string; // NEW: link to schools.id
    classId?: string; // NEW: link to classes.id
    className?: string; // NEW: derived from class doc
    firstName: string;
    lastName: string;
    schoolName: string; // Display name, might differ from linked School entity in future or be redundant
    class: string; // Legacy field, keeping for now but should probably migrate to className/classId
    notes: string;
    photoUrl: string;
    medical: MedicalProfile;
    emergencyContacts: EmergencyContact[];
    createdAt?: Timestamp;
    updatedAt?: Timestamp;

    // Feature 5 New Fields
    schoolNumber?: string; // School-specific ID (e.g. "2023-001")
    wristbandStatus?: "none" | "needs_production" | "produced" | "shipped" | "active";
}
