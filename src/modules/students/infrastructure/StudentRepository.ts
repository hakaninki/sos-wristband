import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/core/config/firebase";
import { Student } from "@/src/core/types/domain";

const COLLECTION_NAME = "students";

export const StudentRepository = {
    async getByClass(classId: string): Promise<Student[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("classId", "==", classId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Student));
    },

    async getBySchool(schoolId: string): Promise<Student[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("schoolId", "==", schoolId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Student));
    },

    async getById(id: string): Promise<Student | null> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() } as Student;
    },

    async create(student: Omit<Student, "id" | "createdAt" | "updatedAt">): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...student,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    },

    async update(id: string, data: Partial<Student>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },

    async delete(id: string): Promise<void> {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    },

    async uploadPhoto(file: File, studentId: string): Promise<string> {
        const { ref, uploadBytes, getDownloadURL } = await import("firebase/storage");
        const { storage } = await import("@/src/core/config/firebase");

        const storageRef = ref(storage, `students/${studentId}/${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    }
};
