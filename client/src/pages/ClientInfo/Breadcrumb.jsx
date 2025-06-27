// src/components/Breadcrumb.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbString = ['Home', ...pathSegments.map(capitalize)].join(' > ');

  return (
    <Box id="breadcrumb" sx={{ p: 1, mb: 2, backgroundColor: '#e0e0e0', borderRadius: 1 }}>
      <Typography variant="body2" color="textSecondary">
        {breadcrumbString}
      </Typography>
    </Box>
  );
};

export default Breadcrumb;
