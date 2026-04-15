// frontend/src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Initialize user from backend (IMPORTANT)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        // Verify token with backend
        const response = await getCurrentUser();

        const userData = response.data;

        setUser({
          token,
          name: userData.name,
          role: userData.role,
          userId: userData.id,
          companyName: userData.companyName || null,
        });
      } catch (error) {
        console.error("Auth restore failed:", error);

        // Token invalid → clear storage
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔹 LOGIN
  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);
      if (user.companyName) {
        localStorage.setItem("companyName", user.companyName);
      }

      setUser({
        token,
        name: user.name,
        role: user.role,
        userId: user.id,
        companyName: user.companyName || null,
      });

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          "Login failed",
      };
    }
  };

  // 🔹 REGISTER
  const register = async (formData) => {
    try {
      const response = await registerUser(formData);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);
      if (user.companyName) {
        localStorage.setItem("companyName", user.companyName);
      }

      setUser({
        token,
        name: user.name,
        role: user.role,
        userId: user.id,
        companyName: user.companyName || null,
      });

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          "Registration failed",
      };
    }
  };

  // 🔹 LOGOUT
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Custom Hook
export const useAuth = () => useContext(AuthContext);