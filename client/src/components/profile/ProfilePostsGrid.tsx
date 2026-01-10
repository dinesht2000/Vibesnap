interface Post {
  id: string;
  content: string;
  imageUrl?: string;
}

interface ProfilePostsGridProps {
  posts: Post[];
}

export default function ProfilePostsGrid({ posts }: ProfilePostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p>No posts yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {posts.map((post) => (
        <div
          key={post.id}
          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
        >
          {post.imageUrl ? (
            <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <p className="text-gray-400 text-xs text-center px-2">{post.content}</p>
            </div>
          )}
          {/* Always visible overlay with text and likes */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent">
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
                <span className="text-xs text-white font-medium">0</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

