import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Paper,
  Typography,
  Box,
  Stack
} from "@mui/material";
import AnSerLogo from "../../assets/img/ClientInfo/AnSerLogo.png";
import { useClientInfoTheme } from "./ClientInfoThemeContext";
import ClientInfoNavbar from "./ClientInfoNavbar";
import ClientInfoFooter from "./ClientInfoFooter";

const StartNewClient = () => {
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

      <Container
        component="main"
        maxWidth="sm"
        sx={{
          mt: 4,
          mb: 4,
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 500,
            bgcolor: darkMode ? "#1e1e1e" : "#fff",
            textAlign: "center"
          }}
        >
          <Box mb={2}>
            <img
              src={AnSerLogo}
              alt="AnSer Logo"
              style={{
                maxWidth: 200,
                width: "100%",
                height: "auto",
                marginBottom: 8
              }}
            />
          </Box>

          <Typography variant="h5" gutterBottom fontWeight="bold">
            Welcome to the New Client Intake Form
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Please click below to begin providing your company’s information.
          </Typography>

          <Stack spacing={2} sx={{ width: "100%", mx: "auto" }}>
            <Button
              component={Link}
              to="/ClientInfoReact/NewFormWizard/ClientSetUp"
              variant="contained"
              size="large"
              color="primary"
              fullWidth
            >
              Start New Client Wizard
            </Button>
          </Stack>
        </Paper>
      </Container>

      <Box sx={{ mt: 2 }}>
        <ClientInfoFooter />
      </Box>
    </Box>
  );
};

export default StartNewClient;
