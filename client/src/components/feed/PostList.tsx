import { useEffect, useRef } from "react";
import PostCard from "./PostCard";
import type { PostWithUser } from "./PostCard";

interface PostListProps {
  posts: PostWithUser[];
  cardColors?: string[];
  onShare?: (post: PostWithUser) => void;
  currentUserId?: string;
  onLikeUpdate?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function PostList({
  posts,
  cardColors = [
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
  ],
  onShare,
  currentUserId,
  onLikeUpdate,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
}: PostListProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!hasMore || isLoadingMore || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: "200px", // Start loading 200px before the element is visible
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  return (
    <div className="px-6 space-y-6 pb-6">
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          cardColor={cardColors[index % cardColors.length]}
          onShare={onShare}
          currentUserId={currentUserId}
          onLikeUpdate={onLikeUpdate}
        />
      ))}
      {hasMore && (
        <div ref={loadMoreRef} className="h-10" />
      )}
       {!hasMore && posts.length > 0 && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-400 text-sm">No more posts to load</div>
        </div>
      )}
    </div>
  );
}
