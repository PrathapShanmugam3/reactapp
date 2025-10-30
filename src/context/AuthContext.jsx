import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

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
    const result = await signInWithPopup(auth, googleProvider);
    // You can now access the user's information from the result object
    // For example, you can get the user's name and email like this:
    // const name = result.user.displayName;
    // const email = result.user.email;
    // You can also get an access token to make requests to Google APIs:
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential.accessToken;
    setUser(result.user);
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
    <AuthContext.Provider value={{ user, login, register, googleSignIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
