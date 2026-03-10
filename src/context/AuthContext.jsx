import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_BACKEND_URL;

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const token = localStorage.getItem("wtf_admin_token");
    const storedUser = localStorage.getItem("wtf_admin_user");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);

    // Setup global axios interceptor for 401s (token expiry)
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("wtf_admin_token");
          localStorage.removeItem("wtf_admin_user");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/admin-login`, {
        email,
        password,
      });

      const { token, user: userData } = response.data;

      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem("wtf_admin_token", token);
      localStorage.setItem("wtf_admin_user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      let message = "Login failed. Please try again.";
      if (error.response) {
        // Server responded with a status code outside 2xx range
        message = error.response.data?.message || message;
      } else if (error.request) {
        // Request was made but no response received
        message =
          "Cannot connect to server. Please check if backend is running.";
      } else {
        // Something happened in setting up the request
        message = error.message;
      }
      return { success: false, message };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("wtf_admin_token");
    localStorage.removeItem("wtf_admin_user");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
