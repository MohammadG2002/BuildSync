import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthHandlers } from "./authContextModule";

export const AuthContext = createContext();

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
      const user = await AuthHandlers.checkAuth();
      setUser(user);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const result = await AuthHandlers.login(credentials);
      localStorage.setItem("token", result.token);
      setUser(result.user);
      toast.success(result.message);
      navigate("/app/dashboard");
    } catch (error) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const result = await AuthHandlers.register(userData);
      localStorage.setItem("token", result.token);
      setUser(result.user);
      toast.success(result.message);
      navigate("/app/dashboard");
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
