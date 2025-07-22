// src/pages/ClientInfo/OnboardingComplete.jsx
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import ClientInfoFooter from './ClientInfoFooter';

const OnboardingComplete = () => {
  const history = useHistory();

  const handleGoToAccount = () => {
    history.push('/ClientInfoReact/AccountInformation');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center' }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>🎉 Onboarding Complete</Typography>
          <Typography variant="body1" gutterBottom>
            Thank you for completing your paperwork. Your account is now set up.
          </Typography>
          <Button variant="contained" onClick={handleGoToAccount} sx={{ mt: 2 }}>
            Go to Account Information
          </Button>
        </Paper>
      </Container>
      <ClientInfoFooter />
    </Box>
  );
};

export default OnboardingComplete;
