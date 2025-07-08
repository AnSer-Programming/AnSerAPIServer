// src/pages/ClientInfo/ClientInfoFooter.jsx
import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';

const ClientInfoFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} AnSer Services | All rights reserved.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Need help?{' '}
        <MuiLink href="mailto:support@anser.com" underline="always">
          Contact Support
        </MuiLink>
      </Typography>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
        Version 1.0.0 • Last updated: June 2025
      </Typography>
    </Box>
  );
};

export default ClientInfoFooter;
