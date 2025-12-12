import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";

const INVITES_COLLECTION = "invites";

export interface Invite {
    id?: string;
    schoolId: string;
    email: string; // Optional: restrict invite to specific email
    token: string;
    status: "pending" | "used";
    createdAt: Timestamp;
    usedAt?: Timestamp;
}

export async function createInvite(schoolId: string, email: string = "") {
    // 1. Generate a random token
    const token = crypto.randomUUID();

    // 2. Create invite record
    const inviteData: Omit<Invite, "id"> = {
        schoolId,
        email,
        token,
        status: "pending",
        createdAt: serverTimestamp() as Timestamp,
    };

    const docRef = await addDoc(collection(db, INVITES_COLLECTION), inviteData);
    return { id: docRef.id, ...inviteData };
}

export async function verifyInvite(token: string): Promise<Invite | null> {
    const q = query(
        collection(db, INVITES_COLLECTION),
        where("token", "==", token),
        where("status", "==", "pending")
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Invite;
}

export async function markInviteUsed(inviteId: string) {
    const docRef = doc(db, INVITES_COLLECTION, inviteId);
    await updateDoc(docRef, {
        status: "used",
        usedAt: serverTimestamp(),
    });
}
