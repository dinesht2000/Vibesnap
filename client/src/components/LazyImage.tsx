import { useState, useEffect, useRef } from "react";

interface LazyImageProps {
  src: string;
  alt?: string;
  className?: string;
  rootMargin?: string;
  threshold?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export default function LazyImage({
  src,
  alt = "",
  className = "",
  rootMargin = "50px",
  threshold = 0.01,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const isAbsolute = className.includes("absolute");
  const containerClassName = isAbsolute 
    ? "absolute inset-0" 
    : "relative w-full h-full";

  return (
    <div ref={containerRef} className={containerClassName}>
      {!isInView && !isAbsolute && (
        <div
          className="w-full h-full bg-gray-200 animate-pulse"
          style={{ minHeight: "200px" }}
        />
      )}
      {isInView && (
        <>
          {!isLoaded && !hasError && (
            <div
              className={`${isAbsolute ? "absolute inset-0" : "w-full h-full"} bg-gray-200 animate-pulse`}
              style={!isAbsolute ? { minHeight: "200px" } : undefined}
            />
          )}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={`${className} ${!isLoaded ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
            onLoad={handleLoad}
            onError={handleError}
            loading="lazy"
          />
          {hasError && (
            <div className={`${isAbsolute ? "absolute inset-0" : "w-full h-full"} bg-gray-200 flex items-center justify-center`}>
              <span className="text-gray-400 text-sm">Failed to load image</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

