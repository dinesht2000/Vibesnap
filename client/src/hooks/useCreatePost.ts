import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../firebase/database";
import { uploadPostImage, uploadPostVideo } from "../firebase/storage";
import type { User } from "firebase/auth";
import type { MediaType } from "../types/media";

export interface UseCreatePostReturn {
  content: string;
  setContent: (content: string) => void;
  isUploading: boolean;
  handleCreatePost: (
    user: User,
    selectedFile: File | null,
    mediaType: MediaType,
    previewUrl: string | null
  ) => Promise<void>;
}

export function useCreatePost(): UseCreatePostReturn {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleCreatePost = async (
    user: User,
    selectedFile: File | null,
    mediaType: MediaType,
    previewUrl: string | null
  ) => {

    if (!content.trim() && !selectedFile) {
      alert("Please add some content or media to your post");
      return;
    }

    setIsUploading(true);

    try {
      if (selectedFile && mediaType === "image") {
        const postId = await createPost(user.uid, {
          userId: user.uid,
          content: content.trim(),
        });

        if (postId) {
          const imageUrl = await uploadPostImage(user.uid, postId, selectedFile);
          const { getDatabase, ref, update } = await import("firebase/database");
          const database = getDatabase();
          const postRef = ref(database, `users/${user.uid}/posts/${postId}`);
          await update(postRef, { imageUrl });
        }
      } else if (selectedFile && mediaType === "video") {
        const postId = await createPost(user.uid, {
          userId: user.uid,
          content: content.trim(),
        });
        if (postId) {
          const videoUrl = await uploadPostVideo(user.uid, postId, selectedFile);
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


      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }


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

