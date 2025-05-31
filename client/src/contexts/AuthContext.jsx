import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axiosInstance from "../utils/axiosInstance";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(
        "/api/auth/login",
        { email, password }
      );
      const { access_token, refresh_token } = response.data;
      console.log("login response", response.data, access_token, refresh_token);
      localStorage.setItem("token", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      Cookies.set("access_token", access_token, { path: "/" });
      Cookies.set("refresh_token", refresh_token, { path: "/" });
      setUser({ email });
      localStorage.setItem("user", JSON.stringify({ email }));
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, birthDate, gender) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post("/api/auth/register", {
        name,
        email,
        password,
        birthDate,
        gender,
      });
      alert("Registration successful! Please sign in.");
      window.location.href = "/login";
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    window.location.href = "/login";
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
