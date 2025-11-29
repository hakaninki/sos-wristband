// lib/staff.ts
import { db } from "./firebase";
import {
    doc,
    getDoc,
    setDoc,
    collection,
    query,
    where,
    getDocs,
    serverTimestamp,
    orderBy
} from "firebase/firestore";
import { Staff } from "./types";
import { User } from "firebase/auth";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";

// --- Secondary App for Admin Creation ---
// We use a secondary app instance to create users without logging out the current admin/owner.
const SECONDARY_APP_NAME = "secondaryApp";

function getSecondaryApp() {
    const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    const existingApps = getApps();
    const secondaryApp = existingApps.find(app => app.name === SECONDARY_APP_NAME);

    return secondaryApp || initializeApp(config, SECONDARY_APP_NAME);
}

export async function createSchoolAdmin(email: string, password: string, schoolId: string) {
    const secondaryApp = getSecondaryApp();
    const secondaryAuth = getAuth(secondaryApp);

    try {
        // 1. Create Auth User
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        const uid = userCredential.user.uid;

        // 2. Create Staff Record (using main app's db)
        const staffRef = doc(db, "staff", uid);
        const newStaff: Staff = {
            id: uid,
            schoolId: schoolId,
            role: "admin",
            name: "School Admin", // Default name
            email: email,
            active: true,
            createdAt: serverTimestamp() as any,
            updatedAt: serverTimestamp() as any,
        };
        await setDoc(staffRef, newStaff);

        // 3. Sign out the secondary user immediately so it doesn't interfere
        await signOut(secondaryAuth);

        return uid;
    } catch (error) {
        console.error("Error creating school admin:", error);
        throw error;
    }
}

export async function getStaffBySchool(schoolId: string) {
    const q = query(collection(db, "staff"), where("schoolId", "==", schoolId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Staff));
}

export async function getAllStaff() {
    const q = query(collection(db, "staff"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Staff));
}

export async function getStaffByUid(uid: string): Promise<Staff | null> {
    try {
        const docRef = doc(db, "staff", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Staff;
        }
        return null;
    } catch (error) {
        console.error("Error fetching staff profile:", error);
        return null;
    }
}

export async function getCurrentUserSchoolId(authUser: User): Promise<string | null> {
    if (!authUser) return null;
    const staff = await getStaffByUid(authUser.uid);
    if (!staff || !staff.schoolId) {
        // Owners might not have a schoolId, so this isn't always an error
        return null;
    }
    return staff.schoolId;
}
