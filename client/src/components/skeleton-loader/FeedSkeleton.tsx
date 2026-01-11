import PostCardSkeleton from "./PostCardskeleton";

const cardColors = [
  "bg-purple-50",
  "bg-amber-50",
  "bg-blue-50",
  "bg-green-50",
  "bg-pink-50",
  "bg-indigo-50",
  "bg-cyan-50",
  "bg-teal-50",
  "bg-rose-50",
  "bg-violet-50",
];

export default function FeedSkeleton() {
  return (
    <div className="min-h-screen bg-gray-800 pb-20">
      <div className="max-w-2xl mx-auto bg-white min-h-screen">
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse" />
              <div>
                <div className="h-5 w-32 bg-gray-300 rounded animate-pulse mb-2" />
                <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-8 w-20 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>

        <div className="px-6 space-y-6 pb-6 pt-6">
          {[0, 1, 2].map((index) => (
            <PostCardSkeleton key={index} cardColor={cardColors[index % cardColors.length]} />
          ))}
        </div>
      </div>
    </div>
  );
}

