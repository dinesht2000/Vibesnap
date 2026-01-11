import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
  getUserProfile,
  createUserProfile,
  checkProfileExists,
  createPost,
  deletePost,
  getUserPosts,
  getAllPosts,
  updateUserProfile,
  getPostsPaginated,
  type UserProfile,
  type Post,
} from "../firebase/database";


export const queryKeys = {
  userProfile: (userId: string) => ["userProfile", userId] as const,
  profileExists: (userId: string) => ["profileExists", userId] as const,
  userPosts: (userId: string) => ["userPosts", userId] as const,
  allPosts: () => ["allPosts"] as const,
};

export const useUserProfile = (
  userId: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.userProfile(userId || ""),
    queryFn: () => getUserProfile(userId!),
    enabled: enabled && !!userId,
  });
};

export const useCheckProfileExists = (
  userId: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.profileExists(userId || ""),
    queryFn: () => checkProfileExists(userId!),
    enabled: enabled && !!userId,
  });
};

export const useCreateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      profile,
    }: {
      userId: string;
      profile: Omit<UserProfile, "createdAt" | "updatedAt">;
    }) => createUserProfile(userId, profile),
    onSuccess: (_, variables) => {

      queryClient.invalidateQueries({
        queryKey: queryKeys.userProfile(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.profileExists(variables.userId),
      });
    },
  });
};
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      updates,
    }: {
      userId: string;
      updates: Partial<Omit<UserProfile, "createdAt">>;
    }) => updateUserProfile(userId, updates),
    onSuccess: (_, variables) => {

      queryClient.invalidateQueries({
        queryKey: queryKeys.userProfile(variables.userId),
      });
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      post,
    }: {
      userId: string;
      post: Omit<Post, "id" | "createdAt">;
    }) => createPost(userId, post),
    onSuccess: () => {

     queryClient.invalidateQueries({ queryKey: queryKeys.allPosts() });
    },
  });
};

export const useUserPosts = (
  userId: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.userPosts(userId || ""),
    queryFn: () => getUserPosts(userId!),
    enabled: enabled && !!userId,
  });
};

export const useAllPosts = (enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.allPosts(),
    queryFn: () => getAllPosts(),
    enabled: enabled,
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, postId, post }: { userId: string; postId: string; post: Post }) =>
      deletePost(userId, postId, post),
    onSuccess: (_, variables) => {
      // Invalidate and refetch user posts and all posts after deletion
      queryClient.invalidateQueries({ queryKey: queryKeys.userPosts(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.allPosts() });
    },
  });
};

export const useInfinitePosts = (enabled: boolean = true, pageSize: number = 20) => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.allPosts(), 'infinite'],
    queryFn: ({ pageParam = 0 }) => getPostsPaginated(pageParam, pageSize),
    enabled: enabled,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });
};