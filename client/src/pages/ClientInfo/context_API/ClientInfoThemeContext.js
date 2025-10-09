// src/pages/ClientInfo/context_API/ClientInfoThemeContext.js
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import buildAnSerTheme from './AnSerTheme';

const ClientInfoThemeContext = createContext(null);

export const ClientInfoThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() =>
    JSON.parse(localStorage.getItem('clientInfoDarkMode') || 'false')
  );
  useEffect(() => localStorage.setItem('clientInfoDarkMode', JSON.stringify(darkMode)), [darkMode]);
  const toggleDarkMode = () => setDarkMode(v => !v);

  const theme = useMemo(() => buildAnSerTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  return (
    <ClientInfoThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ClientInfoThemeContext.Provider>
  );
};

export const useClientInfoTheme = () => useContext(ClientInfoThemeContext);
