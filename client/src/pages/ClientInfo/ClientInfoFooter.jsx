// src/pages/ClientInfo/ClientInfoFooter.jsx
import React from 'react';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import './ClientInfoReact.css';

const ClientInfoFooter = () => {
  const { darkMode } = useClientInfoTheme();

  return (
    <footer className={`${darkMode ? 'footer-dark' : 'footer-light'} mt-auto py-3`}>
      <div className="container text-center small">
        <div>© {new Date().getFullYear()} AnSer Services | All rights reserved.</div>
        <div>
          Need help?{' '}
          <a
            href="mailto:support@anser.com"
            className={`text-decoration-underline ${darkMode ? 'text-light' : 'text-white'}`}
          >
            Contact Support
          </a>
        </div>
        <div className="mt-1">Version 1.0.0 • Last updated: June 2025</div>
      </div>
    </footer>
  );
};

export default ClientInfoFooter;
