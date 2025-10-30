import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";

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

  const sendOTP = async (phoneNumber) => {
    await API.post("/auth/send-otp", { phoneNumber });
  };

  const verifyOTP = async (phoneNumber, otp) => {
    const res = await API.post("/auth/verify-otp", { phoneNumber, otp });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const checkUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const res = await API.get("/auth/me");
      setUser(res.data);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, sendOTP, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
