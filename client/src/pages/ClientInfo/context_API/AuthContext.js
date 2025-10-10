// src/pages/ClientInfo/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('loggedIn');
    if (stored === 'true') setLoggedIn(true);
  }, []);

  const login = () => {
    setLoggedIn(true);
    localStorage.setItem('loggedIn', true);
  };

  const logout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
