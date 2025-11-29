
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as fs from "fs";
import * as path from "path";

// Load .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf8");
    envConfig.split("\n").forEach((line) => {
        const [key, value] = line.split("=");
        if (key && value) {
            process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, ""); // Remove quotes
        }
    });
}

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
} else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    };
} else {
    console.error("Missing Firebase credentials (FIREBASE_SERVICE_ACCOUNT_KEY or individual vars) in .env.local or environment");
    process.exit(1);
}

const app = initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore(app);

function generateSlug(firstName: string, lastName: string): string {
    const base = `${firstName}-${lastName}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const random = Math.random().toString(36).substring(2, 7);
    return `${base}-${random}`;
}

async function backfillSlugs() {
    console.log("Starting slug backfill...");
    const studentsRef = db.collection("students");
    const snapshot = await studentsRef.get();

    let updatedCount = 0;

    for (const doc of snapshot.docs) {
        const data = doc.data();
        if (!data.slug) {
            const slug = generateSlug(data.firstName || "student", data.lastName || "unknown");
            await doc.ref.update({ slug });
            console.log(`Updated student ${doc.id} with slug: ${slug}`);
            updatedCount++;
        }
    }

    console.log(`Backfill complete. Updated ${updatedCount} students.`);
}

backfillSlugs().catch(console.error);
