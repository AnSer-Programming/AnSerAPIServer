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
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import BarChartIcon from "@mui/icons-material/BarChart";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SettingsIcon from "@mui/icons-material/Settings";
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
              >
                Review & Submit Changes
              </Button>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="subtitle1"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <InsertDriveFileIcon fontSize="small" /> Account & Documents
            </Typography>
            <Button component={Link} to="/ClientInfoReact/Documents/WelcomePacket">
              Download Welcome Packet
            </Button>
            <Button component={Link} to="/ClientInfoReact/Documents/Signed">
              View Signed Documents
            </Button>
            <Button component={Link} to="/ClientInfoReact/Documents/Upload">
              Upload Additional Paperwork
            </Button>
            <Button component={Link} to="/ClientInfoReact/ServiceChanges">
              Request Service Changes
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="subtitle1"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <BarChartIcon fontSize="small" /> Reports & Stats
            </Typography>
            <Button component={Link} to="/ClientInfoReact/Reports/CallLogs">
              View Call Logs / Summary
            </Button>
            <Button component={Link} to="/ClientInfoReact/Reports/Monthly">
              Monthly Service Usage Report
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="subtitle1"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <SupportAgentIcon fontSize="small" /> Support
            </Typography>
            <Button component={Link} to="/ClientInfoReact/Support/Ticket">
              Open a Support Ticket
            </Button>
            <Button component={Link} to="/ClientInfoReact/Support/ContactManager">
              Contact Account Manager
            </Button>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="subtitle1"
              fontWeight="bold"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <SettingsIcon fontSize="small" /> Admin / Settings
            </Typography>
            <Button component={Link} to="/ClientInfoReact/Settings/Password">
              Change Password
            </Button>
            <Button component={Link} to="/ClientInfoReact/Settings/Notifications">
              Notification Settings
            </Button>
            <Button component={Link} to="/ClientInfoReact/Settings/Users">
              Manage Authorized Users
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
