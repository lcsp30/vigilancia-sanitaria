// src/contexts/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser]   = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const saveSession = (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const register = async (name, name_user, password, password_confirmation) => {
    const { data } = await api.post('register', {
      name, name_user, password, password_confirmation,
    });
    saveSession(data.user, data.token);
    navigate('/');
  };

  const login = async (name_user, password) => {
    const { data } = await api.post('login', { name_user, password });
    saveSession(data.user, data.token);
    navigate('/');
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!token,
      register,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);