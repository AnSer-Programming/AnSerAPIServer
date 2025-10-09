// 📁 src/pages/ClientInfo/sections/ContactNumbersSection.jsx

import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';

const ContactNumbersSection = ({ data = {}, onChange, errors = {} }) => (
  <>
    <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
      Contact Numbers
    </Typography>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Primary Office Line"
          fullWidth
          value={data.primary || ''}
          onChange={(e) => onChange({ primary: e.target.value })}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Toll-Free Number"
          fullWidth
          value={data.tollFree || ''}
          onChange={(e) => onChange({ tollFree: e.target.value })}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Secondary / Back Line"
          fullWidth
          value={data.secondary || ''}
          onChange={(e) => onChange({ secondary: e.target.value })}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Fax Number"
          fullWidth
          value={data.fax || ''}
          onChange={(e) => onChange({ fax: e.target.value })}
        />
      </Grid>
    </Grid>
  </>
);

export default ContactNumbersSection;
