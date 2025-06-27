// src/pages/ClientInfo/AnswerCalls.jsx
import React from 'react';
import {
  Box,
  Typography
} from '@mui/material';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import ClientInfoNavbar from './ClientInfoNavbar';
import './ClientInfoReact.css';

const AnswerCalls = () => {
  const { darkMode } = useClientInfoTheme();

  return (
    <div className={`client-info-react-container ${darkMode ? 'dark' : 'light'}`}>
      <ClientInfoNavbar />

      <div className="container mt-4">
        <div className="breadcrumbNav d-flex justify-content-between align-items-center">
          <Typography variant="h5" id="breadcrumb">How to Answer Your Calls</Typography>
        </div>

        <div className="pageTitle mb-4">
          <Typography variant="h4">How to Answer Your Calls</Typography>
          <p>
            The answers to these questions help us handle calls based on your preferences.
            Please review and complete accordingly.
          </p>
        </div>

        <div className="card p-3 mb-4">
          <Typography variant="h6">What do you want us to say when answering the phone?</Typography>
          <p>Example: “Thank you for calling XYZ Pediatrics, how may I help you?”</p>

          <Typography variant="h6">Should we announce who we are when we call your staff?</Typography>
          <p>Example: “This is AnSer on behalf of XYZ Pediatrics with a message.”</p>

          <Typography variant="h6">Should we say we’re your answering service or your office?</Typography>
          <p>Example: “This is your answering service calling” vs “This is XYZ Pediatrics calling”</p>

          <Typography variant="h6">How should we handle multiple calls or repeated calls?</Typography>
          <p>Should we page a different person, wait between calls, or note patterns?</p>

          <Typography variant="h6">Are there any special scripts, tone, or language we should use?</Typography>
          <p>Let us know about preferred greetings, sensitive topics, or legal wording.</p>
        </div>
      </div>
    </div>
  );
};

export default AnswerCalls;
