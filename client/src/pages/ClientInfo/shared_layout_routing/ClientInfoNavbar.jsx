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
import { useTheme, alpha } from '@mui/material/styles';

import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';

// Import the logo as a module (so bundler resolves the path)
import AnSerLogo from '../../../assets/img/ClientInfo/AnSerLogoStar.png';

// Wizard config
const WIZARD_BASE = '/ClientInfoReact/NewFormWizard';
// New order: Company Information → Answer Calls → On Call → Team Setup → Escalation & Rotation Details → Call Routing → Other Info → Final Details → Review
const WIZARD_STEPS = ['company-info', 'answer-calls', 'on-call', 'team-setup', 'escalation-details', 'call-routing', 'office-reach', 'final-details', 'review'];

const NAV_ITEMS = [
  { label: 'HOME', to: '/ClientInfoReact' },
  { label: 'COMPANY INFORMATION', to: `${WIZARD_BASE}/company-info` },
  { label: 'HOW TO ANSWER YOUR CALLS', to: `${WIZARD_BASE}/answer-calls` },
  { label: 'ON-CALL SETUP', to: `${WIZARD_BASE}/on-call` },
  { label: 'OTHER INFO', to: `${WIZARD_BASE}/office-reach` },
  { label: 'FINAL DETAILS', to: `${WIZARD_BASE}/final-details` },
];

const WIZARD_LINKS = [
  { label: 'Company Information', to: `${WIZARD_BASE}/company-info` },
  { label: 'Answer Calls', to: `${WIZARD_BASE}/answer-calls` },
  { label: 'On Call Setup', to: `${WIZARD_BASE}/on-call` },
  { label: 'Team Setup', to: `${WIZARD_BASE}/team-setup` },
  { label: 'Escalation & Rotation Details', to: `${WIZARD_BASE}/escalation-details` },
  { label: 'Call Routing', to: `${WIZARD_BASE}/call-routing` },
  { label: 'Other Info', to: `${WIZARD_BASE}/office-reach` },
  { label: 'Final Details', to: `${WIZARD_BASE}/final-details` },
  { label: 'Review & Submit', to: `${WIZARD_BASE}/review` },
];

const getSlugFromPath = (pathname) => {
  const m = pathname.match(/NewFormWizard\/(.*?)(?:\/|$)/);
  return m ? m[1] : null;
};

const computeProgress = (slug) => {
  const idx = WIZARD_STEPS.indexOf(slug);
  return idx >= 0 ? Math.round(((idx + 1) / WIZARD_STEPS.length) * 100) : null;
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
              minHeight: 40,
              bgcolor: 'primary.dark',
              px: { xs: 1.5, md: 2 },
              flexWrap: 'wrap',
            }}
          >
            {/* Progress bar integrated into wizard step bar */}
            <Box sx={{ width: '100%', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress || 0}
                aria-label={`Wizard progress ${progress || 0}%`}
                sx={{
                  flex: 1,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha(theme.palette.common.white, 0.15),
                  '& .MuiLinearProgress-bar': { 
                    bgcolor: theme.palette.info.main,
                    borderRadius: 3,
                  },
                }}
              />
              <Typography variant="caption" sx={{ color: 'white', fontWeight: 600, minWidth: 40 }}>
                {progress || 0}%
              </Typography>
            </Box>
            
            {/* Wizard step buttons */}
            <Box sx={{ display: 'flex', gap: 0.5, width: '100%', justifyContent: 'center' }}>
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
                    aria-current={active ? 'step' : undefined}
                    sx={{
                      color: '#fff',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: 1,
                      px: 1.5,
                      mx: 0.5,
                      minHeight: 32,
                      borderBottom: active ? `3px solid ${theme.palette.info.main}` : '3px solid transparent',
                      '&:hover': { backgroundColor: 'primary.main' },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    {/* Visited indicator: keep small check circle for clarity */}
                    <Box
                      component="span"
                      aria-hidden
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: visited ? 'success.main' : 'transparent',
                        color: visited ? '#fff' : 'inherit',
                        fontSize: 12,
                        border: visited ? 'none' : `1px solid ${alpha(theme.palette.common.white, 0.12)}`,
                      }}
                    >
                      {visited ? '✓' : ''}
                    </Box>
                    <Box component="span" sx={{ lineHeight: 1 }}>{label}</Box>
                  </Button>
                );
              })}
            </Box>
          </Toolbar>
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


