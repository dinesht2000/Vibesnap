import Skeleton from "./Skeleton";

export default function LoginSkeleton() {
  return (
    <div className="min-h-screen relative bg-gray-800 overflow-hidden">
      <div className="absolute inset-0 bg-gray-700 animate-pulse" />
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="bg-white rounded-t-3xl px-8 pt-8 pb-10 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center mb-3">
              <Skeleton variant="circular" className="w-12 h-12 mr-2" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-14 w-full mb-4 rounded-xl" />
          <div className="text-center">
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

