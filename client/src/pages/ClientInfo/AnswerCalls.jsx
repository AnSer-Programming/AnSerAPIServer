// src/pages/ClientInfo/AnswerCalls.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Button
} from '@mui/material';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import { useWizard } from './WizardContext';
import { useHistory } from 'react-router-dom';
import ClientInfoNavbar from './ClientInfoNavbar';
import ClientInfoFooter from './ClientInfoFooter';
import Breadcrumb from './Breadcrumb';
import './ClientInfoReact.css';

const AnswerCalls = () => {
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const { formData, updateSection } = useWizard();

  const [form, setForm] = useState(() =>
    formData.AnswerCalls || {
      useBasicPhrase: false,
      useCustomPhrase: false,
      customPhrase: '',
      useAutoGreeting: false,
      autoGreeting: '',
      specialInstructions: ''
    }
  );

  useEffect(() => {
    updateSection('AnswerCalls', form);
  }, [form]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleContinue = () => {
    updateSection('AnswerCalls', form);
    history.push('/ClientInfoReact/NewFormWizard/Review');
  };

  return (
    <div className={`client-info-react-container d-flex flex-column min-vh-100 ${darkMode ? 'dark' : 'light'}`}>
      <ClientInfoNavbar />

      <Box className="container mt-4 flex-grow-1">
        <Breadcrumb />

        <div className="pageTitle mb-4">
          <Typography variant="h4">How to Answer Your Calls</Typography>
          <p>
            The answers to these questions help us handle calls based on your preferences.
            Please review and complete accordingly.
          </p>
        </div>

        <Box className="card p-4">
          <FormControlLabel
            control={
              <Checkbox
                checked={form.useBasicPhrase}
                onChange={handleChange}
                name="useBasicPhrase"
              />
            }
            label={
              <span>
                <strong>Use Live Agent basic phrase:</strong>{' '}
                <i>“Thank you for calling [Business Name]…”</i>
              </span>
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={form.useCustomPhrase}
                onChange={handleChange}
                name="useCustomPhrase"
              />
            }
            label={<strong>Use Live Agent custom phrase:</strong>}
          />

          {form.useCustomPhrase && (
            <TextField
              fullWidth
              name="customPhrase"
              value={form.customPhrase}
              onChange={handleChange}
              margin="normal"
              placeholder="Enter your custom greeting"
            />
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={form.useAutoGreeting}
                onChange={handleChange}
                name="useAutoGreeting"
              />
            }
            label={<strong>Use Automated Greeting</strong>}
          />

          {form.useAutoGreeting && (
            <TextField
              fullWidth
              name="autoGreeting"
              value={form.autoGreeting}
              onChange={handleChange}
              margin="normal"
              placeholder="Custom automated greeting (optional)"
            />
          )}

          <TextField
            label="Special instructions (tone, escalation, legal language, etc.)"
            name="specialInstructions"
            value={form.specialInstructions}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />

          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              onClick={handleContinue}
            >
              Continue to Review
            </Button>
          </Box>
        </Box>
      </Box>

      <ClientInfoFooter />
    </div>
  );
};

export default AnswerCalls;
