import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCchMQcK2KtC3kvOOpmjD-iQcDsVlaq2HQ",
  authDomain: "finalproject-teamd.firebaseapp.com",
  projectId: "finalproject-teamd",
  storageBucket: "finalproject-teamd.firebasestorage.app",
  messagingSenderId: "725734820052",
  appId: "1:725734820052:web:091580e050bc218c921341"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);