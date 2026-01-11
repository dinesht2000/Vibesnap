import type { MediaType } from "../../types/media";
import { useState, useRef } from "react";


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
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const validIndex = images.length > 0 ? Math.min(currentIndex, images.length - 1) : 0;

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  const handleRemoveCurrent = () => {
    if (images.length === 1) {
      onRemove();
    } else if (onRemoveImage) {
      onRemoveImage(validIndex);

      if (validIndex >= images.length - 1) {
        setCurrentIndex(Math.max(0, validIndex - 1));
      }
    }
  };


  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && images.length > 1) {
      goToNext();
    }
    if (isRightSwipe && images.length > 1) {
      goToPrevious();
    }
  };

  return (
    <div className="mt-4 relative">
      {mediaType === "image" && images.length > 0 ? (
        <div className="space-y-3">
          <div className="relative w-full rounded-xl overflow-hidden bg-gray-100">
            <div 
              className="relative w-full" 
              style={{ aspectRatio: '4/3' }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {images.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    index === validIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                />
              ))}

              {images.length > 1 && (
                <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-20">
                  {validIndex + 1} / {images.length}
                </div>
              )}

              <button
                onClick={handleRemoveCurrent}
                className="absolute bottom-3 right-3 bg-white text-gray-800 rounded-full p-2.5 hover:bg-gray-100 transition-colors z-20"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex justify-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === validIndex
                      ? 'bg-black'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      ) : mediaType === "video" && previewUrl ? (
        <div className="space-y-3">
          <div className="relative w-full rounded-xl overflow-hidden bg-gray-100">
            <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
              <video
                src={previewUrl}
                controls
                className="w-full h-full object-cover"
              />

              <button
                onClick={onRemove}
                className="absolute bottom-3 right-3 bg-white text-gray-800 rounded-full p-2.5 hover:bg-gray-100 transition-colors z-20"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

