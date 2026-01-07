// src/pages/ClientInfo/sections/BusinessHoursOverflowSection.jsx

import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Stack,
  Alert,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { PhoneInTalk } from '@mui/icons-material';
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';

const BusinessHoursOverflowSection = ({ errors = {} }) => {
  const theme = useTheme();
  const { darkMode } = useClientInfoTheme();
  const { formData, updateSection } = useWizard();

  const businessHoursOverflow = formData.companyInfo?.businessHoursOverflow || {
    enabled: false,
    overflowNumber: '',
    ringCount: '',
  };

  const handleChange = (field, value) => {
    updateSection('companyInfo', {
      businessHoursOverflow: {
        ...businessHoursOverflow,
        [field]: value,
      },
    });
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.info.main, 0.15),
            color: theme.palette.info.main,
          }}
        >
          <PhoneInTalk fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
            Business Hours Overflow
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure what happens when calls overflow during business hours
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={businessHoursOverflow.enabled || false}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              color="info"
            />
          }
          label={
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Enable business hours overflow
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Forward calls to another number when all lines are busy during business hours
              </Typography>
            </Box>
          }
        />

        {businessHoursOverflow.enabled && (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.info.main, 0.08),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <Stack spacing={2}>
              <TextField
                label="Overflow Number"
                value={businessHoursOverflow.overflowNumber || ''}
                onChange={(e) => handleChange('overflowNumber', e.target.value)}
                placeholder="(555) 123-4567"
                fullWidth
                size="small"
                error={Boolean(errors.overflowNumber)}
                helperText={errors.overflowNumber || 'Phone number to forward overflow calls to'}
              />

              <TextField
                label="Ring Count Before Overflow"
                type="number"
                value={businessHoursOverflow.ringCount || ''}
                onChange={(e) => handleChange('ringCount', e.target.value)}
                placeholder="4"
                fullWidth
                size="small"
                inputProps={{ min: 1, max: 10 }}
                error={Boolean(errors.ringCount)}
                helperText={errors.ringCount || 'Number of rings before forwarding (1-10)'}
              />

              <Alert severity="info" sx={{ mt: 1 }}>
                Overflow calls will be forwarded to the specified number after {businessHoursOverflow.ringCount || '4'} rings
              </Alert>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default BusinessHoursOverflowSection;
