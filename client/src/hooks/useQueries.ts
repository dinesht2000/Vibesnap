import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserProfile,createUserProfile,checkProfileExists, createPost ,getUserPosts,type UserProfile, type Post, updateUserProfile  } from "../firebase/database";


export const queryKeys = {
  userProfile: (userId: string) => ["userProfile", userId] as const,
  profileExists: (userId: string) => ["profileExists", userId] as const,
  userPosts: (userId: string) => ["userPosts", userId] as const,
};


export const useUserProfile = (userId: string | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.userProfile(userId || ""),
    queryFn: () => getUserProfile(userId!),
    enabled: enabled && !!userId,
  });
};


export const useCheckProfileExists = (userId: string | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.profileExists(userId || ""),
    queryFn: () => checkProfileExists(userId!),
    enabled: enabled && !!userId,
  });
};


export const useCreateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, profile }: { userId: string; profile: Omit<UserProfile, 'createdAt' | 'updatedAt'> }) =>
      createUserProfile(userId, profile),
    onSuccess: (_, variables) => {
      // Invalidate and refetch user profile after creation
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.profileExists(variables.userId) });
    },
  });
};
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<Omit<UserProfile, 'createdAt'>> }) =>
      updateUserProfile(userId, updates),
    onSuccess: (_, variables) => {
      // Invalidate and refetch user profile after update
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile(variables.userId) });
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, post }: { userId: string; post: Omit<Post, 'id' | 'createdAt'> }) =>
      createPost(userId, post),
    onSuccess: (_, variables) => {
      // Invalidate and refetch user posts after creation
      queryClient.invalidateQueries({ queryKey: queryKeys.userPosts(variables.userId) });
    },
  });
};

export const useUserPosts = (userId: string | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.userPosts(userId || ""),
    queryFn: () => getUserPosts(userId!),
    enabled: enabled && !!userId,
  });
};

