import React from 'react';
import { Box, Typography, TextField, Grid, Paper } from '@mui/material';
import { useWizard } from '../context_API/WizardContext';

const AccountQuestionsContactSection = ({ errors = {} }) => {
  const { formData, updateSection } = useWizard();
  const companyInfo = formData.companyInfo || {};
  const designated = companyInfo.designatedContact || { name: '', phone: '', email: '' };

  const setCompany = (patch) => updateSection('companyInfo', { ...companyInfo, ...patch });
  const setDesignated = (patch) =>
    setCompany({ designatedContact: { ...designated, ...patch } });

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ color: '#b00', fontWeight: 700, mb: 1 }}>
        Designated Contact for Account‑Related Questions
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Name"
              fullWidth
              value={designated.name}
              onChange={(e) => setDesignated({ name: e.target.value })}
              error={!!errors?.designatedContact?.name}
              helperText={errors?.designatedContact?.name}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Phone"
              fullWidth
              value={designated.phone}
              onChange={(e) => setDesignated({ phone: e.target.value })}
              error={!!errors?.designatedContact?.phone}
              helperText={errors?.designatedContact?.phone}
              inputProps={{ inputMode: 'tel' }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Email"
              fullWidth
              value={designated.email}
              onChange={(e) => setDesignated({ email: e.target.value })}
              error={!!errors?.designatedContact?.email}
              helperText={errors?.designatedContact?.email}
              inputProps={{ inputMode: 'email' }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AccountQuestionsContactSection;