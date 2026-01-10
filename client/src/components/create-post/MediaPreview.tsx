import type { MediaType } from "../../types/media";

interface MediaPreviewProps {
  previewUrl: string;
  mediaType: MediaType;
  onRemove: () => void;
}

export default function MediaPreview({
  previewUrl,
  mediaType,
  onRemove,
}: MediaPreviewProps) {
  return (
    <div className="mt-4 relative">
      {mediaType === "image" ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full rounded-lg object-cover max-h-100"
          />
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
            aria-label="Remove image"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : mediaType === "video" ? (
        <div className="relative">
          <video
            src={previewUrl}
            controls
            className="w-full rounded-lg max-h-100"
          />
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
            aria-label="Remove video"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}

