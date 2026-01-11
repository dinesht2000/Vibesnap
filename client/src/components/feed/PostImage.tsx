import { useState } from "react";

interface PostImageProps {
  imageUrl?: string;
  alt?: string;
  imageUrls?: string[];
}

export default function PostImage({ imageUrl, alt = "Post",imageUrls }: PostImageProps) {

  const images = imageUrls && imageUrls.length > 0 
    ? imageUrls 
    : (imageUrl ? [imageUrl] : []);

    const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return null;
  }

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


  return (
     <div className="mb-4 relative">
      <div className="relative w-full h-100 rounded-lg overflow-hidden bg-gray-100">
        {/* Image Container */}
        <div className="relative w-full h-full">
          {images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`${alt} ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows - Only show if more than one image */}
        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity z-10"
              aria-label="Previous image"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity z-10"
              aria-label="Next image"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicator - Only show if more than one image */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </div>
  );
}

