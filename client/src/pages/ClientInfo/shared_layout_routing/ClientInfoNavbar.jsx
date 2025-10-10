// src/pages/ClientInfo/shared_layout_routing/ClientInfoNavbar.jsx
import React, { useState, useMemo } from 'react';
import {
  AppBar, Toolbar, IconButton, Button, Box, Typography,
  LinearProgress, Drawer, List, ListItemButton, ListItemText,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';

// Import the logo as a module (so bundler resolves the path)
import AnSerLogo from '../../../assets/img/ClientInfo/AnSerLogoStar.png';

// Wizard config
const WIZARD_BASE = '/ClientInfoReact/NewFormWizard';
const WIZARD_STEPS = ['company-info', 'office-reach', 'call-volume', 'answer-calls', 'on-call', 'final-details', 'review'];

const NAV_ITEMS = [
  { label: 'HOME', to: '/ClientInfoReact' },
  { label: 'COMPANY INFORMATION', to: `${WIZARD_BASE}/company-info` },
  { label: 'OFFICE REACH INFORMATION', to: `${WIZARD_BASE}/office-reach` },
  { label: 'CALL VOLUME SNAPSHOT', to: `${WIZARD_BASE}/call-volume` },
  { label: 'HOW TO ANSWER YOUR CALLS', to: `${WIZARD_BASE}/answer-calls` },
];

const WIZARD_LINKS = [
  { label: 'Company Information', to: `${WIZARD_BASE}/company-info` },
  { label: 'Office Reach', to: `${WIZARD_BASE}/office-reach` },
  { label: 'Call Volume', to: `${WIZARD_BASE}/call-volume` },
  { label: 'Answer Calls', to: `${WIZARD_BASE}/answer-calls` },
  { label: 'On Call', to: `${WIZARD_BASE}/on-call` },
  { label: 'Final Details', to: `${WIZARD_BASE}/final-details` },
  { label: 'Review & Submit', to: `${WIZARD_BASE}/review` },
];

const getSlugFromPath = (pathname) => {
  const m = pathname.match(/NewFormWizard\/(.*?)(?:\/|$)/);
  return m ? m[1] : null;
};

const computeProgress = (slug) => {
  const idx = WIZARD_STEPS.indexOf(slug);
  return idx >= 0 ? ((idx + 1) / WIZARD_STEPS.length) * 100 : null;
};

const isWizardPath = (pathname) => pathname.startsWith(WIZARD_BASE);

const ClientInfoNavbar = () => {
  const { darkMode, toggleDarkMode } = useClientInfoTheme();
  const { visitedSteps = {} } = useWizard();
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:900px)');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const location = useLocation();
  const slug = getSlugFromPath(location.pathname);
  const progress = useMemo(() => computeProgress(slug), [slug]);

  const onlyShowWizardBar = isWizardPath(location.pathname);
  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <>
      <AppBar position="sticky" color="primary" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        {/* Top bar: brand + (conditionally) page nav */}
        <Toolbar sx={{ gap: 2 }}>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}

          {/* Brand */}
          <Box
            component={RouterLink}
            to="/ClientInfoReact"
            sx={{ display: 'flex', alignItems: 'center', mr: 2, textDecoration: 'none', color: 'inherit' }}
          >
            <Box component="img" src={AnSerLogo} alt="AnSer" sx={{ height: 28, width: 'auto', display: 'block' }} />
            <Typography variant="h6" sx={{ ml: 1, fontWeight: 700 }}>AnSer</Typography>
          </Box>

          {/* TOP NAV: hide it entirely on wizard routes */}
          {!onlyShowWizardBar && NAV_ITEMS.map(({ label, to }) => {
            const active = isActive(to);
            return (
              <Button
                key={to}
                component={RouterLink}
                to={to}
                sx={{
                  display: { xs: 'none', md: 'inline-flex' },
                  color: '#fff',
                  fontWeight: 700,
                  borderBottom: active ? `3px solid ${theme.palette.info.main}` : '3px solid transparent',
                  borderRadius: 0,
                  '&:hover': { backgroundColor: 'primary.dark' },
                }}
              >
                {label}
              </Button>
            );
          })}

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="contained"
            size="small"
            color="warning"
            component="a"
            href="/"
            sx={{ mr: 2, display: { xs: 'none', sm: 'inline-flex' }, fontWeight: 700 }}
          >
            ANSER API
          </Button>

          <IconButton color="inherit" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>

        {/* WIZARD STEP BAR (desktop only). Shows ONLY on wizard routes */}
        {onlyShowWizardBar && !isMobile && (
          <Toolbar
            variant="dense"
            sx={{
              gap: 0.5,
              minHeight: 42,
              bgcolor: 'primary.dark',
              px: { xs: 1.5, md: 2 },
            }}
          >
            {WIZARD_LINKS.map(({ label, to }) => {
              const active = isActive(to);
              const step = getSlugFromPath(to);
              const visited = !!visitedSteps[step];

              return (
                <Button
                  key={to}
                  component={RouterLink}
                  to={to}
                  size="small"
                  sx={{
                    color: '#fff',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 0,
                    px: 1.75,
                    mx: 0.25,
                    borderBottom: active ? `3px solid ${theme.palette.info.main}` : '3px solid transparent',
                    '&:hover': { backgroundColor: 'primary.main' },
                  }}
                >
                  {visited ? '✓ ' : ''}{label}
                </Button>
              );
            })}
          </Toolbar>
        )}

        {/* Progress bar on wizard pages */}
        {onlyShowWizardBar && progress !== null && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 3,
              bgcolor: 'primary.light',
              '& .MuiLinearProgress-bar': { bgcolor: 'info.main' },
            }}
          />
        )}
      </AppBar>

      {/* Mobile drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280 }} role="presentation">
          <List dense>
            {/* Show page nav in drawer always */}
            {NAV_ITEMS.map(({ label, to }) => (
              <ListItemButton
                key={to}
                component={RouterLink}
                to={to}
                selected={isActive(to)}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            ))}

            {/* Wizard links grouped below */}
            {WIZARD_LINKS.map(({ label, to }) => (
              <ListItemButton
                key={to}
                component={RouterLink}
                to={to}
                selected={isActive(to)}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default ClientInfoNavbar;
