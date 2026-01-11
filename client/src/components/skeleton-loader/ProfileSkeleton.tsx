import Skeleton from "./Skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-48 bg-gray-300 animate-pulse" />

      <div className="relative px-4">
        <div className="absolute -top-16 left-4">
          <Skeleton variant="circular" className="w-32 h-32 border-4 border-white" />
        </div>
      </div>

      <main className="pt-20 pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Skeleton className="h-8 w-48 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="mb-6">
            <Skeleton className="h-10 w-24" />
          </div>

          <div className="mb-3">
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <Skeleton key={index} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

