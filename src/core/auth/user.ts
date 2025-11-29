import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { Staff } from "../types/domain";

export function useCurrentUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return { user, loading };
}

export function useCurrentStaff() {
    const { user, loading: authLoading } = useCurrentUser();
    const [staff, setStaff] = useState<Staff | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            setStaff(null);
            setLoading(false);
            return;
        }

        async function fetchStaff() {
            try {
                const docRef = doc(db, "staff", user!.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setStaff({ id: docSnap.id, ...docSnap.data() } as Staff);
                } else {
                    setStaff(null);
                }
            } catch (err: any) {
                console.error("Error fetching staff profile:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchStaff();
    }, [user, authLoading]);

    return { staff, loading: loading || authLoading, error };
}
