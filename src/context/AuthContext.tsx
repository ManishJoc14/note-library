"use client";

import { setCookie, deleteCookie } from "cookies-next";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User as FirebaseUser,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../lib/firebase";
import { User } from "../types";
import { useRouter } from "next/navigation";
import {
  saveUserToTable,
  fetchUser,
  updateUserActivities,
} from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create or fetch user profile from Firestore
const createUserProfile = async (firebaseUser: FirebaseUser): Promise<User> => {
  const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

  if (userDoc.exists()) {
    return userDoc.data() as User;
  }

  const isAdmin = firebaseUser.email === "note-libraryadmin@gmail.com";

  const newUser: User = {
    id: firebaseUser.uid,
    fullName: firebaseUser.displayName || "",
    email: firebaseUser.email || "",
    grade: "11",
    phone: "",
    role: isAdmin ? "admin" : "student",
    quizData: [],
    likedPosts: [],
    viewedPosts: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // save to firebase
  await setDoc(doc(db, "users", firebaseUser.uid), newUser);

  // save to supabase
  await saveUserToTable(newUser);

  // update user activites
  async function updateActivities(userId: string) {
    await updateUserActivities(userId, {
      type: "account",
      title: `${newUser.fullName} joined NoteLibrary at ${
        new Date(newUser.createdAt).toDateString
      }`,
      date: new Date().toISOString(),
    });
  }
  updateActivities(newUser?.id);

  return newUser;
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleUser = async (firebaseUser: FirebaseUser | null) => {
      setLoading(true);
      if (firebaseUser) {
        const userData = await createUserProfile(firebaseUser);
        const fetchedUser = await fetchUser(userData.id);

        setUser({
          id: fetchedUser.id,
          fullName: fetchedUser.full_name,
          email: fetchedUser.email,
          grade: fetchedUser.grade,
          phone: fetchedUser.phone,
          role: fetchedUser.role,
          quizData: fetchedUser.quiz_data,
          likedPosts: fetchedUser.liked_posts,
          viewedPosts: fetchedUser.viewed_posts,
          createdAt: fetchedUser.created_at,
          updatedAt: fetchedUser.updated_at,
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged(handleUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user) {
        setCookie("role", user.role, {
          path: "/",
          secure: true,
          sameSite: "strict",
        });
        setCookie("isLoggedIn", true, {
          path: "/",
          secure: true,
          sameSite: "strict",
        });
      } else {
        deleteCookie("role", { path: "/" });
        setCookie("isLoggedIn", false, {
          path: "/",
          secure: true,
          sameSite: "strict",
        });
      }
    }
  }, [user, loading]);

  const redirectToDashboard = (role: string) => {
    if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (role === "student") {
      router.push("/student/dashboard");
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const userData = await createUserProfile(result.user);
        setUser(userData);
        setIsAuthenticated(true);
        redirectToDashboard(userData.role);
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw new Error("Failed to sign in with Google. Please try again.");
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userData = await createUserProfile(result.user);
      setUser(userData);
      setIsAuthenticated(true);
      redirectToDashboard(userData.role);
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw new Error("Invalid email or password");
    }
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    name: string
  ) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(result.user, { displayName: name });
      const userData = await createUserProfile(result.user);
      setUser(userData);
      router.push("/login");
    } catch (error) {
      console.error("Error signing up with email:", error);
      throw new Error("Failed to sign up. Please try again.");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw new Error("Failed to send password reset email. Try again later.");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin: user?.role === "admin",
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
