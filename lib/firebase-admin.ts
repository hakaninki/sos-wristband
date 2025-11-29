import "server-only";
import * as admin from "firebase-admin";

interface ServiceAccount {
    projectId: string;
    clientEmail: string;
    privateKey: string;
}

function formatPrivateKey(key: string) {
    return key.replace(/\\n/g, "\n");
}

export function initFirebaseAdmin() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    let serviceAccount: ServiceAccount | null = null;

    // 1. Try parsing the single JSON environment variable (Recommended)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } catch (error) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
            throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is present but invalid JSON.");
        }
    }

    // 2. Fallback to individual environment variables (Legacy)
    if (!serviceAccount) {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (projectId && clientEmail && privateKey) {
            serviceAccount = {
                projectId,
                clientEmail,
                privateKey: formatPrivateKey(privateKey),
            };
        }
    }

    // 3. Validate credentials
    if (!serviceAccount) {
        const missingVars = [];
        if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) missingVars.push("FIREBASE_SERVICE_ACCOUNT_KEY");
        if (!process.env.FIREBASE_PROJECT_ID) missingVars.push("FIREBASE_PROJECT_ID");
        if (!process.env.FIREBASE_CLIENT_EMAIL) missingVars.push("FIREBASE_CLIENT_EMAIL");
        if (!process.env.FIREBASE_PRIVATE_KEY) missingVars.push("FIREBASE_PRIVATE_KEY");

        console.error(`
[Firebase Admin] Missing credentials.
Please set FIREBASE_SERVICE_ACCOUNT_KEY (JSON string)
OR set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.
Missing: ${missingVars.join(", ")}
        `);
        throw new Error("Missing Firebase Admin credentials in environment variables.");
    }

    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export function getAdminDb() {
    return initFirebaseAdmin().firestore();
}

export function getAdminAuth() {
    return initFirebaseAdmin().auth();
}
