// src/components/Breadcrumb.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
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
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbItems = ['Home', ...pathSegments.map(formatSegment)];
  const breadcrumbString = breadcrumbItems.join(' > ');

  return (
    <Box id="breadcrumb" sx={{ p: 1, mb: 2, backgroundColor: '#e0e0e0', borderRadius: 1 }}>
      <Typography variant="body2" color="textSecondary">
        {breadcrumbString}
      </Typography>
    </Box>
  );
};

export default Breadcrumb;
