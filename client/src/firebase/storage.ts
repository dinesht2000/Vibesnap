import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "./firebase.config";

// Initialize Firebase Storage
export const storage = getStorage(app);

export const uploadProfileImage = async (userId: string, file: File): Promise<string> => {

  const oldImageRef = ref(storage, `users/${userId}/profile.jpg`);
  try {
    await deleteObject(oldImageRef);
  } catch (error) {
    console.error("Error deleting old profile image:", error);
  }

  const imageRef = ref(storage, `users/${userId}/profile.jpg`);
  await uploadBytes(imageRef, file);
  const downloadURL = await getDownloadURL(imageRef);
  return downloadURL;
};
export const uploadBannerImage = async (userId: string, file: File): Promise<string> => {

  const oldImageRef = ref(storage, `users/${userId}/banner.jpg`);
  try {
    await deleteObject(oldImageRef);
  } catch (error) {
    console.error("Error deleting old banner image:", error);
  }
  const imageRef = ref(storage, `users/${userId}/banner.jpg`);
  await uploadBytes(imageRef, file);
  const downloadURL = await getDownloadURL(imageRef);
  return downloadURL;
};

export const uploadPostImage = async (userId: string, postId: string, file: File): Promise<string> => {
  const imageRef = ref(storage, `users/${userId}/posts/${postId}.jpg`);
  await uploadBytes(imageRef, file);
  const downloadURL = await getDownloadURL(imageRef);
  return downloadURL;
};

export const uploadPostVideo = async (userId: string, postId: string, file: File): Promise<string> => {
  // Get file extension from the original file
  const fileExtension = file.name.split('.').pop() || 'mp4';
  const videoRef = ref(storage, `users/${userId}/posts/${postId}.${fileExtension}`);
  await uploadBytes(videoRef, file);
  const downloadURL = await getDownloadURL(videoRef);
  return downloadURL;
};
