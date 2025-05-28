import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { BACKEND_URL } from "../utils/constants";
import axios from "axios";
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
      axios
        .post(
          `${BACKEND_URL}/api/auth/login`,
          { email, password },
          { withCredentials: true }
        )
        .then((response) => {
          const { access_token, refresh_token } = response.data;
          localStorage.setItem("token", access_token);
          localStorage.setItem("refreshToken", refresh_token);
          Cookies.set("access_token", access_token, { path: "/" });
          Cookies.set("refresh_token", refresh_token, { path: "/" });
          setUser({ email });
          localStorage.setItem("user", JSON.stringify({ email }));
          window.location.href = "/dashboard";
        })
        .catch((error) => {
          setError(error instanceof Error ? error.message : "Login failed");
        });
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
      axios
        .post(`${BACKEND_URL}/api/auth/register`, {
          name,
          email,
          password,
          birthDate,
          gender,
        })
        .then(() => {
          alert("Registration successful! Please sign in.");
          window.location.href = "/login";
        })
        .catch((error) => {
          console.error(error);
          setError(
            error instanceof Error ? error.message : "Registration failed"
          );
        });
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    Cookies.remove("access_token");
    Cookies.remove("refreshToken");
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
