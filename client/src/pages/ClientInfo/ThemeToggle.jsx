// src/pages/ClientInfo/ThemeToggle.jsx
import React from 'react';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import { Button } from '@mui/material';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useClientInfoTheme();

  return (
    <Button
      onClick={toggleDarkMode}
      variant="outlined"
      color="secondary"
      style={{ float: 'right', marginBottom: '10px' }}
    >
      {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </Button>
  );
};

export default ThemeToggle;
