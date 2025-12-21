import { createContext, useContext, useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      fetchAdmin();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAdmin = async () => {
    try {
      const response = await adminAPI.getMe();
      setAdmin(response.data);
    } catch (error) {
      console.error('Failed to fetch admin:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await adminAPI.login(email, password);
      localStorage.setItem('adminToken', response.data.token);
      setAdmin(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

