import type { Post } from "../../firebase/database";
import LazyImage from "../LazyImage";


interface ProfilePostsGridProps {
  posts: Post[];
  isOwnProfile?: boolean;
  onDelete?: (postId: string) => void;
  isDeleting?: boolean;
}

export default function ProfilePostsGrid({ posts, isOwnProfile = false, onDelete, isDeleting = false }: ProfilePostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p>No posts yet</p>
      </div>
    );
  }

  const handleDelete = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (onDelete && window.confirm("Are you sure you want to delete this post?")) {
      onDelete(postId);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {posts.map((post) => {
        const images = post.imageUrls && post.imageUrls.length > 0 
          ? post.imageUrls 
          : (post.imageUrl ? [post.imageUrl] : []);
        const hasMultipleImages = images.length > 1;
        const thumbnailImage = images.length > 0 ? images[0] : null;

        return (
          <div
            key={post.id}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
          >
            {thumbnailImage ? (
              <LazyImage src={thumbnailImage} alt="Post" className="w-full h-full object-cover" rootMargin="50px" />
            ) : post.videoUrl ? (
              <video
                src={post.videoUrl}
                className="w-full h-full object-cover"
                preload="metadata"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-400 text-xs text-center px-2">{post.content}</p>
              </div>
            )}
            {hasMultipleImages && (
              <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded z-30 font-medium">
                1 / {images.length}
              </div>
            )}
            {isOwnProfile && onDelete && (
              <button
                onClick={(e) => handleDelete(e, post.id)}
                disabled={isDeleting}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg opacity-90 hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed z-20"
                aria-label="Delete post"
              >
                {isDeleting ? (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                )}
              </button>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent z-10">
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <p className="text-xs font-medium text-white mb-1 truncate">
                  {post.content.length > 15 ? `${post.content.substring(0, 15)}...` : post.content}
                </p>
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs text-white font-medium">{post.likeCount ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

