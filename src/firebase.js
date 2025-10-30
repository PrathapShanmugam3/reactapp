// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAjpCNLRgPmIWHcf7JxkpR601ZNch_Q6VQ",
  authDomain: "datacode-87922.firebaseapp.com",
  databaseURL: "https://datacode-87922-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "datacode-87922",
  storageBucket: "datacode-87922.appspot.com",
  messagingSenderId: "460766907792",
  appId: "1:460766907792:web:c157833c4b24d7f2a0b715",
  measurementId: "G-5JXHRKS1H0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
