import { useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
  auth,
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
  logout,
} from "../firebase/auth";
import { checkProfileExists } from "../firebase/database";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null);

  const refreshProfileStatus = useCallback(async (userId: string) => {
    try {
      const exists = await checkProfileExists(userId);
      setProfileComplete(exists);
    } catch (error) {
      console.error("Error checking profile:", error);
      setProfileComplete(false);
    }
  }, []);
  useEffect(() => {
    const removeAuthListener = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        await refreshProfileStatus(user.uid);
      } else {
        setProfileComplete(null);
      }
      setLoading(false);
    });

    return () => removeAuthListener();
  }, [refreshProfileStatus]);

  // Expose refresh function for manual refresh after profile creation
  useEffect(() => {
    if (user && typeof window !== 'undefined') {
      // Listen for storage event to refresh profile status
      const handleStorageChange = () => {
        if (user) {
          refreshProfileStatus(user.uid);
        }
      };
      window.addEventListener('focus', handleStorageChange);
      return () => window.removeEventListener('focus', handleStorageChange);
    }
  }, [user, refreshProfileStatus]);

  return {
    user,
    loading,
    profileComplete,
    refreshProfileStatus: user
      ? () => refreshProfileStatus(user.uid)
      : undefined,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    logout,
  };
}
