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