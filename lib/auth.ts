import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { Staff } from "./types";

export async function getStaffProfile(uid: string): Promise<Staff | null> {
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

export async function getCurrentSchoolId(uid: string): Promise<string | null> {
    const staff = await getStaffProfile(uid);
    return staff ? staff.schoolId : null;
}
