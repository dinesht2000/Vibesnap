import { getDatabase, ref, set, get } from "firebase/database";
import { app } from "./firebase.config";

export const database = getDatabase(app);

export interface UserProfile {
  name: string;
  bio: string;
  profileImageUrl: string;
  createdAt: number;
  updatedAt: number;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  createdAt: number;
}
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const profileRef = ref(database, `users/${userId}/profile`);
  const snapshot = await get(profileRef);
  return snapshot.exists() ? snapshot.val() : null;
};
export const createUserProfile = async (userId: string, profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>): Promise<void> => {
  const profileRef = ref(database, `users/${userId}/profile`);
  const now = Date.now();
  await set(profileRef, {
    ...profile,
    createdAt: now,
    updatedAt: now,
  });
};
export const checkProfileExists = async (userId: string): Promise<boolean> => {
  const profile = await getUserProfile(userId);
  return profile !== null;
};