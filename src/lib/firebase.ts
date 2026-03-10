import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { firebaseConfig } from "@/firebase/config";

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

// Build-safe initialization
if (typeof window !== "undefined") {
  if (getApps().length > 0) {
    app = getApp();
  } else {
    try {
      app = initializeApp();
    } catch (e) {
      app = initializeApp(firebaseConfig);
    }
  }
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  // During SSR or Build, we use placeholders to prevent "invalid-api-key" errors
  // These will not be used in runtime as components are 'use client' or wrapped in Suspense
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
  storage = {} as FirebaseStorage;
}

export { auth, db, storage };
