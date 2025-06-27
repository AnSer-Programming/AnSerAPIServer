// src/pages/ClientInfo/ClientInfoThemeContext.js
import React, { createContext, useContext, useState } from 'react';

// 1. Create the context with a default value of null
const ClientInfoThemeContext = createContext(null);

// 2. Provider component
export const ClientInfoThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <ClientInfoThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ClientInfoThemeContext.Provider>
  );
};

// 3. Hook to consume the theme context
export const useClientInfoTheme = () => {
  const context = useContext(ClientInfoThemeContext);
  if (!context) {
    throw new Error('useClientInfoTheme must be used within a ClientInfoThemeProvider');
  }
  return context;
};
