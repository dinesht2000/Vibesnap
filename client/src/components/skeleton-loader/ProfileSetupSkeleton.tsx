import Skeleton from "./Skeleton";

export default function ProfileSetupSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>

          <div className="flex flex-col items-center mb-6">
            <Skeleton variant="circular" className="w-32 h-32 mb-4" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="flex flex-col items-center mb-6">
            <Skeleton className="w-full h-32 rounded-lg mb-4" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="space-y-6">
            <div>
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-4 w-12 mb-2" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

