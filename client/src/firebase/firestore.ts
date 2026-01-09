import { getFirestore } from "firebase/firestore";
import { app } from "./firebase.config";

// Initialize Firestore
export const db = getFirestore(app);

