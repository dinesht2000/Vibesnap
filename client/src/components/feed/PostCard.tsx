import { togglePostLike, type Post } from "../../firebase/database";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostImage from "./PostImage";
import PostEngagement from "./PostEngagement";
import { getContentWithoutHashtags, getHashtagsString } from "../../utils/hashtagUtils";
import PostVideo from "./PostVideo";

export interface PostWithUser extends Post {
  userName?: string;
  userProfileImage?: string;
  isLiked?: boolean;
}

interface PostCardProps {
  post: PostWithUser;
  cardColor: string;
  onShare?: (post: PostWithUser) => void;
  currentUserId?: string;
  onLikeUpdate?: () => void;
}

export default function PostCard({ post, cardColor, onShare , onLikeUpdate,currentUserId}: PostCardProps) {
  const hashtags = getHashtagsString(post.content);
  const contentWithoutHashtags = getContentWithoutHashtags(post.content);

  const handleLike = async () => {
    if (!currentUserId) return;
    
    try {
      await togglePostLike(post.userId, post.id, currentUserId);
      if (onLikeUpdate) {
        onLikeUpdate();
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className={`${cardColor} rounded-2xl p-5 shadow-sm`}>
      <PostHeader
        userName={post.userName}
        userProfileImage={post.userProfileImage}
        createdAt={post.createdAt}
      />
      <PostContent content={contentWithoutHashtags} hashtags={hashtags} />
     {(post.imageUrls && post.imageUrls.length > 0) || post.imageUrl ? (
        <PostImage imageUrl={post.imageUrl} imageUrls={post.imageUrls} />
      ) : null}
      {post.videoUrl && <PostVideo videoUrl={post.videoUrl} />}
      <PostEngagement
        likeCount={post.likeCount ?? 0}
        onShare={onShare ? () => onShare(post) : undefined}
        isLiked={post.isLiked}
        onLike={currentUserId ? handleLike : undefined}
      />
    </div>
  );
}

