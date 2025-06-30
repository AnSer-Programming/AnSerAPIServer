// src/pages/ClientInfo/TestPage.jsx
import React, { useState } from 'react';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import ClientInfoNavbar from './ClientInfoNavbar';
import ClientInfoFooter from './ClientInfoFooter';
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  Button
} from '@mui/material';
import './ClientInfoReact.css';

const TestPage = () => {
  const { darkMode } = useClientInfoTheme();
  const [form, setForm] = useState({
    useBasicPhrase: false,
    useCustomPhrase: false,
    customLines: ['', '', '', ''],
    useAutoGreeting: false,
  });

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleLineChange = (index, value) => {
    const updatedLines = [...form.customLines];
    updatedLines[index] = value;
    setForm((prev) => ({ ...prev, customLines: updatedLines }));
  };

  const handleSubmit = () => {
    console.log('TestPage form values:', form);
  };

  return (
    <Box className={`client-info-react-container d-flex flex-column min-vh-100 ${darkMode ? 'dark' : 'light'}`}>
      <ClientInfoNavbar />

      <Box className="container flex-grow-1 mt-4 mb-5">
        <Typography variant="h4" align="center" gutterBottom>
          How to Answer Your Calls (Test Page)
        </Typography>

        <Box className="card p-4">
          <FormControlLabel
            control={
              <Checkbox
                name="useBasicPhrase"
                checked={form.useBasicPhrase}
                onChange={handleCheckbox}
              />
            }
            label={
              <span>
                <strong>Use Live Agent basic phrase:</strong>{' '}
                <i style={{ color: 'blue' }}>“Thank you for calling [Business Name]...”</i>
              </span>
            }
          />

          <FormControlLabel
            control={
              <Checkbox
                name="useCustomPhrase"
                checked={form.useCustomPhrase}
                onChange={handleCheckbox}
              />
            }
            label={<strong>Use Live Agent custom phrase:</strong>}
          />

          {form.useCustomPhrase && (
            <Box mt={2}>
              {form.customLines.map((line, i) => (
                <TextField
                  key={i}
                  fullWidth
                  margin="dense"
                  value={line}
                  placeholder={`Line ${i + 1}`}
                  onChange={(e) => handleLineChange(i, e.target.value)}
                />
              ))}
            </Box>
          )}

          <Box mt={3}>
            <FormControlLabel
              control={
                <Checkbox
                  name="useAutoGreeting"
                  checked={form.useAutoGreeting}
                  onChange={handleCheckbox}
                />
              }
              label={
                <span>
                  <strong>Use Automated Greeting:</strong>{' '}
                  <i>(For screening calls or to stop spam calls)</i>
                </span>
              }
            />
            {form.useAutoGreeting && (
              <Typography mt={1}>
                <strong>Standard Account Greeting:</strong>{' '}
                <i style={{ color: 'blue' }}>“Thank you for calling [Business Name]...”</i>
              </Typography>
            )}
          </Box>

          <Box mt={4}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit Forms
            </Button>
          </Box>
        </Box>
      </Box>

      <ClientInfoFooter />
    </Box>
  );
};

export default TestPage;
