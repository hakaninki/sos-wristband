import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, serverTimestamp, documentId, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/src/core/config/firebase";
import { SchoolClass } from "@/src/core/types/domain";

const COLLECTION_NAME = "classes";

export const ClassRepository = {
    async getBySchool(schoolId: string): Promise<SchoolClass[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("schoolId", "==", schoolId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as SchoolClass));
    },

    async getByTeacher(teacherId: string): Promise<SchoolClass[]> {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("teacherId", "==", teacherId)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as SchoolClass));
    },

    async getByIds(ids: string[]): Promise<SchoolClass[]> {
        if (!ids || ids.length === 0) return [];
        // Firestore 'in' query is limited to 10 (or 30). For safety, if > 10, we might need to batch or fetch all and filter.
        // For this use case, a teacher likely has < 10 classes.
        // But to be safe, let's use documentId() in ids.

        const q = query(
            collection(db, COLLECTION_NAME),
            where(documentId(), "in", ids)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as SchoolClass));
    },

    async getById(id: string): Promise<SchoolClass | null> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() } as SchoolClass;
    },

    async create(schoolClass: Omit<SchoolClass, "id" | "createdAt" | "updatedAt">): Promise<string> {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...schoolClass,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        // Update teacher's classIds
        if (schoolClass.teacherId) {
            const teacherRef = doc(db, "staff", schoolClass.teacherId);
            await updateDoc(teacherRef, {
                classIds: arrayUnion(docRef.id),
                updatedAt: serverTimestamp(),
            });
        }

        return docRef.id;
    },

    async update(id: string, data: Partial<SchoolClass>): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);

        // If teacher is changing, we need to update both old and new teachers
        if (data.teacherId) {
            const oldClassSnap = await getDoc(docRef);
            if (oldClassSnap.exists()) {
                const oldData = oldClassSnap.data() as SchoolClass;
                const oldTeacherId = oldData.teacherId;

                // Only proceed if teacher actually changed
                if (oldTeacherId && oldTeacherId !== data.teacherId) {
                    // Remove from old teacher
                    const oldTeacherRef = doc(db, "staff", oldTeacherId);
                    await updateDoc(oldTeacherRef, {
                        classIds: arrayRemove(id),
                        updatedAt: serverTimestamp(),
                    });
                }

                // Add to new teacher
                const newTeacherRef = doc(db, "staff", data.teacherId);
                await updateDoc(newTeacherRef, {
                    classIds: arrayUnion(id),
                    updatedAt: serverTimestamp(),
                });
            }
        }

        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
    },

    async delete(id: string): Promise<void> {
        const docRef = doc(db, COLLECTION_NAME, id);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
            const data = snapshot.data() as SchoolClass;
            if (data.teacherId) {
                const teacherRef = doc(db, "staff", data.teacherId);
                await updateDoc(teacherRef, {
                    classIds: arrayRemove(id),
                    updatedAt: serverTimestamp(),
                });
            }
        }

        await deleteDoc(docRef);
    }
};
