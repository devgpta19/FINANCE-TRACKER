import React, { createContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Will store { email, role, token }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const email = localStorage.getItem('email');

    if (token && role && email) {
      setUser({ token, role, email });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, role, email: authEmail } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('email', authEmail || email);
      
      setUser({ token, role, email: authEmail || email });
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  const register = async (name, email, password, role) => {
      try {
        const response = await apiClient.post('/auth/register', { name, email, password, role });
        return response.data;
      } catch (error) {
        console.error("Registration Error:", error);
        throw error;
      }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
        {!loading && children}
    </AuthContext.Provider>
  );
};
