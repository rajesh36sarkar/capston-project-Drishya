import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

axios.defaults.baseURL = API_URL;

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be called within an explicitly mounted AuthProvider tree context.');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeSession = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser(JSON.parse(userData));
        } catch (err) {
          console.error("Local user metadata deserialization state failure:", err);
          logout(); 
        }
      }
      setLoading(false);
    };
    initializeSession();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    
    setUser(res.data.user);
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await axios.post('/auth/register', { username, email, password });
    
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};