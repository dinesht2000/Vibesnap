import { formatTimeAgo } from "../../utils/formatDate";

interface PostHeaderProps {
  userName?: string;
  userProfileImage?: string;
  createdAt: number;
}

export default function PostHeader({
  userName,
  userProfileImage,
  createdAt,
}: PostHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-3">
      {userProfileImage ? (
        <img
          src={userProfileImage}
          alt={userName}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-600 text-sm font-medium">
            {userName?.[0]?.toUpperCase() || "U"}
          </span>
        </div>
      )}
      <div className="flex-1">
        <p className="text-black font-semibold">{userName || "Unknown User"}</p>
        <p className="text-gray-500 text-sm">{formatTimeAgo(createdAt)}</p>
      </div>
    </div>
  );
}

