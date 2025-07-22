import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box, Paper, Typography, TextField, Button, Container,
  Snackbar, Alert, IconButton, Tooltip, CircularProgress, Link
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import AnSerLogo from '../../assets/img/ClientInfo/AnSerLogo.png';
import ClientInfoFooter from './ClientInfoFooter';

const ForgotPassword = () => {
  const { darkMode, toggleDarkMode } = useClientInfoTheme();
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setSnackbar({ open: true, message: 'Email is required.', severity: 'error' });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setSnackbar({ open: true, message: 'Please enter a valid email.', severity: 'error' });
      return;
    }

    setLoading(true);
    setSnackbar({ open: true, message: 'Password reset link sent. Please check your email.', severity: 'success' });

    setTimeout(() => {
      history.push('/ClientInfoReact/Auth');
    }, 3000);
  };

  const handleBackToLogin = () => {
    history.push('/ClientInfoReact/Auth');
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
              Forgot Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your email address to reset your password.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              name="email"
              type="email"
              fullWidth
              sx={{ mb: 2 }}
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Send Reset Link'}
            </Button>
          </form>

          <Box mt={2}>
            <Link
              component="button"
              onClick={handleBackToLogin}
              underline="hover"
              variant="body2"
            >
              Back to Login
            </Link>
          </Box>
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

export default ForgotPassword;
