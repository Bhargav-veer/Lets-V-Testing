import admin from "firebase-admin";
import serviceAccount from "../config/firebaseServiceAccount.json" with { type: "json" };

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const authUser = async (req, res, next) => {
  try {
    // Expecting "Authorization: Bearer <Firebase_ID_Token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized - No token provided",
      });
    }

    const idToken = authHeader.split("Bearer ")[1];

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Attach Firebase UID to request
    req.uid = decodedToken.uid;

    next();
  } catch (error) {
    console.error("Firebase Auth Error:", error);
    return res.status(401).json({
      success: false,
      message: "Not Authorized",
      error: error.message,
    });
  }
};

export default authUser;
