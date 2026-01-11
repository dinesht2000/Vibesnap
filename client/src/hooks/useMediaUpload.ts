import { useState, useRef, useEffect } from "react";
import type { MediaType } from "../types/media";

export type { MediaType };

export interface UseMediaUploadReturn {
  selectedFile: File | null;
  selectedFiles: File[];
  previewUrl: string | null;
  previewUrls: string[];
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
  removeImage: (index: number) => void;
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
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
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const videoFile = fileArray.find((file) => file.type.startsWith("video/"));
    
    if (videoFile) {
      setMediaType("video");
      previewUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      setSelectedFiles([]);
      setPreviewUrls([]);
      setSelectedFile(videoFile);
      const url = URL.createObjectURL(videoFile);
      setPreviewUrl(url);
      return;
    }

    const imageFiles = fileArray.filter((file) => file.type.startsWith("image/"));    
    if (imageFiles.length > 0) {
      setMediaType("image");
      const newFiles: File[] = [];
      const newPreviewUrls: string[] = [];
      imageFiles.forEach((file) => {
        newFiles.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      });
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
      if (newFiles.length > 0) {
        setSelectedFile(newFiles[0]);
        setPreviewUrl(newPreviewUrls[0]);
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
        video: { facingMode: "user" },
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions or try selecting from gallery.");
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
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0);

    // Convert canvas to blob, then to File
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
            type: "image/jpeg",
          });
          setMediaType("image");
          const url = URL.createObjectURL(file);
          setSelectedFile(file);
          setPreviewUrl(url);
          setSelectedFiles((prev) => [...prev, file]);
          setPreviewUrls((prev) => [...prev, url]);
          stopCamera();
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const handleCameraClick = () => {
    if (isMobile()) {
      cameraInputRef.current?.click();
    } else {
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
      setSelectedFiles((prev) => [...prev, file]);
      setPreviewUrls((prev) => [...prev, url]);
    }
  };

  const removeMedia = () => {
     previewUrls.forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setSelectedFiles([]);
    setPreviewUrl(null);
    setPreviewUrls([]);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    if (isCameraActive) {
      stopCamera();
    }
  };
  const removeImage = (index: number) => {
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
    
    if (newFiles.length > 0) {
      setSelectedFile(newFiles[0]);
      setPreviewUrl(newUrls[0]);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
      setMediaType(null);
    }
  };

  return {
    selectedFile,
    selectedFiles,
    previewUrl,
    previewUrls,
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
    removeImage,
    startCamera,
    stopCamera,
    capturePhoto,
  };
}

