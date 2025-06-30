import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the context with a default value of null
const ClientInfoThemeContext = createContext(null);

// 2. Provider component
export const ClientInfoThemeProvider = ({ children }) => {
  // Load initial value from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('clientInfoDarkMode');
    return stored ? JSON.parse(stored) : false;
  });

  // Persist value to localStorage on change
  useEffect(() => {
    localStorage.setItem('clientInfoDarkMode', JSON.stringify(darkMode));
  }, [darkMode]);

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
