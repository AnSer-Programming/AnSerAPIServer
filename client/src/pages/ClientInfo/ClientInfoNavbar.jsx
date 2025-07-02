// src/pages/ClientInfo/ClientInfoNavbar.jsx
import React from "react";
import AnSerLogoStar from "../../assets/img/ClientInfo/AnSerLogoStar.png";
import { Link, useLocation } from "react-router-dom";
import { useClientInfoTheme } from "./ClientInfoThemeContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";


const ClientInfoNavbar = () => {
  const { darkMode, toggleDarkMode } = useClientInfoTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Home", path: "/ClientInfoReact/StartNewClient" },
    {
      label: "Company Information",
      path: "/ClientInfoReact/NewFormWizard/ClientSetUp",
    },
    {
      label: "Office Reach Information",
      path: "/ClientInfoReact/NewFormWizard/OfficeReach",
    },
    {
      label: "How to Answer Your Calls",
      path: "/ClientInfoReact/NewFormWizard/AnswerCalls",
    },
    { label: "Test Page", path: "/ClientInfoReact/TestPage" },
  ];

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Logo and Title */}
        <Box display="flex" alignItems="center" gap={1}>
          <Link to="/ClientInfoReact/StartNewClient">
            <img
              src={AnSerLogoStar}
              alt="AnSer Logo"
              style={{ height: "40px" }}
            />
          </Link>
          <Typography variant="h6" color="inherit" noWrap>
            AnSer
          </Typography>
        </Box>

        {/* Center: Navigation Links */}
        <Box display="flex" gap={1} flexWrap="wrap">
          {navLinks.map(({ label, path }) => (
            <Button
              key={path}
              component={Link}
              to={path}
              variant={isActive(path) ? "contained" : "text"}
              color="inherit"
              size="small"
              sx={{
                bgcolor: isActive(path) ? "secondary.main" : "inherit",
                "&:hover": {
                  bgcolor: isActive(path) ? "secondary.dark" : "primary.light",
                },
              }}
            >
              {label}
            </Button>
          ))}
        </Box>

        {/* Right: Theme Toggle & API Button */}
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            component={Link}
            to="/"
            color="warning"
            variant="contained"
            size="small"
          >
            AnSer API
          </Button>
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ClientInfoNavbar;
