import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "@/src/core/config/firebase";
import { Staff, Role } from "@/src/core/types/domain";

const COLLECTION_NAME = "staff";

export const StaffRepository = {
    async getBySchoolAndRole(schoolId: string, role: Role): Promise<Staff[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("schoolId", "==", schoolId),
            where("role", "==", role)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Staff));
    },

    async getAll(): Promise<Staff[]> {
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Staff));
    },

    async getAdmins(): Promise<Staff[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("role", "==", "admin")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Staff));
    },

    async getById(id: string): Promise<Staff | null> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() } as Staff;
    },

    async create(id: string, staff: Omit<Staff, "id" | "createdAt" | "updatedAt">): Promise<void> {
        // Staff ID must match Auth UID, so we use setDoc with a specific ID
        await setDoc(doc(db, COLLECTION_NAME, id), {
            ...staff,
            id,
            uid: id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    },

    async update(id: string, data: Partial<Staff>): Promise<void> {
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
