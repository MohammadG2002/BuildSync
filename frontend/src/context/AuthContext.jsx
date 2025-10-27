import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/authService";
import toast from "react-hot-toast";

export const AuthContext = createContext();

// Demo mode flag - set to false to connect to real backend
const DEMO_MODE = false;

// Mock user data for demo
const DEMO_USER = {
  id: "demo-user-1",
  name: "Demo User",
  email: "demo@buildsync.com",
  avatar: null,
  role: "owner",
  createdAt: new Date().toISOString(),
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (DEMO_MODE) {
        // Demo mode: check for demo token
        const token = localStorage.getItem("token");
        if (token === "demo-token") {
          setUser(DEMO_USER);
        }
      } else {
        // Production mode: call API
        const token = localStorage.getItem("token");
        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      }
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      if (DEMO_MODE) {
        // Demo mode: accept any credentials
        localStorage.setItem("token", "demo-token");
        setUser(DEMO_USER);
        toast.success("Welcome to BuildSync Demo!");
        navigate("/app/dashboard");
      } else {
        // Production mode: call API
        const response = await authService.login(credentials);
        localStorage.setItem("token", response.token);
        setUser(response.user);
        toast.success("Welcome back!");
        navigate("/app/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      if (DEMO_MODE) {
        // Demo mode: create mock user with provided data
        const demoUser = {
          id: "demo-user-" + Date.now(),
          name: userData.name,
          email: userData.email,
          avatar: null,
          role: "owner",
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem("token", "demo-token");
        setUser(demoUser);
        toast.success("Welcome to BuildSync Demo!");
        navigate("/app/dashboard");
      } else {
        // Production mode: call API
        const response = await authService.register(userData);
        localStorage.setItem("token", response.token);
        setUser(response.user);
        toast.success("Account created successfully!");
        navigate("/app/dashboard");
      }
    } catch (error) {
      toast.error(error.message || "Registration failed");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const updateUser = (updatedData) => {
    setUser({ ...user, ...updatedData });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
