// src/pages/ClientInfo/SiteOverview.jsx
import React from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Stack
} from "@mui/material";
import ClientInfoNavbar from "./ClientInfoNavbar";
import ClientInfoFooter from "./ClientInfoFooter";
import { useClientInfoTheme } from "./ClientInfoThemeContext";

const SiteOverview = () => {
  const { darkMode } = useClientInfoTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: darkMode ? "#121212" : "#f5f5f5"
      }}
    >
      <ClientInfoNavbar />

      <Container maxWidth="md" sx={{ flexGrow: 1, mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{ p: 4, bgcolor: darkMode ? "#1e1e1e" : "#fff" }}
        >
          <Typography
            variant="h4"
            gutterBottom
            fontWeight="bold"
            color={darkMode ? "primary.light" : "primary.dark"}
          >
            Client Info Portal - Overview
          </Typography>
          <Typography variant="body1" paragraph>
            The Client Info Portal is a modern web application built to
            streamline the entire client lifecycle at AnSer. From registration
            and onboarding to account management and support, the portal is
            designed to be intuitive, responsive, and fully featured.
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>
            <Typography variant="h6" fontWeight="bold">
              Authentication & Authorization
            </Typography>
            <Typography variant="body2">
              Unified login/register page with dark mode toggle and feedback.
              Includes Forgot Password functionality and protected routes for
              logged-in users.
            </Typography>

            <Typography variant="h6" fontWeight="bold">
              Client Onboarding
            </Typography>
            <Typography variant="body2">
              A guided onboarding wizard helps new clients set up their
              accounts step-by-step, with a clear onboarding complete page.
            </Typography>

            <Typography variant="h6" fontWeight="bold">
              Client Dashboard & Tools
            </Typography>
            <Typography variant="body2">
              Returning clients see a dashboard with quick access to account
              info, documents, reports, support, and settings.
            </Typography>

            <Typography variant="h6" fontWeight="bold">
              User Interface & Experience
            </Typography>
            <Typography variant="body2">
              Fully responsive, Material-UI based interface with light/dark
              mode support, snackbars for feedback, and a mobile-friendly
              navbar.
            </Typography>

            <Typography variant="h6" fontWeight="bold">
              Technical Details
            </Typography>
            <Typography variant="body2">
              Built with React, React Router, Context API for state,
              Material-UI for styling, and structured as a clean SPA.
            </Typography>
          </Stack>
        </Paper>
      </Container>

      <ClientInfoFooter />
    </Box>
  );
};

export default SiteOverview;
