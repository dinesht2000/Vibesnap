import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import {
  useUserProfile,
  useInfinitePosts,
  queryKeys,
} from "../hooks/useQueries";
import { getUserProfile, checkUserLikedPost } from "../firebase/database";
import { useState, useEffect, useCallback, useMemo } from "react";
import WelcomeSection from "../components/feed/WelcomeSection";
import PostList from "../components/feed/PostList";
import EmptyFeed from "../components/feed/EmptyFeed";
import FloatingActionButton from "../components/feed/FloatingActionButton";
import type { PostWithUser } from "../components/feed/PostCard";
import { useQueryClient } from "@tanstack/react-query";
import ShareModal from "../components/feed/ShareModal";
import { FeedSkeleton } from "../components/skeleton-loader";

export default function Feed() {
  const { user, profileComplete, loading: authLoading, logout } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: loading } = useUserProfile(
    user?.uid,
    !!(user && profileComplete === true)
  );
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPosts,
  } = useInfinitePosts(!!(user && profileComplete === true), 20);
  
  const [postsWithUsers, setPostsWithUsers] = useState<PostWithUser[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostWithUser | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const allPosts = useMemo(() => data?.pages.flatMap((page) => page.posts) ?? [], [data]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      if (allPosts.length === 0 || !user) return;

      const postsWithUserData = await Promise.all(
        allPosts.map(async (post) => {
          try {
            const userProfile = await getUserProfile(post.userId);
            const isLiked = await checkUserLikedPost(
              post.userId,
              post.id,
              user.uid
            );
            return {
              ...post,
              userName: userProfile?.name || "Unknown User",
              userProfileImage: userProfile?.profileImageUrl || "",
              isLiked,
            };
          } catch {
            return {
              ...post,
              userName: "Unknown User",
              userProfileImage: "",
              isLiked: false,
            };
          }
        })
      );
      setPostsWithUsers(postsWithUserData);
    };

    fetchAllPosts();
  }, [allPosts, user]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleLikeUpdate = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.allPosts() });
  };

  if (!authLoading && user && profileComplete === false) {
    return <Navigate to="/profile-setup" replace/>;
  }

  if (loading || isLoadingPosts) {
    return <FeedSkeleton />;
  }

  const cardColors = [
    "bg-purple-50",
    "bg-amber-50",
    "bg-blue-50",
    "bg-green-50",
    "bg-pink-50",
    "bg-indigo-50",
    "bg-cyan-50",
    "bg-teal-50",
    "bg-rose-50",
    "bg-violet-50",
  ];

  const handleShare = (post: PostWithUser) => {
    setSelectedPost(post);
    setIsShareModalOpen(true);
  };
  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <div className="min-h-screen bg-gray-800 pb-20">
      <div className="max-w-2xl mx-auto bg-white min-h-screen">
        <WelcomeSection
          user={user}
          profile={profile || null}
          onLogout={logout}
        />

        {postsWithUsers.length === 0 ? (
          <EmptyFeed />
        ) : (
          <PostList
            posts={postsWithUsers}
            cardColors={cardColors}
            onShare={handleShare}
            currentUserId={user?.uid}
            onLikeUpdate={handleLikeUpdate}
            isLoadingMore={isFetchingNextPage}
            hasMore={hasNextPage ?? false}
            onLoadMore={handleLoadMore}
          />
        )}
      </div>

      <FloatingActionButton />

      {selectedPost && (
        <ShareModal
          post={selectedPost}
          isOpen={isShareModalOpen}
          onClose={handleCloseShareModal}
        />
      )}
    </div>
  );
}
