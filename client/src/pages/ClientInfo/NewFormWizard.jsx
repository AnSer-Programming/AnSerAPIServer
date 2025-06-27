import React from 'react';
import ClientInfoNavbar from './ClientInfoNavbar';
import ClientInfoFooter from './ClientInfoFooter';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import './ClientInfoReact.css';

const NewFormWizard = () => {
  const { darkMode } = useClientInfoTheme();

  return (
    <div className={`client-info-react-container d-flex flex-column min-vh-100 ${darkMode ? 'dark' : 'light'}`}>
      <ClientInfoNavbar />
      <div className="container my-5">
        <h2 className="text-center fw-bold mb-4">New Form Wizard</h2>
        <p className="text-center text-muted">This page will guide you through setting up a new form step by step.</p>
        {/* TODO: Wizard component goes here */}
      </div>
      <ClientInfoFooter />
    </div>
  );
};

export default NewFormWizard;
