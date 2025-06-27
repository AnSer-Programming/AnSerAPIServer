// src/pages/ClientInfo/TestPage.jsx
import React from 'react';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import ClientInfoNavbar from './ClientInfoNavbar';
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

  return (
    <Box className={`client-info-react-container ${darkMode ? 'dark' : 'light'}`}>
      <ClientInfoNavbar />

      <Box className="container mt-3">
        <Typography variant="h4" align="center" gutterBottom>
          How to Answer Your Calls
        </Typography>

        <form className="p-3">
          <FormControlLabel
            control={<Checkbox />}
            label={
              <span>
                <strong>Use Live Agent basic phrase:</strong>{' '}
                <i style={{ color: 'blue' }}>“Thank you for calling [Business Name]...”</i>
              </span>
            }
          />

          <FormControlLabel
            control={<Checkbox />}
            label={<strong>Use Live Agent custom phrase:</strong>}
          />

          <Box mt={2}>
            {[1, 2, 3, 4].map(i => (
              <TextField key={i} fullWidth margin="dense" placeholder={`Line ${i}`} />
            ))}
          </Box>

          <Box mt={3}>
            <FormControlLabel
              control={<Checkbox />}
              label={
                <span>
                  <strong>Use Automated Greeting:</strong>{' '}
                  <i>(For screening calls or to stop spam calls)</i>
                </span>
              }
            />
            <Typography mt={1}>
              <strong>Standard Account Greeting:</strong>{' '}
              <i style={{ color: 'blue' }}>“Thank you for calling [Business Name]...”</i>
            </Typography>
          </Box>

          <Box mt={4}>
            <Button variant="contained" color="primary">Submit Forms</Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default TestPage;
