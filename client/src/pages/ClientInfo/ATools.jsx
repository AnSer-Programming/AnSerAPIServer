// src/pages/ClientInfo/ATools.jsx

import React from 'react';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import ClientInfoNavbar from './ClientInfoNavbar';
import ClientInfoFooter from './ClientInfoFooter';

import { Typography, Box, Container, Paper } from '@mui/material';

function ATools() {
  const { darkMode } = useClientInfoTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ClientInfoNavbar />

      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Tools
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This is where we can place admin-specific utilities, JSON editors, import/export tools, etc.
          </Typography>
        </Paper>
      </Container>

      <ClientInfoFooter />
    </Box>
  );
}

export default ATools;
