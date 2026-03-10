'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

export function initializeFirebase() {
  if (typeof window === 'undefined') {
    // Return mock SDKs for SSR/Build time to prevent errors
    return {
      firebaseApp: null as any,
      auth: null as any,
      firestore: null as any,
    };
  }

  let app: FirebaseApp;
  if (!getApps().length) {
    try {
      // Attempt to initialize via Firebase App Hosting environment variables
      app = initializeApp();
    } catch (e) {
      // Fallback to config object if the above fails (e.g., local development)
      if (!firebaseConfig.apiKey) {
        console.warn('Firebase configuration is missing. Ensure NEXT_PUBLIC_FIREBASE_API_KEY is set.');
      }
      app = initializeApp(firebaseConfig);
    }
  } else {
    app = getApp();
  }

  return getSdks(app);
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
