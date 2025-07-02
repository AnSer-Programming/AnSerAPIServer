// src/pages/ClientInfo/StartNewClient.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Paper, Typography, Box, Stack, Divider } from "@mui/material";
import AnSerLogo from "../../assets/img/ClientInfo/AnSerLogo.png";
import { useClientInfoTheme } from "./ClientInfoThemeContext";
import ClientInfoNavbar from "./ClientInfoNavbar";
import ClientInfoFooter from "./ClientInfoFooter";

const StartNewClient = () => {
  const { darkMode } = useClientInfoTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ClientInfoNavbar />

      <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          {/* Logo */}
          <Box className="imageHolder mb-4">
            <img
              src={AnSerLogo}
              alt="AnSer Logo"
              style={{ maxWidth: "280px", width: "100%", height: "auto" }}
            />
          </Box>

          {/* Title */}
          <Box className="pageTitle mb-4">
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              New Client Setup
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Start the new client wizard or access other tools.
            </Typography>
          </Box>

          {/* Navigation Buttons */}
          <Stack spacing={2} sx={{ width: '100%', maxWidth: '400px' }}>
            <Button
              component={Link}
              to="/ClientInfoReact/NewFormWizard/ClientSetUp"
              variant="contained"
              size="large"
            >
              Start New Client Wizard
            </Button>
            <Typography variant="body2" color="text.secondary">or jump to a specific section:</Typography>
            <Button component={Link} to="/ClientInfoReact/NewFormWizard/OfficeReach" variant="outlined">Office Reach Information</Button>
            <Button component={Link} to="/ClientInfoReact/NewFormWizard/AnswerCalls" variant="outlined">How to Answer Your Calls</Button>
            <Button component={Link} to="/ClientInfoReact/NewFormWizard/Review" variant="outlined" color="success">Review & Submit</Button>
            <Divider sx={{ width: '80%', my: 2, mx: 'auto' }} />
            <Button
              component={Link}
              to="/ClientInfoReact/ATools"
              variant="contained"
              color="secondary"
            >
              Admin Tools
            </Button>
            <Button component={Link} to="/ClientInfoReact/TestPage" variant="outlined" color="warning">Test Page</Button>
          </Stack>
        </Paper>
      </Container>

      <ClientInfoFooter />
    </Box>
  );
};

export default StartNewClient;
