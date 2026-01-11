interface CameraModalProps {
  isActive: boolean;
  videoPreviewRef: React.RefObject<HTMLVideoElement| null>;
  onClose: () => void;
  onCapture: () => void;
}

export default function CameraModal({
  isActive,
  videoPreviewRef,
  onClose,
  onCapture,
}: CameraModalProps) {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 bg-black bg-opacity-50">
        <button
          onClick={onClose}
          className="text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          aria-label="Close camera"
        >
          <svg
            className="w-6 h-6"
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
        <h2 className="text-white font-semibold text-lg">Camera</h2>
        <div className="w-10" /> 
      </div>
      <div className="flex-1 flex items-center justify-center relative">
        <video
          ref={videoPreviewRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      </div>


      <div className="p-6 bg-black bg-opacity-50 flex items-center justify-center gap-6">
        <button
          onClick={onCapture}
          className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center hover:scale-105 transition-transform"
          aria-label="Capture photo"
        >
          <div className="w-12 h-12 rounded-full bg-white"></div>
        </button>
      </div>
    </div>
  );
}

