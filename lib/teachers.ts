import { db } from "./firebase";
import {
    doc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs,
    serverTimestamp,
} from "firebase/firestore";
import { Staff } from "./types";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";

// Reusing the secondary app logic from staff.ts to create users without logging out
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

export async function createTeacherUser(data: {
    email: string;
    password: string;
    name: string;
    schoolId: string;
    classIds: string[];
}) {
    const secondaryApp = getSecondaryApp();
    const secondaryAuth = getAuth(secondaryApp);

    try {
        // 1. Create Auth User
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, data.email, data.password);
        const uid = userCredential.user.uid;

        // 2. Create Staff Record
        const staffRef = doc(db, "staff", uid);
        const newStaff: Staff = {
            id: uid,
            schoolId: data.schoolId,
            role: "teacher",
            name: data.name,
            email: data.email,
            active: true,
            classIds: data.classIds,
            createdAt: serverTimestamp() as any,
            updatedAt: serverTimestamp() as any,
        };
        await setDoc(staffRef, newStaff);

        // 3. Sign out secondary user
        await signOut(secondaryAuth);

        return uid;
    } catch (error) {
        console.error("Error creating teacher user:", error);
        throw error;
    }
}

export async function updateTeacherAssignments(uid: string, classIds: string[]) {
    const staffRef = doc(db, "staff", uid);
    await updateDoc(staffRef, {
        classIds: classIds,
        updatedAt: serverTimestamp(),
    });
}

export async function listTeachersForSchool(schoolId: string) {
    const q = query(
        collection(db, "staff"),
        where("schoolId", "==", schoolId),
        where("role", "==", "teacher")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Staff));
}
