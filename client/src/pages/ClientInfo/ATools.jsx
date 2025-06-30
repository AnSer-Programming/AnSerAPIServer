// src/pages/ClientInfo/ATools.jsx

import React from 'react';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import ClientInfoNavbar from './ClientInfoNavbar';
import ClientInfoFooter from './ClientInfoFooter';
import './ClientInfoReact.css';

import { Typography, Box } from '@mui/material';

function ATools() {
  const { darkMode } = useClientInfoTheme();

  return (
    <div className={`client-info-react-container d-flex flex-column min-vh-100 ${darkMode ? 'dark' : 'light'}`}>
      <ClientInfoNavbar />

      <div className="container mt-4 flex-grow-1">
        <div className="breadcrumbNav">
          <Typography variant="h5" id="breadcrumb">Admin Tools</Typography>
        </div>

        <div className="pageTitle mb-4">
          <Typography variant="h4">Admin Tools</Typography>
          <p>This is where we can place admin-specific utilities, JSON editors, import/export tools, etc.</p>
        </div>
      </div>

      <ClientInfoFooter />
    </div>
  );
}

export default ATools;
