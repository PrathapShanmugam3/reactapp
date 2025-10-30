import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import Swal from "sweetalert2";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const register = async (username, email, password) => {
    const res = await API.post("/auth/register", { username, email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // Send token to backend
      const res = await API.post("/auth/google-login", { idToken });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      Swal.fire({
        title: "Success!",
        text: "You have been logged in successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Google login failed:", error);
      Swal.fire({
        title: "Error!",
        text: "Google login failed. Please try again.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const checkUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await API.get("/auth/me");
        setUser(res.data);
      } catch (error) {
        // If the token is invalid, remove it.
        localStorage.removeItem("token");
        setUser(null);
      }
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, googleSignIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
