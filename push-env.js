const { execSync } = require('child_process');

const envs = {
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "ai-jasa-edit.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "ai-jasa-edit",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "ai-jasa-edit.firebasestorage.app",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "71281868839",
  NEXT_PUBLIC_FIREBASE_APP_ID: "1:71281868839:web:b402e29a9d5f3bb7f9ce02",
  ADMIN_PASSWORD: "AiJasaEdit@2026!",
  ADMIN_SECRET_KEY: "k9x7m2v4p8q1w3n6j5r0t8y2u4i7o1a3s5d9f6g8h0l2z",
  NEXT_PUBLIC_SITE_URL: "https://aijasaedit.vercel.app"
};

for (const [key, val] of Object.entries(envs)) {
  console.log(`Pushing ${key} to Vercel...`);
  try {
    execSync(`vercel env add ${key} production --force`, { 
      input: val, 
      stdio: ['pipe', 'inherit', 'inherit'] 
    });
    console.log(`Success: ${key}`);
  } catch (err) {
    console.error(`Failed to push ${key}:`, err.message);
  }
}
