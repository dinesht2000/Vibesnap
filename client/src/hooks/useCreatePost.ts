import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../firebase/database";
import { uploadPostImage, uploadPostVideo } from "../firebase/storage";
import { compressImage } from "../utils/compressImage";
import { compressVideo } from "../utils/compressVideo";
import type { User } from "firebase/auth";
import type { MediaType } from "../types/media";

export interface UseCreatePostReturn {
  content: string;
  setContent: (content: string) => void;
  isUploading: boolean;
  handleCreatePost: (
    user: User,
    selectedFiles: File[],
    mediaType: MediaType,
    previewUrls: string[]
  ) => Promise<void>;
}

export function useCreatePost(): UseCreatePostReturn {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleCreatePost = async (
    user: User,
    selectedFiles: File[],
    mediaType: MediaType,
    previewUrls: string[]
  ) => {
    // Validate that there's at least content or media
    if (!content.trim() && selectedFiles.length === 0) {
      alert("Please add some content or media to your post");
      return;
    }

    setIsUploading(true);

    try {
      if (selectedFiles.length > 0 && mediaType === "image") {
        const compressedFiles = await Promise.all(
          selectedFiles.map((file) => compressImage(file))
        );

        const postId = await createPost(user.uid, {
          userId: user.uid,
          content: content.trim(),
        });

        if (postId) {
          const imageUrls = await Promise.all(
            compressedFiles.map((file, index) =>
              uploadPostImage(user.uid, postId, file, index)
            )
          );


          const { getDatabase, ref, update } = await import("firebase/database");
          const database = getDatabase();
          const postRef = ref(database, `users/${user.uid}/posts/${postId}`);
          await update(postRef, { imageUrls });
          
          if (imageUrls.length > 0) {
            await update(postRef, { imageUrl: imageUrls[0] });
          }
        }
      } else if (selectedFiles.length > 0 && mediaType === "video") {
        const selectedFile = selectedFiles[0];
        const compressedFile = await compressVideo(selectedFile);
        const postId = await createPost(user.uid, {
          userId: user.uid,
          content: content.trim(),
        });

        if (postId) {
          const videoUrl = await uploadPostVideo(user.uid, postId, compressedFile);
          const { getDatabase, ref, update } = await import("firebase/database");
          const database = getDatabase();
          const postRef = ref(database, `users/${user.uid}/posts/${postId}`);
          await update(postRef, { videoUrl });
        }
      } else {
        await createPost(user.uid, {
          userId: user.uid,
          content: content.trim(),
        });
      }

      previewUrls.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });

      navigate("/feed");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    content,
    setContent,
    isUploading,
    handleCreatePost,
  };
}

