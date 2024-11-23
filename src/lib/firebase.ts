import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfj5z-RPItbOc84LNog9tH0y3bRcwy34w",
  authDomain: "note-library-5c030.firebaseapp.com",
  projectId: "note-library-5c030",
  storageBucket: "note-library-5c030.firebasestorage.app",
  messagingSenderId: "426290801532",
  appId: "1:426290801532:web:ed3d6b4ec02a16026f92f9",
  measurementId: "G-BYYJFM8JYF",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDZqexG1D16jZabqq2Fc6NXFrf24ojcBYc",
//   authDomain: "bolt-1447a.firebaseapp.com",
//   projectId: "bolt-1447a",
//   storageBucket: "bolt-1447a.firebasestorage.app",
//   messagingSenderId: "315049398775",
//   appId: "1:315049398775:web:97b68169d5f956b1e01ef2",
//   measurementId: "G-8XN9ZRQSMH"
// };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure persistence
setPersistence(auth, browserLocalPersistence).catch(() => {
  setPersistence(auth, inMemoryPersistence);
});

// Configure Google provider with custom parameters
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
  // Add localhost to allowed domains
  // login_hint:
    // window.location.hostname === "localhost" ? "localhost" : undefined,
});

export const db = getFirestore(app);
