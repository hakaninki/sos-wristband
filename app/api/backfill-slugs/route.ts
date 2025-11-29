
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { generateSlug } from "@/lib/utils";

export async function GET() {
    try {
        const db = getAdminDb();
        const studentsRef = db.collection("students");
        const snapshot = await studentsRef.get();

        let updatedCount = 0;
        const updates = [];

        for (const doc of snapshot.docs) {
            const data = doc.data();
            if (!data.slug) {
                const slug = generateSlug(data.firstName || "student", data.lastName || "unknown");
                updates.push(doc.ref.update({ slug }));
                updatedCount++;
            }
        }

        await Promise.all(updates);

        return NextResponse.json({
            success: true,
            message: `Backfill complete. Updated ${updatedCount} students.`
        });
    } catch (error: any) {
        console.error("Backfill failed:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
