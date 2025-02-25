import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {

apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING,
appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
clientId:process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);