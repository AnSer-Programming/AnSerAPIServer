import React from 'react';
import { Box, Typography } from '@mui/material';

// Simple wrapper to enforce consistent spacing between form rows and helper text
const FieldRow = ({ children, helperText, sx = {} }) => (
  <Box sx={{ display: 'block', mb: 2, ...sx }}>
    {children}
    {helperText ? (
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
        {helperText}
      </Typography>
    ) : null}
  </Box>
);

export default FieldRow;
