import { db } from "./firebase";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    serverTimestamp,
    query,
    orderBy,
    where,
} from "firebase/firestore";
import { School } from "./types";

const SCHOOLS_COLLECTION = "schools";

export async function getSchools() {
    const q = query(collection(db, SCHOOLS_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as School));
}

export async function getSchool(id: string) {
    const docRef = doc(db, SCHOOLS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as School;
    }
    return null;
}

export async function createSchool(data: Pick<School, "name" | "slug" | "address" | "phone">) {
    const docRef = await addDoc(collection(db, SCHOOLS_COLLECTION), {
        ...data,
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function updateSchool(id: string, data: Partial<School>) {
    const docRef = doc(db, SCHOOLS_COLLECTION, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export async function getSchoolStats(schoolId: string) {
    // This is a rough count. For scalable apps, use aggregation queries or counters.
    const studentsQ = query(collection(db, "students"), where("schoolId", "==", schoolId));
    const staffQ = query(collection(db, "staff"), where("schoolId", "==", schoolId));

    const [studentsSnap, staffSnap] = await Promise.all([
        getDocs(studentsQ),
        getDocs(staffQ)
    ]);

    return {
        studentCount: studentsSnap.size,
        adminCount: staffSnap.size
    };
}
