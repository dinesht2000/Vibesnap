// FileInputs doesn't actually use MediaType, but keeping import for consistency if needed

interface FileInputsProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  videoInputRef: React.RefObject<HTMLInputElement>;
  cameraInputRef: React.RefObject<HTMLInputElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCameraCapture: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileInputs({
  fileInputRef,
  videoInputRef,
  cameraInputRef,
  onFileSelect,
  onCameraCapture,
}: FileInputsProps) {
  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileSelect}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={onFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onCameraCapture}
        className="hidden"
      />

    </>
  );
}

