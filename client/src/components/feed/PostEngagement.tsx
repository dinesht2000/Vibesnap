import { startTransition, useEffect, useRef, useState } from "react";

interface PostEngagementProps {
  likeCount?: number;
  onShare?: () => void;
  isLiked?: boolean;
  onLike?: () => void;
}

export default function PostEngagement({
  likeCount = 0,
  onShare,
  isLiked = false,
  onLike,
}: PostEngagementProps) {
  const [optimisticLiked, setOptimisticLiked] = useState(isLiked);
  const [optimisticCount, setOptimisticCount] = useState(likeCount);
  const isOptimisticUpdateRef = useRef(false);
  const prevPropsRef = useRef({ isLiked, likeCount });

  useEffect(() => {
    if (
      !isOptimisticUpdateRef.current &&
      (prevPropsRef.current.isLiked !== isLiked ||
        prevPropsRef.current.likeCount !== likeCount)
    ) {
      startTransition(() => {
        setOptimisticLiked(isLiked);
        setOptimisticCount(likeCount);
      });
    }
    prevPropsRef.current = { isLiked, likeCount };
    isOptimisticUpdateRef.current = false;
  }, [isLiked, likeCount]);

  const handleLikeClick = () => {
    if (!onLike) return;
    
    // Mark that we're doing an optimistic update
    isOptimisticUpdateRef.current = true;
    
    // Optimistic update
    const newLiked = !optimisticLiked;
    setOptimisticLiked(newLiked);
    setOptimisticCount(newLiked ? optimisticCount + 1 : Math.max(0, optimisticCount - 1));
    
    // Call the actual like handler
    onLike();
  };

  const displayLiked = optimisticLiked;
  const displayCount = optimisticCount;

  return (
   <div className="flex items-center justify-between mt-4">
      <button
        onClick={handleLikeClick}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
        disabled={!onLike}
      >
        {displayLiked ? (
          <svg
            className="w-6 h-6 text-pink-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        )}
        <span className={`font-medium ${displayLiked ? 'text-pink-500' : 'text-black'}`}>
          {displayCount}
        </span>
      </button>
      {onShare && (
        <button
          onClick={onShare}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-gray-600 hover:text-purple-600"
          aria-label="Share post"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          <span className="font-medium">Share</span>
        </button>
      )}
    </div>
  );
}