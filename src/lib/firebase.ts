// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// MOCK FIREBASE FOR FRONTEND DEVELOPMENT
// Uncomment below when ready to integrate with real Firebase

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// export const db = getFirestore(app);
// export const auth = getAuth(app);
// export const storage = getStorage(app);

export const db = {} as any;
export const auth = {} as any;
export const storage = {} as any;
