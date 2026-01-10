import { useState, useRef, useEffect } from "react";
import type { MediaType } from "../types/media";

export type { MediaType };

export interface UseMediaUploadReturn {
  selectedFile: File | null;
  previewUrl: string | null;
  mediaType: MediaType;
  isCameraActive: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  videoInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  videoPreviewRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePhotosClick: () => void;
  handleVideoClick: () => void;
  handleCameraClick: () => void;
  handleCameraCapture: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeMedia: () => void;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capturePhoto: () => void;
}

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export function useMediaUpload(): UseMediaUploadReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setMediaType("image");
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else if (file.type.startsWith("video/")) {
        setMediaType("video");
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handlePhotosClick = () => {
    fileInputRef.current?.click();
  };

  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // Use front camera by default
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions or try selecting from gallery.");
      // Fallback to file input
      cameraInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
    if (videoPreviewRef.current) {
      videoPreviewRef.current.srcObject = null;
    }
  };

  const capturePhoto = () => {
    if (!videoPreviewRef.current || !canvasRef.current) return;

    const video = videoPreviewRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Convert canvas to blob, then to File
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          setMediaType("image");
          setSelectedFile(file);
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
          stopCamera();
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const handleCameraClick = () => {
    if (isMobile()) {
      // On mobile, use file input with capture attribute
      cameraInputRef.current?.click();
    } else {
      // On web/desktop, access webcam
      startCamera();
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaType("image");
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeMedia = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    // Stop camera if active
    if (isCameraActive) {
      stopCamera();
    }
  };

  return {
    selectedFile,
    previewUrl,
    mediaType,
    isCameraActive,
    fileInputRef,
    videoInputRef,
    cameraInputRef,
    videoPreviewRef,
    canvasRef,
    handleFileSelect,
    handlePhotosClick,
    handleVideoClick,
    handleCameraClick,
    handleCameraCapture,
    removeMedia,
    startCamera,
    stopCamera,
    capturePhoto,
  };
}

