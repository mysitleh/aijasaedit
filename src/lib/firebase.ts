import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// A function to check if all necessary Firebase config values are present
const checkFirebaseConfig = () => {
  return (
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};

export const isFirebaseEnabled = checkFirebaseConfig();

let app: FirebaseApp;
let db: Firestore;
let storage: FirebaseStorage;

if (isFirebaseEnabled) {
  // Initialize Firebase only if the config is valid
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  // Log a warning and provide dummy objects if not configured.
  // This allows the app to run without crashing, using fallback data.
  console.warn(
    "Firebase configuration is incomplete. Firebase services will be disabled. Please check your .env file and follow the setup instructions in README.md."
  );
  app = {} as FirebaseApp;
  db = {} as Firestore;
  storage = {} as FirebaseStorage;
}

export { app, db, storage };
