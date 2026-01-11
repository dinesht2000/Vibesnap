import { getDatabase, ref, set, get,update, push, onValue, off ,remove} from "firebase/database";
import { app } from "./firebase.config";
import { storage } from "./storage";
import { ref as storageRef, deleteObject } from "firebase/storage";


export const database = getDatabase(app);

export interface UserProfile {
  name: string;
  bio: string;
  profileImageUrl: string;
  bannerImageUrl?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  createdAt: number;
  imageUrls?: string[];
  videoUrl?: string;
  likeCount?: number;
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
  const posts = snapshot.val() as Record<string, Omit<Post, 'id' | 'userId'>>;
  return Object.entries(posts).map(([id, post]) => ({
    id,
    userId,
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

export const getAllPosts = async (): Promise<Post[]> => {
  const usersRef = ref(database, `users`);
  const snapshot = await get(usersRef);
  if (!snapshot.exists()) {
    return [];
  }
  const users = snapshot.val() as Record<string, { posts?: Record<string, Omit<Post, 'id' | 'userId'>> }>;
  const allPosts: Post[] = [];
  let cnt=0;

  Object.entries(users).forEach(([userId, userData]) => {
    if (userData.posts) {
      Object.entries(userData.posts).forEach(([postId, post]) => {
        cnt=cnt+1;
        allPosts.push({
          id: postId,
          userId,
          ...post,
        });
      });
    }
  });
  return allPosts.sort((a, b) => b.createdAt - a.createdAt);
};
export const deletePost = async (userId: string, postId: string, post: Post): Promise<void> => {
  const postRef = ref(database, `users/${userId}/posts/${postId}`);
  await remove(postRef);

  if (post.imageUrl) {
    try {
      const imageStorageRef = storageRef(storage, `users/${userId}/posts/${postId}.jpg`);
      await deleteObject(imageStorageRef);
    } catch (error) {
      console.error("Error deleting post image:", error);
    }
  }
  if (post.videoUrl) {
    try {
      const extensions = ['mp4', 'mov', 'webm', 'avi'];
      for (const ext of extensions) {
        try {
          const videoStorageRef = storageRef(storage, `users/${userId}/posts/${postId}.${ext}`);
          await deleteObject(videoStorageRef);
          break; 
        } catch (error) {
          console.error("Error deleting post video:", error);
        }
      }
    } catch (error) {
      console.error("Error deleting post video:", error);
    }
  }
};

export const checkUserLikedPost = async (postOwnerId: string, postId: string, userId: string): Promise<boolean> => {
  const likeRef = ref(database, `users/${postOwnerId}/posts/${postId}/likes/${userId}`);
  const snapshot = await get(likeRef);
  return snapshot.exists();
};

export const togglePostLike = async (postOwnerId: string, postId: string, userId: string): Promise<boolean> => {
  const likeRef = ref(database, `users/${postOwnerId}/posts/${postId}/likes/${userId}`);
  const postRef = ref(database, `users/${postOwnerId}/posts/${postId}`);
  const snapshot = await get(likeRef);
  const isLiked = snapshot.exists();
  
  if (isLiked) {
    await remove(likeRef);
    const postSnapshot = await get(postRef);
    const currentLikeCount = postSnapshot.val()?.likeCount || 0;
    await update(postRef, {
      likeCount: Math.max(0, currentLikeCount - 1),
    });
    return false;
  } else {
    await set(likeRef, true);
    const postSnapshot = await get(postRef);
    const currentLikeCount = postSnapshot.val()?.likeCount || 0;
    await update(postRef, {
      likeCount: currentLikeCount + 1,
    });
    return true;
  }
};

export const getPostsPaginated = async (page: number, limit: number = 10): Promise<{ posts: Post[]; hasMore: boolean }> => {
  const allPosts = await getAllPosts();
  const startIndex = page * limit;
  const endIndex = startIndex + limit;
  const posts = allPosts.slice(startIndex, endIndex);
  const hasMore = endIndex < allPosts.length;
  
  return { posts, hasMore };
};