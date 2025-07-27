// iniwebumkm-admin/src/lib/firebase-admin.js (Server-side only)
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app;
let db;

// Initialize Firebase Admin only once
if (!getApps().length) {
  try {
    // Decode the base64 service account
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

    if (!serviceAccountBase64) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set",
      );
    }

    // Decode base64 to JSON
    const serviceAccountBuffer = Buffer.from(serviceAccountBase64, "base64");
    const serviceAccount = JSON.parse(serviceAccountBuffer.toString("utf8"));

    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

    console.log("✅ Firebase Admin initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing Firebase Admin:", error);
    throw error;
  }
} else {
  app = getApps()[0];
}

// Initialize Firestore
db = getFirestore(app);

export { db };
export default app;
