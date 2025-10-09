import React from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';
import ClientInfoNavbar from './ClientInfoNavbar';
import ClientInfoFooter from './ClientInfoFooter';

const AccountInformation = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ClientInfoNavbar />

      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Account Information
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Here you can view and manage your account details. This page is a placeholder for future features.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Future functionality may include:
          </Typography>

          <ul>
            <li>View current account settings and contact information</li>
            <li>Update billing and office contact details</li>
            <li>Review service preferences and on-call schedules</li>
            <li>Download account-related documents</li>
          </ul>
        </Paper>
      </Container>

      <ClientInfoFooter />
    </Box>
  );
};

export default AccountInformation;
