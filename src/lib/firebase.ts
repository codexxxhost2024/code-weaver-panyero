
import { initializeApp } from "firebase/app";
import { getDatabase as getFirebaseDatabase, Database } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTsjYZNWFfZOESP-2QQfbD7jc5fG9FJdc",
  authDomain: "explore-malaysia-6d28d.firebaseapp.com",
  databaseURL: "https://explore-malaysia-6d28d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "explore-malaysia-6d28d",
  storageBucket: "explore-malaysia-6d28d.appspot.com",
  messagingSenderId: "869053244601",
  appId: "1:869053244601:web:29ad09ff454b43230be768",
  measurementId: "G-5XJK1H7KWX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get database instance
export function getDatabase(): Database {
  return getFirebaseDatabase(app);
}
