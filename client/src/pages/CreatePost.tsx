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
    removeImage,
    removeMedia,
    stopCamera,
    capturePhoto,
  } = useMediaUpload();

  const { content, setContent, isUploading, handleCreatePost } = useCreatePost();

  if (!authLoading && user && profileComplete === false) {
    return <Navigate to="/profile-setup" replace />;
  }

  const onCreatePost = async () => {
    if (!user) return;
    await handleCreatePost(user, selectedFiles.length > 0 ? selectedFiles : (selectedFile ? [selectedFile] : []), mediaType, previewUrls.length > 0 ? previewUrls : (previewUrl ? [previewUrl] : []));
  };

  return (
    <div className="min-h-screen bg-white">
      <CreatePostHeader />

      <div className="px-4 py-6 pb-24">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full min-h-50 p-4 bg-gray-100 rounded-lg border-none outline-none resize-none text-black placeholder-gray-400 text-base"
          style={{ fontFamily: "inherit" }}
        />

        {previewUrl  || previewUrls.length > 0 && mediaType && (
          <MediaPreview
            previewUrl={previewUrl}
            previewUrls={previewUrls}
            mediaType={mediaType}
            onRemove={removeMedia}
            onRemoveImage={removeImage}

          />
        )}

        <MediaSelector
          onPhotosClick={handlePhotosClick}
          onVideoClick={handleVideoClick}
          onCameraClick={handleCameraClick}
        />

        <FileInputs
          fileInputRef={fileInputRef}
          videoInputRef={videoInputRef}
          cameraInputRef={cameraInputRef}
          canvasRef={canvasRef}
          onFileSelect={handleFileSelect}
          onCameraCapture={handleCameraCapture}
        />
      </div>

      <CameraModal
        isActive={isCameraActive}
        videoPreviewRef={videoPreviewRef}
        onClose={stopCamera}
        onCapture={capturePhoto}
      />

      <CreatePostButton
        isUploading={isUploading}
        disabled={isUploading || (!content.trim() && !selectedFile)}
        onClick={onCreatePost}
      />
    </div>
  );
}

