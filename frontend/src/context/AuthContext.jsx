import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "ssi_admin_token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setAdmin(false);
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.get(`${API}/admin/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin(data);
    } catch (e) {
      localStorage.removeItem(TOKEN_KEY);
      setAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/admin/login`, { email, password });
    localStorage.setItem(TOKEN_KEY, data.access_token);
    setAdmin(data.admin);
    return data.admin;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAdmin(false);
  };

  const getToken = () => localStorage.getItem(TOKEN_KEY);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
