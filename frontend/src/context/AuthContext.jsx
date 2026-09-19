import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sih_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setUser(res.data);
      localStorage.setItem('sih_user', JSON.stringify(res.data));
      return { success: true, user: res.data };
    } catch (err) {
      const msg = err.response?.data || 'Login failed. Please check credentials.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = async (role) => {
    let email = 'owner@example.com';
    let password = 'owner123';
    if (role === 'OFFICER') {
      email = 'officer@example.com';
      password = 'officer123';
    } else if (role === 'ADMIN') {
      email = 'admin@example.com';
      password = 'admin123';
    }
    return login(email, password);
  };

  const register = async (name, email, password, role = 'INSTRUMENT_OWNER') => {
    setLoading(true);
    try {
      const res = await api.register({ name, email, password, role });
      setUser(res.data);
      localStorage.setItem('sih_user', JSON.stringify(res.data));
      return { success: true, user: res.data };
    } catch (err) {
      const msg = err.response?.data || 'Registration failed.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sih_user');
  };

  const isOwner = user?.role === 'INSTRUMENT_OWNER';
  const isOfficer = user?.role === 'OFFICER';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        quickDemoLogin,
        register,
        logout,
        isAuthenticated: !!user,
        isOwner,
        isOfficer,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
