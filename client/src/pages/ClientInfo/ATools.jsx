// src/pages/ClientInfo/ATools.jsx

import React from 'react';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import { LightMode, DarkMode } from '@mui/icons-material';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Stack
} from '@mui/material';
import { Link } from 'react-router-dom';

function ATools() {
  const { darkMode, toggleTheme } = useClientInfoTheme();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ATools
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button color="inherit" component={Link} to="/ClientInfoReact">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/ClientInfoReact/ClientSetUp">
              Company Info
            </Button>
            <Button color="inherit" component={Link} to="/ClientInfoReact/OfficeReach">
              Office Reach Info
            </Button>
            <Button color="inherit" component={Link} to="/ClientInfoReact/AnswerCalls">
              How to Answer Calls
            </Button>
            <Button color="inherit" component={Link} to="/ClientInfoReact/TestPage">
              Test Page
            </Button>
            <Button color="inherit" href="/">
              AnSer API
            </Button>
            <IconButton color="inherit" onClick={toggleTheme}>
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Admin Tools
        </Typography>
        <Typography variant="body1">
          This is where we can place admin-specific utilities, JSON editors, import/export tools, etc.
        </Typography>
      </Box>
    </Box>
  );
}

export default ATools;
