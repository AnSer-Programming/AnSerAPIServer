import React from 'react';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  TextField,
  Grid,
} from '@mui/material';
import { useWizard } from '../context_API/WizardContext';

const OPTIONS = [
  { key: 'all', label: '24/7/365' },
  { key: 'outsideBusiness', label: 'Outside business hours' },
  { key: 'overflow', label: 'Business hours overflow' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'emergency', label: 'Emergency Times' },
  { key: 'holidays', label: 'Holidays — please list:' },
  { key: 'other', label: 'Other — please explain:' },
];

const PlannedServiceTimesSection = () => {
  const { formData, updateSection } = useWizard();
  const prefs = formData.plannedServiceTimes || {};
  const callVolume = prefs.callVolume || { value: '', daily: false, weekly: false, monthly: false };

  const handleToggle = key => e => {
    updateSection('plannedServiceTimes', { ...prefs, [key]: !prefs[key] });
  };

  const handleChange = key => e => {
    updateSection('plannedServiceTimes', { ...prefs, [key]: e.target.value });
  };

  // For anticipated call volume fields:
  const handleCallVolumeChange = patch => {
    updateSection('plannedServiceTimes', {
      ...prefs,
      callVolume: { ...callVolume, ...patch }
    });
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ color: 'red', mb: 1, fontWeight: 700 }}>
          PLANNED TIMES TO USE <span style={{ color: '#003366' }}>ANSER’S SERVICES</span>
        <Typography variant="body2" component="span" sx={{ fontStyle: 'italic', ml: 1 }}>
          (Please check all that apply)
        </Typography>
      </Typography>
      <Grid container spacing={1} alignItems="center">
        {OPTIONS.slice(0, 5).map(opt => (
          <Grid item xs={12} sm={6} md={3} key={opt.key}>
            <FormControlLabel
              control={<Checkbox checked={!!prefs[opt.key]} onChange={handleToggle(opt.key)} />}
              label={opt.label}
            />
          </Grid>
        ))}
        {/* Holidays */}
        <Grid item xs={12} sm={6} md={6}>
          <FormControlLabel
            control={<Checkbox checked={!!prefs.holidays} onChange={handleToggle('holidays')} />}
            label={OPTIONS[5].label}
          />
          <TextField
            size="small"
            fullWidth
            placeholder="List holidays here"
            value={prefs.holidayList || ''}
            onChange={handleChange('holidayList')}
            sx={{ mt: 1 }}
            disabled={!prefs.holidays}
          />
        </Grid>
        {/* Other */}
        <Grid item xs={12} sm={6} md={6}>
          <FormControlLabel
            control={<Checkbox checked={!!prefs.other} onChange={handleToggle('other')} />}
            label={OPTIONS[6].label}
          />
          <TextField
            size="small"
            fullWidth
            placeholder="Explain other service times"
            value={prefs.otherExplain || ''}
            onChange={handleChange('otherExplain')}
            sx={{ mt: 1 }}
            disabled={!prefs.other}
          />
        </Grid>
        {/* --------- ANTICIPATED CALL VOLUME SECTION (Moved to bottom) --------- */}
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              flexWrap: 'wrap',
              width: '100%',
              py: 2,
              pl: { xs: 0, md: 2 },
            }}
          >
            <Typography sx={{ color: '#b00', fontWeight: 700, fontSize: 18, mr: 1, minWidth: 235 }}>
              WHAT IS YOUR ANTICIPATED CALL VOLUME?
            </Typography>
            <TextField
              value={callVolume.value}
              onChange={e => handleCallVolumeChange({ value: e.target.value.replace(/[^\d]/g, '').slice(0, 6) })}
              size="small"
              sx={{
                minWidth: 110,
                bgcolor: '#e8f1fe',
                borderRadius: 1,
              }}
              inputProps={{
                inputMode: 'numeric',
                pattern: '[0-9]*',
                style: { textAlign: 'center' }
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!callVolume.daily}
                  onChange={e => handleCallVolumeChange({ daily: e.target.checked })}
                />
              }
              label="Daily"
              sx={{ ml: 2, minWidth: 70 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!callVolume.weekly}
                  onChange={e => handleCallVolumeChange({ weekly: e.target.checked })}
                />
              }
              label="Weekly"
              sx={{ ml: 1, minWidth: 85 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!callVolume.monthly}
                  onChange={e => handleCallVolumeChange({ monthly: e.target.checked })}
                />
              }
              label="Monthly"
              sx={{ ml: 1, minWidth: 90 }}
            />
          </Box>
        </Grid>
        {/* --------- END CALL VOLUME SECTION --------- */}
      </Grid>
    </Box>
  );
};

export default PlannedServiceTimesSection;
