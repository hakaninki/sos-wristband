"use server";

import { getAdminAuth, getAdminDb } from "@/lib/firebase-admin";
import { Role } from "@/src/core/types/domain";

interface CreateStaffUserParams {
    email: string;
    password?: string; // Optional, can be auto-generated
    name: string;
    role: Role;
    schoolId?: string;
    phone?: string;
    classIds?: string[];
}

export async function createStaffUser(params: CreateStaffUserParams) {
    try {
        const auth = getAdminAuth();
        const db = getAdminDb();

        // 1. Create Auth User
        const userRecord = await auth.createUser({
            email: params.email,
            password: params.password || "tempPassword123!", // Default temp password if not provided
            displayName: params.name,
            phoneNumber: params.phone || undefined,
        });

        // 2. Create Firestore Document
        const staffData = {
            id: userRecord.uid,
            uid: userRecord.uid,
            role: params.role,
            schoolId: params.schoolId || null,
            name: params.name,
            email: params.email,
            phone: params.phone || null,
            classIds: params.classIds || [],
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await db.collection("staff").doc(userRecord.uid).set(staffData);

        // 3. Set Custom Claims (Optional but good for security rules)
        await auth.setCustomUserClaims(userRecord.uid, { role: params.role, schoolId: params.schoolId });

        return { success: true, uid: userRecord.uid };
    } catch (error: any) {
        console.error("Error creating staff user (FULL):", error);
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        return { success: false, error: error.message || "Unknown error occurred" };
    }
}
