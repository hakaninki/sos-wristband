import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/core/config/firebase";
import { School } from "@/src/core/types/domain";

const COLLECTION_NAME = "schools";

export const SchoolRepository = {
    async getAll(): Promise<School[]> {
        const q = query(collection(db, COLLECTION_NAME));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as School));
    },

    async getById(id: string): Promise<School | null> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() } as School;
    },

    async create(school: Omit<School, "id" | "createdAt" | "updatedAt">): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...school,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    },

    async update(id: string, data: Partial<School>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },

    async delete(id: string): Promise<void> {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    }
};
