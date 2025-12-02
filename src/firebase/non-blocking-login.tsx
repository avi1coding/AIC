
'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // Assume getAuth and app are initialized elsewhere
} from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';


/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance);
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  const { firestore } = initializeFirebase();
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(userCredential => {
      // After user is created in Auth, create their document in Firestore.
      const user = userCredential.user;
      const userRef = doc(firestore, "users", user.uid);
      setDoc(userRef, {
        id: user.uid,
        email: user.email,
        creationDate: serverTimestamp(),
        subscriptionTier: 'free',
        usageCount: 0,
        lastUsageDate: new Date().toISOString().split('T')[0],
      }, { merge: true });
    })
    .catch(error => {
      // The onAuthStateChanged listener will handle UI, but you might want to log this
      console.error("Error during sign-up:", error);
    });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string, onSuccess: () => void, onError: (error: any) => void): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password)
    .then(() => {
        onSuccess();
    })
    .catch((error) => {
        onError(error);
    });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}
