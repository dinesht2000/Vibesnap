import { getDatabase, ref, set, get,update, push, onValue, off } from "firebase/database";
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

export const updateUserProfile = async (userId: string, updates: Partial<Omit<UserProfile, 'createdAt'>>): Promise<void> => {
  const profileRef = ref(database, `users/${userId}/profile`);
  const currentProfile = await getUserProfile(userId);
  if (!currentProfile) {
    throw new Error("Profile not found");
  }
  await update(profileRef, {
    ...updates,
    updatedAt: Date.now(),
  });
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  const postsRef = ref(database, `users/${userId}/posts`);
  const snapshot = await get(postsRef);
  if (!snapshot.exists()) {
    return [];
  }
  const posts = snapshot.val() as Record<string, Omit<Post, 'id'>>;
  return Object.entries(posts).map(([id, post]) => ({
    id,
    ...post,
  })).sort((a, b) => b.createdAt - a.createdAt);
};

export const createPost = async (userId: string, post: Omit<Post, 'id' | 'createdAt'>): Promise<string> => {
  const postsRef = ref(database, `users/${userId}/posts`);
  const newPostRef = push(postsRef);
  await set(newPostRef, {
    ...post,
    createdAt: Date.now(),
  });
  return newPostRef.key || '';
};

export const subscribeToUserProfile = (
  userId: string,
  callback: (profile: UserProfile | null) => void
): (() => void) => {
  const profileRef = ref(database, `users/${userId}/profile`);
  onValue(profileRef, (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  });
  return () => off(profileRef);
};

