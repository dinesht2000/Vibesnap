import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useUserProfile, useAllPosts } from "../hooks/useQueries";
import { getUserProfile } from "../firebase/database";
import { useState, useEffect } from "react";
import WelcomeSection from "../components/feed/WelcomeSection";
import PostList from "../components/feed/PostList";
import EmptyFeed from "../components/feed/EmptyFeed";
import FloatingActionButton from "../components/feed/FloatingActionButton";
import type { PostWithUser } from "../components/feed/PostCard";

export default function Feed() {
  const { user, profileComplete, loading: authLoading, logout } = useAuth();

  const { data: profile, isLoading: loading } = useUserProfile(
    user?.uid,
    !!(user && profileComplete === true)
  );
  const { data: allPosts = [] } = useAllPosts(
    !!(user && profileComplete === true)
  );
  const [postsWithUsers, setPostsWithUsers] = useState<PostWithUser[]>([]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      if (allPosts.length === 0) return;

      const postsWithUserData = await Promise.all(
        allPosts.map(async (post) => {
          try {
            const userProfile = await getUserProfile(post.userId);
            return {
              ...post,
              userName: userProfile?.name || "Unknown User",
              userProfileImage: userProfile?.profileImageUrl || "",
            };
          } catch {
            return {
              ...post,
              userName: "Unknown User",
              userProfileImage: "",
            };
          }
        })
      );
      setPostsWithUsers(postsWithUserData);
    };

    fetchAllPosts();
  }, [allPosts]);

  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (!authLoading && user && profileComplete === false) {
    return <Navigate to="/profile-setup" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="text-gray-300">Loading...</div>
      </div>
    );
  }

  const cardColors = ["bg-purple-50", "bg-amber-50"];

  const handleShare = (post: PostWithUser) => {
    console.log("Sharing post:", post.id);
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
          />
        )}
      </div>

      <FloatingActionButton />
    </div>
  );
}
