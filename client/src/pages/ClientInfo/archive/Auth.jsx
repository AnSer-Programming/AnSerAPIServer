import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box, Paper, Typography, TextField, Button, Container,
  Snackbar, Alert, FormControlLabel, Checkbox, Link, Stack,
  IconButton, Tooltip, CircularProgress, Tabs, Tab
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import { useAuth } from './AuthContext';
import AnSerLogo from '../../assets/img/ClientInfo/AnSerLogo.png';
import ClientInfoFooter from './ClientInfoFooter';

const Auth = () => {
  const { darkMode, toggleDarkMode } = useClientInfoTheme();
  const { login } = useAuth();
  const history = useHistory();

  const [tab, setTab] = useState(0);
  const [loginData, setLoginData] = useState({ email: '', password: '', remember: false });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  const handleTabChange = (_, newValue) => setTab(newValue);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRedirect = (path) => {
    setLoading(true);
    login();
    setTimeout(() => history.push(path), 1200);
  };

  const validateLogin = () => {
    if (!loginData.email || !loginData.password) {
      showSnackbar('Email and Password are required.', 'error');
      return false;
    }
    return true;
  };

  const validateRegister = () => {
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      showSnackbar('All fields are required.', 'error');
      return false;
    }
    if (registerData.password !== registerData.confirmPassword) {
      showSnackbar('Passwords do not match.', 'error');
      return false;
    }
    return true;
  };

  const handleLogin = () => {
    if (!validateLogin()) return;
    showSnackbar('Signed in successfully.');
    handleRedirect('/ClientInfoReact/AccountInformation');
  };

  const handleRegister = () => {
    if (!validateRegister()) return;
    showSnackbar('Account created successfully.');
    handleRedirect('/ClientInfoReact/NewFormWizard/ClientSetUp');
  };

  const handleForgotPassword = () => {
    history.push('/ClientInfoReact/ForgotPassword');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: darkMode ? '#121212' : '#f5f5f5',
        minHeight: '100vh',
        color: darkMode ? '#fff' : '#000',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 480,
            bgcolor: darkMode ? '#1e1e1e' : '#fff',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          </Box>

          <Box mb={2}>
            <img src={AnSerLogo} alt="AnSer Logo" style={{ height: 80, marginBottom: 8 }} />
            <Typography variant="h5" gutterBottom>
              AnSer Client Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please log in or register to continue
            </Typography>
          </Box>

          <Tabs
            value={tab}
            onChange={handleTabChange}
            centered
            sx={{ mb: 2 }}
            disabled={loading}
          >
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>

          {tab === 0 && (
            <form>
              <Stack spacing={2}>
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  fullWidth
                  autoComplete="email"
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                  autoComplete="current-password"
                  value={loginData.password}
                  onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={loginData.remember}
                        onChange={e => setLoginData({ ...loginData, remember: e.target.checked })}
                        color="primary"
                      />
                    }
                    label="Remember me"
                  />
                  <Link
                    component="button"
                    onClick={handleForgotPassword}
                    underline="hover"
                    variant="body2"
                  >
                    Forgot password?
                  </Link>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleLogin}
                  disabled={loading}
                  color="primary"
                >
                  {loading ? <CircularProgress size={20} /> : 'Sign In'}
                </Button>
              </Stack>
            </form>
          )}

          {tab === 1 && (
            <form>
              <Stack spacing={2}>
                <TextField
                  label="Full Name"
                  name="name"
                  fullWidth
                  value={registerData.name}
                  onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                />
                <TextField
                  label="Email Address"
                  name="email"
                  type="email"
                  fullWidth
                  autoComplete="email"
                  value={registerData.email}
                  onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                  autoComplete="new-password"
                  value={registerData.password}
                  onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  fullWidth
                  autoComplete="new-password"
                  value={registerData.confirmPassword}
                  onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleRegister}
                  disabled={loading}
                  color="secondary"
                >
                  {loading ? <CircularProgress size={20} /> : 'Create Account'}
                </Button>
                <Typography variant="caption" color="text.secondary">
                  By registering you agree to our terms and privacy policy.
                </Typography>
              </Stack>
            </form>
          )}
        </Paper>
      </Container>

      <Box sx={{ mt: 2, width: '100%' }}>
        <ClientInfoFooter />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Auth;
