// src/pages/ClientInfo/sections/CallFilteringSection.jsx

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
  Divider,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { FilterAlt } from '@mui/icons-material';
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';

export default function CallFilteringSection({ errors = {} }) {
  const theme = useTheme();
  const { darkMode } = useClientInfoTheme();
  const { formData, updateSection } = useWizard();

  const companyInfo = formData.companyInfo || {};
  const callFiltering = companyInfo.callFiltering || {
    roboCallBlocking: null,
    businessGreeting: null,
    checkInRecording: null,
  };

  const handleChange = (field, value) => {
    const updates = {
      ...callFiltering,
      [field]: value === 'yes',
    };

    // If robo-call blocking is YES, skip business greeting question (set to null)
    if (field === 'roboCallBlocking' && value === 'yes') {
      updates.businessGreeting = null;
    }

    updateSection('companyInfo', {
      callFiltering: updates,
    });
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.warning.main, 0.15),
            color: theme.palette.warning.main,
          }}
        >
          <FilterAlt fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
            Call Filtering
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure how to filter and handle incoming calls
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={4}>
        {/* Question 1: Robo-call Blocking */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            1. Would you like robo-call blocking?
          </Typography>
          <FormControl component="fieldset" error={Boolean(errors.roboCallBlocking)} fullWidth>
            <RadioGroup
              value={callFiltering.roboCallBlocking === null ? '' : callFiltering.roboCallBlocking ? 'yes' : 'no'}
              onChange={(e) => handleChange('roboCallBlocking', e.target.value)}
            >
              <FormControlLabel
                value="yes"
                control={<Radio color="warning" />}
                label={
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Yes, enable robo-call blocking
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Automatically filter out suspected robocalls and spam
                    </Typography>
                  </Box>
                }
                sx={{ 
                  mb: 1.5, 
                  p: 2, 
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                  bgcolor: callFiltering.roboCallBlocking === true ? alpha(theme.palette.warning.main, 0.08) : 'transparent',
                }}
              />
              <FormControlLabel
                value="no"
                control={<Radio color="warning" />}
                label={
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      No, allow all calls through
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      All incoming calls will be answered by our agents
                    </Typography>
                  </Box>
                }
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                  bgcolor: callFiltering.roboCallBlocking === false ? alpha(theme.palette.warning.main, 0.08) : 'transparent',
                }}
              />
            </RadioGroup>
            {errors.roboCallBlocking && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.roboCallBlocking}
              </Alert>
            )}
          </FormControl>

          {callFiltering.roboCallBlocking === true && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Great! Robo-call blocking is enabled. Question 2 will be skipped.
            </Alert>
          )}
        </Box>

        <Divider />

        {/* Question 2: Business Greeting (only if robo-call blocking is NO) */}
        {callFiltering.roboCallBlocking === false && (
          <>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                2. Would you like a business greeting before connecting to an agent?
              </Typography>
              <FormControl component="fieldset" error={Boolean(errors.businessGreeting)} fullWidth>
                <RadioGroup
                  value={callFiltering.businessGreeting === null ? '' : callFiltering.businessGreeting ? 'yes' : 'no'}
                  onChange={(e) => handleChange('businessGreeting', e.target.value)}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio color="warning" />}
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          Yes, play a business greeting
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Callers will hear a brief greeting before connecting
                        </Typography>
                      </Box>
                    }
                    sx={{ 
                      mb: 1.5, 
                      p: 2, 
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                      bgcolor: callFiltering.businessGreeting === true ? alpha(theme.palette.warning.main, 0.08) : 'transparent',
                    }}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio color="warning" />}
                    label={
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          No, connect directly to agent
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Callers will be connected immediately
                        </Typography>
                      </Box>
                    }
                    sx={{ 
                      p: 2, 
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                      bgcolor: callFiltering.businessGreeting === false ? alpha(theme.palette.warning.main, 0.08) : 'transparent',
                    }}
                  />
                </RadioGroup>
                {errors.businessGreeting && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {errors.businessGreeting}
                  </Alert>
                )}
              </FormControl>
            </Box>

            <Divider />
          </>
        )}

        {/* Question 3: Check-in Recording (independent question) */}
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            {callFiltering.roboCallBlocking === false ? '3' : '2'}. Would you like a check-in recording?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This is independent of the previous questions and applies to all calls.
          </Typography>
          <FormControl component="fieldset" error={Boolean(errors.checkInRecording)} fullWidth>
            <RadioGroup
              value={callFiltering.checkInRecording === null ? '' : callFiltering.checkInRecording ? 'yes' : 'no'}
              onChange={(e) => handleChange('checkInRecording', e.target.value)}
            >
              <FormControlLabel
                value="yes"
                control={<Radio color="warning" />}
                label={
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Yes, enable check-in recording
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Record caller information before connecting to agent
                    </Typography>
                  </Box>
                }
                sx={{ 
                  mb: 1.5, 
                  p: 2, 
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                  bgcolor: callFiltering.checkInRecording === true ? alpha(theme.palette.warning.main, 0.08) : 'transparent',
                }}
              />
              <FormControlLabel
                value="no"
                control={<Radio color="warning" />}
                label={
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      No check-in recording
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Skip check-in recording step
                    </Typography>
                  </Box>
                }
                sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                  bgcolor: callFiltering.checkInRecording === false ? alpha(theme.palette.warning.main, 0.08) : 'transparent',
                }}
              />
            </RadioGroup>
            {errors.checkInRecording && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.checkInRecording}
              </Alert>
            )}
          </FormControl>
        </Box>

        {/* Summary Alert */}
        {(callFiltering.roboCallBlocking !== null || 
          callFiltering.businessGreeting !== null || 
          callFiltering.checkInRecording !== null) && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
              Call Filtering Summary:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              <li>Robo-call blocking: {callFiltering.roboCallBlocking === true ? 'Enabled' : callFiltering.roboCallBlocking === false ? 'Disabled' : 'Not set'}</li>
              {callFiltering.roboCallBlocking === false && (
                <li>Business greeting: {callFiltering.businessGreeting === true ? 'Enabled' : callFiltering.businessGreeting === false ? 'Disabled' : 'Not set'}</li>
              )}
              <li>Check-in recording: {callFiltering.checkInRecording === true ? 'Enabled' : callFiltering.checkInRecording === false ? 'Disabled' : 'Not set'}</li>
            </Box>
          </Alert>
        )}
      </Stack>
    </Box>
  );
}
