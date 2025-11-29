import { db, auth } from "./firebase";
import {
    collection,
    getDocs,
    doc,
    setDoc,
    updateDoc,
    query,
    where,
    serverTimestamp,
    getDoc,
} from "firebase/firestore";
import { School, Staff } from "./types";

const DEFAULT_SCHOOL_SLUG = "demo-school";
const DEFAULT_SCHOOL_NAME = "Demo School";

export async function runMigration(adminUid: string) {
    const logs: string[] = [];
    const log = (msg: string) => logs.push(msg);

    try {
        log("Starting migration...");

        // 1. Ensure Default School Exists
        const schoolsRef = collection(db, "schools");
        const qSchool = query(schoolsRef, where("slug", "==", DEFAULT_SCHOOL_SLUG));
        const schoolSnap = await getDocs(qSchool);

        let schoolId = "";

        if (schoolSnap.empty) {
            log("Creating default school...");
            const newSchoolRef = doc(schoolsRef);
            schoolId = newSchoolRef.id;
            const newSchool: School = {
                id: schoolId,
                name: DEFAULT_SCHOOL_NAME,
                slug: DEFAULT_SCHOOL_SLUG,
                active: true,
                createdAt: serverTimestamp() as any,
                updatedAt: serverTimestamp() as any,
            };
            await setDoc(newSchoolRef, newSchool);
            log(`Created school: ${DEFAULT_SCHOOL_NAME} (${schoolId})`);
        } else {
            schoolId = schoolSnap.docs[0].id;
            log(`Found existing school: ${DEFAULT_SCHOOL_NAME} (${schoolId})`);
        }

        // 2. Ensure Staff Record Exists for Admin
        const staffRef = doc(db, "staff", adminUid);
        const staffSnap = await getDoc(staffRef);

        if (!staffSnap.exists()) {
            log("Creating staff record for current user...");
            const newStaff: Staff = {
                id: adminUid,
                schoolId: schoolId,
                role: "admin",
                name: "Admin User", // Default
                email: "admin@example.com", // Placeholder, as we don't have email here easily without auth fetch
                active: true,
                createdAt: serverTimestamp() as any,
                updatedAt: serverTimestamp() as any,
            };
            await setDoc(staffRef, newStaff);
            log(`Created staff record for UID: ${adminUid}`);
        } else {
            log("Staff record already exists.");
        }

        // 3. Backfill Students
        log("Checking for students without schoolId...");
        const studentsRef = collection(db, "students");
        const allStudentsSnap = await getDocs(studentsRef);

        let updatedCount = 0;
        const updatePromises: Promise<void>[] = [];

        for (const docSnap of allStudentsSnap.docs) {
            const data = docSnap.data();
            if (!data.schoolId) {
                updatePromises.push(
                    updateDoc(docSnap.ref, { schoolId: schoolId })
                );
                updatedCount++;
            }
        }

        if (updatedCount > 0) {
            await Promise.all(updatePromises);
            log(`Updated ${updatedCount} students with schoolId: ${schoolId}`);
        } else {
            log("No students needed backfilling.");
        }

        log("Migration completed successfully.");
        return { success: true, logs };
    } catch (error: any) {
        console.error("Migration failed:", error);
        log(`Error: ${error.message}`);
        return { success: false, logs };
    }
}
