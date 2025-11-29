import { auth } from "./firebase";
import { getStaffByUid } from "./staff";
import { redirect } from "next/navigation";

export async function isOwner(uid: string): Promise<boolean> {
    const staff = await getStaffByUid(uid);
    return staff?.role === "owner";
}

export async function requireOwnerRole(uid: string) {
    const isOwnerUser = await isOwner(uid);
    if (!isOwnerUser) {
        redirect("/403");
    }
}
