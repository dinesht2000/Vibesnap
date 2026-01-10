import type { Post } from "../../firebase/database";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostImage from "./PostImage";
import PostEngagement from "./PostEngagement";
import { getContentWithoutHashtags, getHashtagsString } from "../../utils/hashtagUtils";

export interface PostWithUser extends Post {
  userName?: string;
  userProfileImage?: string;
}

interface PostCardProps {
  post: PostWithUser;
  cardColor: string;
  onShare?: (post: PostWithUser) => void;
}

export default function PostCard({ post, cardColor, onShare }: PostCardProps) {
  const hashtags = getHashtagsString(post.content);
  const contentWithoutHashtags = getContentWithoutHashtags(post.content);

  return (
    <div className={`${cardColor} rounded-2xl p-5 shadow-sm`}>
      <PostHeader
        userName={post.userName}
        userProfileImage={post.userProfileImage}
        createdAt={post.createdAt}
      />
      <PostContent content={contentWithoutHashtags} hashtags={hashtags} />
      {post.imageUrl && <PostImage imageUrl={post.imageUrl} />}
      <PostEngagement
        likeCount={67} // TODO: Replace with actual like count from post data
        onShare={onShare ? () => onShare(post) : undefined}
      />
    </div>
  );
}

