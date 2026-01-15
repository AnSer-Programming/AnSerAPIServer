// src/pages/ClientInfo/sections/DailyRecapSection.jsx

import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  Alert,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { Summarize } from '@mui/icons-material';
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';
import { isValidEmail, getEmailError } from '../utils/emailValidation';

const DailyRecapSection = ({ errors = {} }) => {
  const theme = useTheme();
  const { darkMode } = useClientInfoTheme();
  const { formData, updateSection } = useWizard();
  const [emailError, setEmailError] = useState('');

  const dailyRecap = formData.companyInfo?.dailyRecap || {
    enabled: false,
    deliveryTime: '17:00',
    deliveryMethod: 'email',
    emailAddress: '',
    includeDetails: true,
  };

  const handleChange = (field, value) => {
    updateSection('companyInfo', {
      dailyRecap: {
        ...dailyRecap,
        [field]: value,
      },
    });
  };

  const validateEmail = (email) => {
    setEmailError(getEmailError(email));
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.secondary.main, 0.15),
            color: theme.palette.secondary.main,
          }}
        >
          <Summarize fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
            Daily Recap Reports
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Receive automated daily summaries of call activity
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={dailyRecap.enabled || false}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              color="secondary"
            />
          }
          label={
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Enable daily recap reports
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Get a summary of all calls handled each day
              </Typography>
            </Box>
          }
        />

        {dailyRecap.enabled && (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.secondary.main, 0.08),
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
            }}
          >
            <Stack spacing={2}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ mb: 1, fontWeight: 600 }}>
                  Delivery Method
                </FormLabel>
                <RadioGroup
                  value={dailyRecap.deliveryMethod || 'email'}
                  onChange={(e) => handleChange('deliveryMethod', e.target.value)}
                >
                  <FormControlLabel value="email" control={<Radio />} label="Email" />
                  <FormControlLabel value="fax" control={<Radio />} label="Fax" />
                  <FormControlLabel value="both" control={<Radio />} label="Both Email & Fax" />
                </RadioGroup>
              </FormControl>

              {(dailyRecap.deliveryMethod === 'email' || dailyRecap.deliveryMethod === 'both') && (
                <TextField
                  label="Email Address"
                  type="email"
                  value={dailyRecap.emailAddress || ''}
                  onChange={(e) => {
                    handleChange('emailAddress', e.target.value);
                    // Clear error as user types if they've fixed it
                    if (emailError && isValidEmail(e.target.value)) {
                      setEmailError('');
                    }
                  }}
                  onBlur={(e) => validateEmail(e.target.value)}
                  placeholder="reports@company.com"
                  fullWidth
                  size="small"
                  error={Boolean(emailError || errors.emailAddress)}
                  helperText={emailError || errors.emailAddress || 'Where to send daily recap reports'}
                />
              )}

              <TextField
                label="Delivery Time"
                type="time"
                value={dailyRecap.deliveryTime || '17:00'}
                onChange={(e) => handleChange('deliveryTime', e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                helperText="What time each day should the recap be delivered?"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={dailyRecap.includeDetails || false}
                    onChange={(e) => handleChange('includeDetails', e.target.checked)}
                    color="secondary"
                  />
                }
                label="Include detailed call information (caller names, times, notes)"
              />

              <Alert severity="info" sx={{ mt: 1 }}>
                Daily recaps will be delivered at {dailyRecap.deliveryTime || '5:00 PM'} each day via {dailyRecap.deliveryMethod}
              </Alert>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default DailyRecapSection;
