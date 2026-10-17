import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const stored = localStorage.getItem('noteit_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          // Verify with server profile
          try {
            const { data } = await api.get('/auth/profile');
            setUser(prev => ({ ...prev, ...data }));
          } catch (err) {
            // Token expired or invalid
            if (err.response?.status === 401) {
              logout();
            }
          }
        }
      } catch (err) {
        console.error('Failed to load user info:', err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('noteit_user', JSON.stringify(data));
      toast.success(`Welcome back, ${data.name}!`);
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to login';
      toast.error(msg);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('noteit_user', JSON.stringify(data));
      toast.success(`Welcome to Note It, ${data.name}!`);
      return data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('noteit_user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
