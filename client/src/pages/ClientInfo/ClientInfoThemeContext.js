// src/pages/ClientInfo/ClientInfoThemeContext.js
import React, { createContext, useContext, useState } from 'react';

const ClientInfoThemeContext = createContext();

export const ClientInfoThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(prev => !prev);

  return (
    <ClientInfoThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ClientInfoThemeContext.Provider>
  );
};

export const useClientInfoTheme = () => useContext(ClientInfoThemeContext);
