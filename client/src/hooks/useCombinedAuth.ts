import { useAuthStore } from "../store/authStore";
import { useUserProfile } from "./useQueries";

export function useCombinedAuth() {

  const { user, loading: authLoading, profileComplete } = useAuthStore();


  const {
    data: profile,
    isLoading: profileLoading,
    error: profileError,
  } = useUserProfile(user?.uid, !!(user && profileComplete === true));

  return {
    // From Zustand
    user,
    authLoading,
    profileComplete,
    
    // From TanStack Query
    profile,
    profileLoading,
    profileError,
    
    // Combined loading state
    isLoading: authLoading || profileLoading,
  };
}

