// src/pages/ClientInfo/StartNewClient.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Divider
} from "@mui/material";
import AnSerLogo from "../../assets/img/ClientInfo/AnSerLogo.png";
import { useClientInfoTheme } from "./ClientInfoThemeContext";
import { useAuth } from "./AuthContext";
import ClientInfoNavbar from "./ClientInfoNavbar";
import ClientInfoFooter from "./ClientInfoFooter";

const StartNewClient = () => {
  const { darkMode } = useClientInfoTheme();
  const { user } = useAuth();

  const isNew = user?.isNew ?? false;

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
            {isNew
              ? `Welcome, ${user?.name || "new client"}!`
              : `Welcome back, ${user?.name || "client"}!`}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {isNew
              ? `Let’s get started with your setup wizard.`
              : `Here are your tools and resources.`}
          </Typography>

          <Stack spacing={2} sx={{ width: "100%", mx: "auto" }}>
            {isNew && (
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
            )}

            {!isNew && (
              <Button
                component={Link}
                to="/ClientInfoReact/AccountInformation"
                variant="contained"
                color="primary"
                fullWidth
              >
                View / Edit Account Info
              </Button>
            )}

            {user?.hasUnsubmittedChanges && (
              <Button
                component={Link}
                to="/ClientInfoReact/NewFormWizard/Review"
                variant="outlined"
                color="success"
                fullWidth
              >
                Review & Submit Changes
              </Button>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight="bold">
              Account & Documents
            </Typography>
            {[
              { label: 'Download Welcome Packet', to: '/ClientInfoReact/Documents/WelcomePacket' },
              { label: 'View Signed Documents', to: '/ClientInfoReact/Documents/Signed' },
              { label: 'Upload Additional Paperwork', to: '/ClientInfoReact/Documents/Upload' },
              { label: 'Request Service Changes', to: '/ClientInfoReact/ServiceChanges' }
            ].map(({ label, to }) => (
              <Button key={label} component={Link} to={to} variant="outlined" fullWidth>
                {label}
              </Button>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight="bold">
              Reports & Stats
            </Typography>
            {[
              { label: 'View Call Logs / Summary', to: '/ClientInfoReact/Reports/CallLogs' },
              { label: 'Monthly Service Usage Report', to: '/ClientInfoReact/Reports/Monthly' }
            ].map(({ label, to }) => (
              <Button key={label} component={Link} to={to} variant="outlined" fullWidth>
                {label}
              </Button>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight="bold">
              Support
            </Typography>
            {[
              { label: 'Open a Support Ticket', to: '/ClientInfoReact/Support/Ticket' },
              { label: 'Contact Account Manager', to: '/ClientInfoReact/Support/ContactManager' }
            ].map(({ label, to }) => (
              <Button key={label} component={Link} to={to} variant="outlined" fullWidth>
                {label}
              </Button>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight="bold">
              Admin / Settings
            </Typography>
            {[
              { label: 'Change Password', to: '/ClientInfoReact/Settings/Password' },
              { label: 'Notification Settings', to: '/ClientInfoReact/Settings/Notifications' },
              { label: 'Manage Authorized Users', to: '/ClientInfoReact/Settings/Users' }
            ].map(({ label, to }) => (
              <Button key={label} component={Link} to={to} variant="outlined" fullWidth>
                {label}
              </Button>
            ))}
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
