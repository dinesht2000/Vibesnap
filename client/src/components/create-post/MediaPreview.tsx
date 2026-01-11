import type { MediaType } from "../../types/media";

interface MediaPreviewProps {
  previewUrl?: string | null;
  previewUrls?: string[];
  mediaType: MediaType;
  onRemove: () => void;
  onRemoveImage?: (index: number) => void;
}

export default function MediaPreview({
  previewUrl,
  previewUrls = [],
  mediaType,
  onRemove,
  onRemoveImage,
}: MediaPreviewProps) {
  const images = previewUrls.length > 0 ? previewUrls : (previewUrl ? [previewUrl] : []);

  return (
    <div className="mt-4 relative">
      {mediaType === "image" && images.length > 0 ? (
        <div className="space-y-2">
          {images.length === 1 ? (

            <div className="relative">
              <img
                src={images[0]}
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
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {images.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-48 rounded-lg object-cover"
                  />
                  {onRemoveImage && (
                    <button
                      onClick={() => onRemoveImage(index)}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-70 transition-opacity"
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <svg
                        className="w-4 h-4"
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
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : mediaType === "video" && previewUrl ? (
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

