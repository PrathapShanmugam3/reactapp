import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import Swal from "sweetalert2";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      Swal.fire({
        title: "Success!",
        text: "You have been logged in successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      return true;
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Invalid credentials. Please try again.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return false;
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await API.post("/auth/register", { username, email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      Swal.fire({
        title: "Success!",
        text: "You have been registered successfully.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      return true;
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Registration failed. Please try again.",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return false;
    }
  };

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const payload = {
        email: result.user.email,
        username: result.user.displayName,
        password: "GOOGLE_AUTH_USER",
        idToken: idToken,
      };

      const res = await API.post("/auth/google-login", payload);
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
      let errorMessage = "Google login failed. Please try again.";
      if (error.response && error.response.data && error.response.data.error === "User already exists") {
        errorMessage = "An account with this email already exists. Please sign in using your original method.";
      }

      Swal.fire({
        title: "Authentication Failed",
        text: errorMessage,
        icon: "error",
        timer: 3000,
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
