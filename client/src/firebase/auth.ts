import { 
  getAuth, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from "firebase/auth";


import type { User } from "firebase/auth";
import { app } from "./firebase.config";

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

//signin- Google provider
export const signInWithGoogle = async (): Promise<User> => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return userCredential.user;
};

//signup-email
export const signUpWithEmail = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<User> => {

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  return userCredential.user;
};

//signin-email
export const signInWithEmail = async (
  email: string, 
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// logout(every provider)
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

// current User (if logged in)
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

