// lib/students.ts
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
    Timestamp,
    orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

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
    firstName: string;
    lastName: string;
    schoolName: string;
    class: string;
    notes: string;
    photoUrl: string;
    medical: MedicalProfile;
    emergencyContacts: EmergencyContact[];
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

const STUDENTS_COLLECTION = "students";

// Helper to generate a random slug
function generateSlug() {
    return Math.random().toString(36).substring(2, 10);
}

export async function createStudent(data: Omit<Student, "id" | "slug" | "createdAt" | "updatedAt">) {
    const slug = generateSlug();
    const docRef = await addDoc(collection(db, STUDENTS_COLLECTION), {
        ...data,
        slug,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function getStudents() {
    const q = query(collection(db, STUDENTS_COLLECTION), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Student));
}

export async function getStudent(id: string) {
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

export async function updateStudent(id: string, data: Partial<Student>) {
    const docRef = doc(db, STUDENTS_COLLECTION, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteStudent(id: string, photoUrl?: string) {
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
