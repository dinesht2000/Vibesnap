import Skeleton from "./Skeleton";

interface PostCardSkeletonProps {
  cardColor?: string;
}

export default function PostCardSkeleton({ cardColor = "bg-purple-50" }: PostCardSkeletonProps) {
  return (
    <div className={`${cardColor} rounded-2xl p-5 shadow-sm`}>
      <div className="flex items-center gap-3 mb-4">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>


      <div className="mb-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>


      <Skeleton className="w-full h-64 mb-4 rounded-lg" />

      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  );
}

