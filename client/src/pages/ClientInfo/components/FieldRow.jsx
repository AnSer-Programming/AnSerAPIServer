import React from 'react';
import PropTypes from 'prop-types';
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

FieldRow.propTypes = {
  children: PropTypes.node,
  helperText: PropTypes.string,
  sx: PropTypes.object,
};

export default FieldRow;
