import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

// 1. Load Env Vars
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), ".env.local");
        console.log("Loading env from:", envPath);
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, "utf-8");
            console.log("File content length:", envConfig.length);
            envConfig.split("\n").forEach((line) => {
                const parts = line.split("=");
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    let value = parts.slice(1).join("=").trim();

                    // Remove surrounding quotes if present
                    if (value.startsWith('"') && value.endsWith('"')) {
                        value = value.slice(1, -1);
                    } else if (value.startsWith("'") && value.endsWith("'")) {
                        value = value.slice(1, -1);
                    }

                    if (key && value) {
                        process.env[key] = value;
                        console.log("Loaded key:", key);
                    }
                }
            });
            console.log("Loaded .env.local");
        } else {
            console.warn(".env.local not found");
        }
    } catch (e) {
        console.error("Error loading env:", e);
    }
}

loadEnv();

// 2. Init Firebase Admin
function initFirebaseAdmin() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    let serviceAccount: any = null;

    // 1. Try parsing the single JSON environment variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } catch (error) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
            throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is present but invalid JSON.");
        }
    }

    // 2. Fallback to individual environment variables
    if (!serviceAccount) {
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (projectId && clientEmail && privateKey) {
            serviceAccount = {
                projectId,
                clientEmail,
                privateKey: privateKey.replace(/\\n/g, "\n"),
            };
        }
    }

    if (!serviceAccount) {
        throw new Error("Missing Firebase Admin credentials. Set FIREBASE_SERVICE_ACCOUNT_KEY or (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).");
    }

    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

// 3. Create Owner
async function createOwner() {
    const email = "owner@test.com";
    const password = "password123";
    const name = "Test Owner";

    try {
        const app = initFirebaseAdmin();
        const auth = app.auth();
        const db = app.firestore();

        // Check if user exists
        try {
            const existingUser = await auth.getUserByEmail(email);
            console.log("User already exists:", existingUser.uid);

            // Ensure role is owner
            await db.collection("staff").doc(existingUser.uid).set({
                id: existingUser.uid,
                uid: existingUser.uid,
                role: "owner",
                name,
                email,
                active: true,
                updatedAt: new Date(),
            }, { merge: true });

            await auth.setCustomUserClaims(existingUser.uid, { role: "owner" });
            console.log("Updated existing user to Owner.");
            return;
        } catch (e) {
            // User doesn't exist, create
        }

        const userRecord = await auth.createUser({
            email,
            password,
            displayName: name,
        });

        await db.collection("staff").doc(userRecord.uid).set({
            id: userRecord.uid,
            uid: userRecord.uid,
            role: "owner",
            name,
            email,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        await auth.setCustomUserClaims(userRecord.uid, { role: "owner" });

        console.log("Created Owner User:");
        console.log("Email:", email);
        console.log("Password:", password);
    } catch (error) {
        console.error("Error creating owner:", error);
    }
}

createOwner();
