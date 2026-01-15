import React, { useState } from 'react';
import { Box, Typography, TextField, Grid, Paper } from '@mui/material';
import { useWizard } from '../context_API/WizardContext';
import { isValidEmail, getEmailError } from '../utils/emailValidation';
import { isValidPhone, getPhoneError } from '../utils/phonePostalValidation';

const AccountQuestionsContactSection = ({ errors = {} }) => {
  const { formData, updateSection } = useWizard();
  const companyInfo = formData.companyInfo || {};
  const designated = companyInfo.designatedContact || { name: '', phone: '', email: '' };

  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateEmail = (email) => {
    setEmailError(getEmailError(email));
  };

  const validatePhone = (phone) => {
    setPhoneError(getPhoneError(phone));
  };

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
              onChange={(e) => {
                setDesignated({ phone: e.target.value });
                if (phoneError && isValidPhone(e.target.value)) {
                  setPhoneError('');
                }
              }}
              onBlur={(e) => validatePhone(e.target.value)}
              error={!!phoneError || !!errors?.designatedContact?.phone}
              helperText={phoneError || errors?.designatedContact?.phone}
              inputProps={{ inputMode: 'tel' }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={designated.email}
              onChange={(e) => {
                setDesignated({ email: e.target.value });
                if (emailError && isValidEmail(e.target.value)) {
                  setEmailError('');
                }
              }}
              onBlur={(e) => validateEmail(e.target.value)}
              error={!!emailError || !!errors?.designatedContact?.email}
              helperText={emailError || errors?.designatedContact?.email}
              inputProps={{ inputMode: 'email' }}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AccountQuestionsContactSection;