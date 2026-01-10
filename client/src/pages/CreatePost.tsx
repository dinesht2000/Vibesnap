import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useMediaUpload } from "../hooks/useMediaUpload";
import { useCreatePost } from "../hooks/useCreatePost";
import {
  CreatePostHeader,
  MediaPreview,
  MediaSelector,
  CameraModal,
  CreatePostButton,
  FileInputs,
} from "../components/create-post";

export default function CreatePost() {
  const { user, profileComplete, loading: authLoading } = useAuth();
  const {
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
    stopCamera,
    capturePhoto,
  } = useMediaUpload();

  const { content, setContent, isUploading, handleCreatePost } = useCreatePost();

  // Redirect if not authenticated
  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  if (!authLoading && user && profileComplete === false) {
    return <Navigate to="/profile-setup" replace />;
  }

  const onCreatePost = async () => {
    if (!user) return;
    await handleCreatePost(user, selectedFile, mediaType, previewUrl);
  };

  return (
    <div className="min-h-screen bg-white">
      <CreatePostHeader />

      {/* Main Content */}
      <div className="px-4 py-6 pb-24">
        {/* Text Input */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full min-h-[200px] p-4 bg-gray-100 rounded-lg border-none outline-none resize-none text-black placeholder-gray-400 text-base"
          style={{ fontFamily: "inherit" }}
        />

        {/* Media Preview */}
        {previewUrl && mediaType && (
          <MediaPreview
            previewUrl={previewUrl}
            mediaType={mediaType}
            onRemove={removeMedia}
          />
        )}

        {/* Media Options */}
        <MediaSelector
          onPhotosClick={handlePhotosClick}
          onVideoClick={handleVideoClick}
          onCameraClick={handleCameraClick}
        />

        {/* Hidden File Inputs */}
        <FileInputs
          fileInputRef={fileInputRef}
          videoInputRef={videoInputRef}
          cameraInputRef={cameraInputRef}
          canvasRef={canvasRef}
          onFileSelect={handleFileSelect}
          onCameraCapture={handleCameraCapture}
        />
      </div>

      {/* Camera Modal/Overlay */}
      <CameraModal
        isActive={isCameraActive}
        videoPreviewRef={videoPreviewRef}
        onClose={stopCamera}
        onCapture={capturePhoto}
      />

      {/* Create Button */}
      <CreatePostButton
        isUploading={isUploading}
        disabled={isUploading || (!content.trim() && !selectedFile)}
        onClick={onCreatePost}
      />
    </div>
  );
}

