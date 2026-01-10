import { useNavigate } from "react-router-dom";

export default function CreatePostHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 px-4 py-4 border-b border-gray-200">
      <button
        onClick={() => navigate(-1)}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Go back"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <h1 className="text-xl font-bold text-black flex-1">New post</h1>
    </div>
  );
}

