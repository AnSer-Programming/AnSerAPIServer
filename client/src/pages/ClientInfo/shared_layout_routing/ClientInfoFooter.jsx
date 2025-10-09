// src/pages/ClientInfo/ClientInfoFooter.jsx
import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';

const ClientInfoFooter = ({
  version = '1.0.0',
  lastUpdated = 'June 2025',
  supportEmail = 'support@anser.com',
  supportPhone,                    // e.g., '(555) 123-4567'
  supportHref,                     // override mailto if you have a portal URL
}) => {
  const year = new Date().getFullYear();
  const emailHref = supportHref || `mailto:${supportEmail}`;

  const handleBackToTop = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Box
      component="footer"
      role="contentinfo"
      sx={(theme) => ({
        py: 3,
        px: 2,
        mt: 'auto',
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor:
          theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[100],
        textAlign: 'center',
      })}
    >
      <Typography variant="body2" color="text.secondary">
        © {year} AnSer Services • All rights reserved.
      </Typography>

      <Typography variant="body2" color="text.secondary">
        Need help?{' '}
        <MuiLink
          href={emailHref}
          underline="always"
          target={supportHref ? '_blank' : undefined}
          rel={supportHref ? 'noopener noreferrer' : undefined}
        >
          Contact Support
        </MuiLink>
        {supportPhone && (
          <>
            {' '}•{' '}
            <MuiLink href={`tel:${supportPhone.replace(/[^\d+]/g, '')}`} underline="always">
              {supportPhone}
            </MuiLink>
          </>
        )}
      </Typography>

      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
        Version {version} • Last updated: {lastUpdated}
      </Typography>

      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        <MuiLink href="#top" onClick={handleBackToTop} underline="hover">
          Back to top
        </MuiLink>
      </Typography>
    </Box>
  );
};

export default ClientInfoFooter;
