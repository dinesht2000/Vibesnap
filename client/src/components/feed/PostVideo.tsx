import { useEffect, useRef } from "react";

interface PostVideoProps {
  videoUrl: string;
  alt?: string;
}

export default function PostVideo({ videoUrl }: PostVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    
    if (!video || !container) return;

    // Create Intersection Observer to detect when video enters/leaves viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch((error) => {
              console.log("Autoplay prevented:", error);
            });
          } else {
            // Video is not visible - pause it
            video.pause();
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of video is visible
        rootMargin: "0px",
      }
    );

    observer.observe(container);

    // Cleanup: pause video and disconnect observer on unmount
    return () => {
      if (video) {
        video.pause();
      }
      observer.disconnect();
    };
  }, [videoUrl]);

  return (
    <div ref={containerRef} className="mb-4">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="w-full rounded-lg object-cover"
        preload="metadata"
        muted
        loop
        playsInline
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

