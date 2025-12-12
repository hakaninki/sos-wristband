import { Timestamp } from "firebase/firestore";

export type Role = "owner" | "admin" | "teacher";

export interface School {
    id: string;
    name: string;
    slug: string;
    address?: string;
    phone?: string;
    contactEmail?: string;

    // Visuals
    logoUrl?: string;
    coverImageUrl?: string;

    active: boolean;
    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
}

export interface Staff {
    id: string; // Firebase Auth UID
    uid: string; // Same as id, for convenience
    role: Role;

    schoolId?: string; // Required for admin/teacher, optional for owner

    name: string;
    email: string;
    phone?: string;

    // Teacher only
    classIds?: string[];

    active: boolean;
    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
}

export interface SchoolClass {
    id: string;
    schoolId: string;
    name: string;
    teacherId?: string; // Staff UID

    gradeLevel?: string;
    description?: string;

    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
}

export interface EmergencyContact {
    name: string;
    phone: string;
    relation: string;
}

export interface MedicalInfo {
    allergies?: string;
    bloodType?: string;
    chronicConditions?: string;
    medications?: string;
    otherInfo?: string;
}

export interface Student {
    id: string;

    schoolId: string;
    schoolName?: string; // Denormalized

    classId: string;
    className?: string; // Denormalized

    firstName: string;
    lastName: string;
    slug: string; // Public profile slug

    wristbandId?: string; // SOS wristband identifier
    wristbandStatus?: "none" | "needs_production" | "produced" | "shipped" | "active"; // Status of the physical wristband

    schoolNumber?: string; // Internal school ID for the student

    photoUrl?: string;

    emergencyContacts: EmergencyContact[];
    medical: MedicalInfo;

    notes?: string;

    createdAt: Date | Timestamp;
    updatedAt: Date | Timestamp;
}
