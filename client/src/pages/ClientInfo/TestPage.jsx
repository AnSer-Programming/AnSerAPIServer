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
  Button,
  Container,
  Paper
} from '@mui/material';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ClientInfoNavbar />

      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" component="h1" gutterBottom>
            How to Answer Your Calls (Test Page)
          </Typography>

          <Box>
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
        </Paper>
      </Container>

      <ClientInfoFooter />
    </Box>
  );
};

export default TestPage;
