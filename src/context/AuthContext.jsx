import React, { createContext, useState, useEffect } from "react";
import API from "../api/axios";
import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  linkWithCredential,
} from "firebase/auth";
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
        text:
          error.response?.data?.error || "Invalid credentials. Please try again.",
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
        text:
          error.response?.data?.error || "Registration failed. Please try again.",
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
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData.email;
        const credential = error.credential;

        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.includes('password')) {
          const { value: password } = await Swal.fire({
            title: 'Account Exists',
            text: "You already have an account with this email. Please enter your password to link your Google account.",
            input: 'password',
            inputPlaceholder: 'Enter your password',
            inputAttributes: {
              autocapitalize: 'off',
              autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Link Accounts',
            cancelButtonText: 'Cancel'
          });

          if (password) {
            try {
              const userCredential = await signInWithEmailAndPassword(auth, email, password);
              await linkWithCredential(userCredential.user, credential);
              const idToken = await userCredential.user.getIdToken();
              const payload = {
                email: userCredential.user.email,
                username: userCredential.user.displayName,
                password: "GOOGLE_AUTH_USER",
                idToken: idToken,
              };

              const res = await API.post("/auth/google-login", payload);
              localStorage.setItem("token", res.data.token);
              setUser(res.data.user);

              Swal.fire({
                title: "Success!",
                text: "Your accounts have been linked and you are now logged in.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
              });

            } catch (linkError) {
              console.error("Error linking accounts:", linkError);
              Swal.fire({
                title: "Error!",
                text: "Could not link accounts. Please check your password.",
                icon: "error",
                timer: 3000,
                showConfirmButton: false,
              });
            }
          }
        } else {
           Swal.fire({
            title: 'Authentication Failed',
            text: `This email is associated with another provider. Please use that provider to sign in.`,
            icon: 'error'
          });
        }
      } else {
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