// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyATWJJpxYOg8WOddyRB-ppYhRra3lZeehg",
  authDomain: "datacode-87922.firebaseapp.com",
  databaseURL: "https://datacode-87922-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "datacode-87922",
  storageBucket: "datacode-87922.appspot.com",
  messagingSenderId: "460766907792",
  appId: "1:460766907792:web:a4c633957360f1c6a0b715",
  measurementId: "G-SKXTPJLLJW"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
