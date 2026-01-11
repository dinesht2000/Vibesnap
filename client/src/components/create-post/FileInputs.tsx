interface FileInputsProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  videoInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCameraCapture: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FileInputs({
  fileInputRef,
  videoInputRef,
  cameraInputRef,
  canvasRef,
  onFileSelect,
  onCameraCapture,
}: FileInputsProps) {

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
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
      <canvas ref={canvasRef} className="hidden" />
    </>
  );

}

