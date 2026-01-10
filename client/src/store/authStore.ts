import { create } from "zustand";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../firebase/auth";
import { checkProfileExists } from "../firebase/database";

interface AuthState {
  user: User | null;
  loading: boolean;
  profileComplete: boolean | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setProfileComplete: (complete: boolean | null) => void;
  refreshProfileStatus: (userId: string) => Promise<void>;
  initializeAuth: () => () => void;
}



export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  profileComplete: null,

  setUser: (user) => set({ user }),

  setLoading: (loading) => set({ loading }),

  setProfileComplete: (profileComplete) => set({ profileComplete }),

  refreshProfileStatus: async (userId: string) => {
    try {
      const exists = await checkProfileExists(userId);
      set({ profileComplete: exists });
    } catch (error) {
      console.error("Error checking profile:", error);
      set({ profileComplete: false });
    }
  },

  initializeAuth: () => {
    const removeAuthListener = onAuthStateChanged(auth, async (user) => {
      set({ user, loading: false });
      if (user) {
        await get().refreshProfileStatus(user.uid);
      } else {
        set({ profileComplete: null });
      }
    });

    return removeAuthListener;
  },
}));

