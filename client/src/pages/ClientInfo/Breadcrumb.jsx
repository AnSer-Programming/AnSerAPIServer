// src/components/Breadcrumb.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const formatSegment = (segment) => {
  // Convert "newFormWizard" or "review-step" to "New Form Wizard" or "Review Step"
  return decodeURIComponent(
    segment
      .replace(/-/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
  ).replace(/\b\w/g, (char) => char.toUpperCase());
};

const Breadcrumb = () => {
  const location = useLocation();
  const theme = useTheme();
  // Filter out segments that are not relevant for the user-facing breadcrumb
  const pathSegments = location.pathname
    .split('/')
    .filter(Boolean)
    .filter(segment => !['ClientInfoReact', 'NewFormWizard'].includes(segment));

  const breadcrumbItems = ['Start New Client', ...pathSegments.map(formatSegment)];
  const breadcrumbString = breadcrumbItems.join(' > ');

  return (
    <Box
      id="breadcrumb"
      sx={{
        p: 1, mb: 2,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200],
        borderRadius: 1
      }}>
      <Typography variant="body2" color="textSecondary">
        {breadcrumbString}
      </Typography>
    </Box>
  );
};

export default Breadcrumb;
