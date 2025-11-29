import { db } from "./firebase";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { Class } from "./types";

const CLASSES_COLLECTION = "classes";

export async function listClassesForSchool(schoolId: string) {
    const q = query(
        collection(db, CLASSES_COLLECTION),
        where("schoolId", "==", schoolId),
        orderBy("name", "asc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Class));
}

export async function getClassById(classId: string) {
    const docRef = doc(db, CLASSES_COLLECTION, classId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Class;
    }
    return null;
}

export async function createClassForSchool(schoolId: string, data: { name: string; teacherId?: string }) {
    const docRef = await addDoc(collection(db, CLASSES_COLLECTION), {
        ...data,
        schoolId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    if (data.teacherId) {
        // Update teacher's classIds
        const teacherRef = doc(db, "staff", data.teacherId);
        await updateDoc(teacherRef, {
            classIds: arrayUnion(docRef.id),
            updatedAt: serverTimestamp(),
        });
    }

    return docRef.id;
}

export async function updateClass(classId: string, data: Partial<Class>) {
    const docRef = doc(db, CLASSES_COLLECTION, classId);

    // If teacher is changing, we need to update both old and new teachers
    if (data.teacherId !== undefined) {
        const oldClassSnap = await getDoc(docRef);
        if (oldClassSnap.exists()) {
            const oldData = oldClassSnap.data() as Class;
            const oldTeacherId = oldData.teacherId;

            // Only proceed if teacher actually changed
            if (oldTeacherId && oldTeacherId !== data.teacherId) {
                // Remove from old teacher
                const oldTeacherRef = doc(db, "staff", oldTeacherId);
                await updateDoc(oldTeacherRef, {
                    classIds: arrayRemove(classId),
                    updatedAt: serverTimestamp(),
                });
            }

            // Add to new teacher if one is selected
            if (data.teacherId) {
                const newTeacherRef = doc(db, "staff", data.teacherId);
                await updateDoc(newTeacherRef, {
                    classIds: arrayUnion(classId),
                    updatedAt: serverTimestamp(),
                });
            }
        }
    }

    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteClass(classId: string) {
    await deleteDoc(doc(db, CLASSES_COLLECTION, classId));
}
