import PostCard from "./PostCard";
import type { PostWithUser } from "./PostCard";

interface PostListProps {
  posts: PostWithUser[];
  cardColors?: string[];
  onShare?: (post: PostWithUser) => void;
}

export default function PostList({
  posts,
  cardColors = ["bg-purple-50", "bg-amber-50"],
  onShare,
}: PostListProps) {
  return (
    <div className="px-6 space-y-6 pb-6">
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          cardColor={cardColors[index % cardColors.length]}
          onShare={onShare}
        />
      ))}
    </div>
  );
}

