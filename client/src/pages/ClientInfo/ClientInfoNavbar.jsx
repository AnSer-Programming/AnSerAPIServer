import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  useTheme
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import AnSerLogoStar from "../../assets/img/ClientInfo/AnSerLogoStar.png";
import { useClientInfoTheme } from "./ClientInfoThemeContext";

const ClientInfoNavbar = () => {
  const { darkMode, toggleDarkMode } = useClientInfoTheme();
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Home", path: "/ClientInfoReact/StartNewClient" },
    { label: "Company Information", path: "/ClientInfoReact/NewFormWizard/ClientSetUp" },
    { label: "Office Reach Information", path: "/ClientInfoReact/NewFormWizard/OfficeReach" },
    { label: "How to Answer Your Calls", path: "/ClientInfoReact/NewFormWizard/AnswerCalls" },
  ];

  const renderLinks = () => (
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
  );

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Link to="/ClientInfoReact/StartNewClient">
            <img
              src={AnSerLogoStar}
              alt="AnSer Logo"
              style={{ height: "40px" }}
            />
          </Link>
          <Box>
            <Typography variant="h6" color="inherit" noWrap>
              AnSer
            </Typography>
            <Typography variant="caption" color="inherit">
              New Client Intake
            </Typography>
          </Box>
        </Box>

        {isMobile ? (
          <>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              <Box width={250}>
                <List>
                  {navLinks.map(({ label, path }) => (
                    <ListItem
                      key={path}
                      button
                      component={Link}
                      to={path}
                      selected={isActive(path)}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <ListItemText primary={label} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
          </>
        ) : (
          renderLinks()
        )}

        <Box display="flex" alignItems="center" gap={1}>
          <Button
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            color="warning"
            size="small"
          >
            AnSer API
          </Button>

          <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default ClientInfoNavbar;
