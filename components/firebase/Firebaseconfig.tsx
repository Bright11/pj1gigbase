import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: "AIzaSyBwSvBri1THEUVi-TonIv6ccLMkm7YywOM",
  authDomain: "pj1appgigbase.firebaseapp.com",
  projectId: "pj1appgigbase",
  storageBucket: "pj1appgigbase.appspot.com",
  messagingSenderId: "217741691153",
  appId: "1:217741691153:web:e4f0821bb2a0359365e4b0"
};
// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Auth with platform check
let auth;
if (Platform.OS === "ios" || Platform.OS === "android") {
  // Native apps → use AsyncStorage persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  // Web / SSR → fallback
  auth = getAuth(app);
}

// Other Firebase services
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db, auth };