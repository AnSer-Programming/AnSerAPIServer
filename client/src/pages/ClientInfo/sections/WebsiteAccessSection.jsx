// src/pages/ClientInfo/sections/WebsiteAccessSection.jsx

import React from 'react';
import {
  Box,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  Stack,
  Alert,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { Language } from '@mui/icons-material';
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';

export default function WebsiteAccessSection({ errors = {} }) {
  const theme = useTheme();
  const { darkMode } = useClientInfoTheme();
  const { formData, updateSection } = useWizard();

  const companyInfo = formData.companyInfo || {};
  const websiteAccess = companyInfo.websiteAccess || { hasWebsite: null };
  const hasWebsite = websiteAccess.hasWebsite;

  const handleChange = (value) => {
    const nextHasWebsite = value === 'yes';
    updateSection('companyInfo', {
      websiteAccess: {
        ...websiteAccess,
        hasWebsite: nextHasWebsite,
        required: nextHasWebsite,
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
            bgcolor: alpha(theme.palette.primary.main, 0.15),
            color: theme.palette.primary.main,
          }}
        >
          <Language fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
            Website Access
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Does your company have a website?
          </Typography>
        </Box>
      </Stack>

      <FormControl component="fieldset" error={Boolean(errors.hasWebsite)} fullWidth>
        <RadioGroup
          value={hasWebsite === true ? 'yes' : hasWebsite === false ? 'no' : ''}
          onChange={(e) => handleChange(e.target.value)}
        >
          <FormControlLabel
            value="yes"
            control={<Radio color="primary" />}
            label={
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Yes, we have a website
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Your company has an online presence
                </Typography>
              </Box>
            }
            sx={{ 
              mb: 2, 
              p: 2, 
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              bgcolor: hasWebsite === true ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
            }}
          />
          <FormControlLabel
            value="no"
            control={<Radio color="primary" />}
            label={
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  No website
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Your company does not have a website
                </Typography>
              </Box>
            }
            sx={{ 
              p: 2, 
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              bgcolor: hasWebsite === false ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
            }}
          />
        </RadioGroup>

        {errors.hasWebsite && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.hasWebsite}
          </Alert>
        )}

        {hasWebsite === true || hasWebsite === false ? (
          <Alert 
            severity="info" 
            sx={{ mt: 2 }}
          >
            {hasWebsite 
              ? 'Great! We will note that your company has a website.' 
              : 'No problem. We will note that your company does not have a website.'}
          </Alert>
        ) : null}
      </FormControl>
    </Box>
  );
}
