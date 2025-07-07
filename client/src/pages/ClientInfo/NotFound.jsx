import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useClientInfoTheme } from './ClientInfoThemeContext';

const NotFound = () => {
  const history = useHistory();
  const { darkMode } = useClientInfoTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: darkMode ? '#121212' : '#f5f5f5',
        color: darkMode ? '#fff' : '#000',
        textAlign: 'center',
        p: 4
      }}
    >
      <Typography variant="h2" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Sorry, the page you’re looking for doesn’t exist.
      </Typography>
      <Button variant="contained" onClick={() => history.push('/ClientInfoReact')}>
        Back to Login
      </Button>
    </Box>
  );
};

export default NotFound;
