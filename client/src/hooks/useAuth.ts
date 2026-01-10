import { useEffect } from "react";
import {
  signInWithGoogle,
  signUpWithEmail,
  signInWithEmail,
  logout,
} from "../firebase/auth";
import { useAuthStore } from "../store/authStore";

export function useAuth() {
  const {
    user,
    loading,
    profileComplete,
    refreshProfileStatus,
    initializeAuth,
  } = useAuthStore();

  useEffect(() => {
    const removeAuthListener = initializeAuth();
    return removeAuthListener;
  }, [initializeAuth]);


  useEffect(() => {
    if (user && typeof window !== "undefined") {
      const handleStorageChange = () => {
          refreshProfileStatus(user.uid);
      };
      window.addEventListener("focus", handleStorageChange);
      return () => window.removeEventListener("focus", handleStorageChange);
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
