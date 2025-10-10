// src/pages/ClientInfo/ThemeToggle.jsx
import React from 'react';
import { useClientInfoTheme } from './context_API/ClientInfoThemeContext';
import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useClientInfoTheme();

  return (
    <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
      <IconButton
        onClick={toggleDarkMode}
        color="inherit"
        sx={{ float: 'right', mb: 1 }}
        aria-label="toggle theme"
      >
        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
