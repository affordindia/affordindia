import admin from "firebase-admin";

let app;

try {
    if (!admin.apps.length) {
        // Check if we have service account credentials in environment variables
        if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
            // Production: Use service account credentials from environment variables
            app = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                }),
                projectId: process.env.FIREBASE_PROJECT_ID
            });
        } else {
            // Development: Use Application Default Credentials or Firebase CLI
            app = admin.initializeApp({
                projectId: process.env.FIREBASE_PROJECT_ID || "affordindia-a602c"
            });
        }
    } else {
        app = admin.app();
    }
} catch (error) {
    console.error("Firebase Admin initialization error:", error);
    throw error;
}

export { admin, app };
