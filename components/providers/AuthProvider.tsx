"use client";

import { createContext, useContext, useEffect } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/config";
import { UserProfile } from "@/types";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  activeFamilyId: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  activeFamilyId: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    profile,
    activeFamilyId,
    loading,
    setUser,
    setProfile,
    setActiveFamilyId,
    setLoading,
  } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);

      if (authUser) {
        try {
          const userRef = doc(db, "users", authUser.uid);
          const userSnap = await getDoc(userRef);

          let userProfile: UserProfile;

          if (userSnap.exists()) {
            userProfile = userSnap.data() as UserProfile;
          } else {
            userProfile = {
              uid: authUser.uid,
              email: authUser.email || "",
              displayName: authUser.displayName || "",
              photoURL: authUser.photoURL || "",
              familyIds: [],
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              createdAt: serverTimestamp() as any,
            };
            await setDoc(userRef, userProfile);
          }

          setProfile(userProfile);

          const currentStoredId = useAuthStore.getState().activeFamilyId;
          const hasFamilies =
            userProfile.familyIds && userProfile.familyIds.length > 0;

          if (hasFamilies) {
            const isValid =
              currentStoredId &&
              userProfile.familyIds.includes(currentStoredId);
            if (!isValid) {
              setActiveFamilyId(userProfile.familyIds[0]);
            }
          } else {
            setActiveFamilyId(null);
          }
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
        setActiveFamilyId(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setProfile, setActiveFamilyId, setLoading]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        activeFamilyId,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
