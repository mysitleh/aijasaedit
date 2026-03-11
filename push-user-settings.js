const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function pushSettings() {
  try {
    const settings = {
      whatsappNumber: "6281353658705",
      bankName: "Bank BRI",
      bankAccount: "3896 0100 3715 509",
      bankHolder: "Hamada Zein",
      qrisImage: "/qris-payment.webp"
    };

    const docRef = doc(db, "settings", "general");
    await setDoc(docRef, settings, { merge: true });
    console.log("✅ Berhasil memperbarui pengaturan Live Firebase!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Gagal memperbarui pengaturan:", error);
    process.exit(1);
  }
}

pushSettings();
