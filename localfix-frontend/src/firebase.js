// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzFNGzSKvTVxCftl43_nER9b8BPcgJLzM",
  authDomain: "localfix-e324c.firebaseapp.com",
  projectId: "localfix-e324c",
  storageBucket: "localfix-e324c.firebasestorage.app",
  messagingSenderId: "218945768178",
  appId: "1:218945768178:web:348246f6fdd5b14a7c1e6b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();