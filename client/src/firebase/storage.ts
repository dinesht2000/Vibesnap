import { getStorage } from "firebase/storage";
import { app } from "./firebase.config";

// Initialize Firebase Storage
export const storage = getStorage(app);