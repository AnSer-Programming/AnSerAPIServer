import React, { useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AnSerLogoStar from "../../assets/img/ClientInfo/AnSerLogoStar.png";
import { useClientInfoTheme } from "./ClientInfoThemeContext";

const ClientInfoNavbar = () => {
  const { darkMode, toggleDarkMode } = useClientInfoTheme();
  const theme = useTheme();
  const location = useLocation();
  const history = useHistory();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const menuOpen = Boolean(menuAnchorEl);

  const handleMenuOpen = (event) => setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => setMenuAnchorEl(null);

  const handleLogout = () => setLogoutDialogOpen(true);

  const confirmLogout = () => {
    setLogoutDialogOpen(false);
    history.push("/ClientInfoReact");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { label: "Home", path: "/ClientInfoReact/StartNewClient" },
    { label: "Company Information", path: "/ClientInfoReact/NewFormWizard/ClientSetUp" },
    { label: "Office Reach Information", path: "/ClientInfoReact/NewFormWizard/OfficeReach" },
    { label: "How to Answer Your Calls", path: "/ClientInfoReact/NewFormWizard/AnswerCalls" },
    { label: "Site Overview", path: "/ClientInfoReact/SiteOverview" },
  ];

  const dropdownLinks = [
    { label: "miTeam Web", href: "https://www.anser-services.com/miTeamWeb/", external: true },
    { label: "Account Information", path: "/ClientInfoReact/AccountInformation" },
    { label: "Contact Us", href: "https://www.anser.com/", external: true },
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

      <Button
        color="inherit"
        size="small"
        onClick={handleMenuOpen}
        aria-haspopup="true"
        aria-controls="more-menu"
      >
        More
      </Button>
      <Menu
        id="more-menu"
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
      >
        {dropdownLinks.map(({ label, path, href, external }) => (
          <MenuItem
            key={label}
            component={external ? "a" : Link}
            to={path}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            onClick={handleMenuClose}
            selected={path && isActive(path)}
          >
            {label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );

  return (
    <>
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
                Client Portal
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
                    {dropdownLinks.map(({ label, path, href, external }) => (
                      <ListItem
                        key={label}
                        button
                        component={external ? "a" : Link}
                        to={path}
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        selected={path && isActive(path)}
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
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} color="inherit">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: darkMode ? theme.palette.background.default : "#fff",
            color: darkMode ? "#fff" : "#000",
          },
        }}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: darkMode ? "#ccc" : "#333" }}>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmLogout} color="error" variant="contained">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClientInfoNavbar;
