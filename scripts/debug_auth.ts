
import * as admin from "firebase-admin";
import * as fs from "fs";
import * as path from "path";

// Load env vars manually
const envPath = path.resolve(__dirname, "../.env.local");
console.log("Loading env from:", envPath);
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf8");
    console.log("Env file found, length:", envConfig.length);
    envConfig.split("\n").forEach((line) => {
        const parts = line.split("=");
        if (parts.length >= 2) {
            const key = parts[0].trim();
            let value = parts.slice(1).join("=").trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            } else if (value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1);
            }
            if (key && value) {
                process.env[key] = value;
            }
        }
    });
}

function initFirebaseAdmin() {
    if (admin.apps.length > 0) {
        return admin.app();
    }

    let serviceAccount: any = null;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
            let jsonStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
            if (jsonStr.startsWith("'") && jsonStr.endsWith("'")) {
                jsonStr = jsonStr.slice(1, -1);
            }
            serviceAccount = JSON.parse(jsonStr);
        } catch (error) {
            console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", error);
        }
    }

    if (!serviceAccount) {
        // Fallback
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
        throw new Error("Missing credentials");
    }

    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

async function debugAuth() {
    try {
        initFirebaseAdmin();
        const auth = admin.auth();

        console.log("Attempting to create user with short password...");
        try {
            await auth.createUser({
                email: "test_short_pass_debug@example.com",
                password: "123",
                displayName: "Test Short Pass",
            });
        } catch (e: any) {
            console.log("Short Password Error Code:", e.code);
            console.log("Short Password Error Message:", e.message);
        }

    } catch (error) {
        console.error("General Error:", error);
    }
}

debugAuth();
