import { db, storage } from "./firebase";
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    serverTimestamp,
    orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { Student } from "./types";

const STUDENTS_COLLECTION = "students";

// Helper to generate a random slug
function generateSlug() {
    return Math.random().toString(36).substring(2, 10);
}

export async function createStudentForSchool(data: Omit<Student, "id" | "slug" | "createdAt" | "updatedAt" | "schoolId">, schoolId: string) {
    const slug = generateSlug();

    // Ensure classId and className are present if provided in data, otherwise they might be undefined
    // The type definition says they are optional on Student interface but required for creation logic if we want to enforce it.
    // For now, we pass them through from data.

    const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), {
        ...data,
        schoolId, // Ensure schoolId is set
        slug,
        wristbandStatus: data.wristbandStatus || "needs_production", // Default if not provided
        schoolNumber: data.schoolNumber || "", // Default if not provided
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function listStudentsForSchool(schoolId: string) {
    const q = query(
        collection(db, STUDENTS_COLLECTION),
        where("schoolId", "==", schoolId),
        orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Student));
}

export async function getStudent(id: string) {
    if (!id) {
        throw new Error("getStudent called without id");
    }
    const docRef = doc(db, STUDENTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Student;
    }
    return null;
}

export async function getStudentBySlug(slug: string) {
    const q = query(collection(db, STUDENTS_COLLECTION), where("slug", "==", slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Student;
    }
    return null;
}

export async function updateStudentForSchool(id: string, data: Partial<Student>) {
    const docRef = doc(db, STUDENTS_COLLECTION, id);
    // Prevent updating schoolId via this function for now to ensure safety
    const { schoolId, ...updateData } = data;

    await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteStudentForSchool(id: string, photoUrl?: string) {
    await deleteDoc(doc(db, STUDENTS_COLLECTION, id));
    if (photoUrl) {
        try {
            const photoRef = ref(storage, photoUrl);
            await deleteObject(photoRef);
        } catch (error) {
            console.error("Error deleting photo:", error);
        }
    }
}

export async function uploadStudentPhoto(file: File, studentId: string) {
    const storageRef = ref(storage, `students/${studentId}/profile.jpg`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}

export async function getAllStudents(filters?: { schoolId?: string; classId?: string; wristbandStatus?: string }) {
    let q = query(collection(db, STUDENTS_COLLECTION), orderBy("createdAt", "desc"));

    if (filters?.schoolId && filters.schoolId !== "all") {
        q = query(q, where("schoolId", "==", filters.schoolId));
    }

    // Note: Firestore requires composite indexes for multiple equality/range filters with orderBy.
    // If classId/wristbandStatus are used, we might need indexes. 

    if (filters?.classId && filters.schoolId && filters.classId !== "all") {
        q = query(q, where("classId", "==", filters.classId));
    }

    if (filters?.wristbandStatus && filters.wristbandStatus !== "all") {
        q = query(q, where("wristbandStatus", "==", filters.wristbandStatus));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
}
