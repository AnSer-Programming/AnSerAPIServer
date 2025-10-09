// src/pages/ClientInfo/components/CallVolumeSection.jsx

import React from 'react';
import {
  Box,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Grid,
} from '@mui/material';

const LEVELS = [
  { value: 'low', label: 'Low (under 25 calls)' },
  { value: 'medium', label: 'Medium (25-75 calls)' },
  { value: 'high', label: 'High (75+ calls)' },
  { value: 'custom', label: 'Custom' },
];

const ensureShape = (value) => ({
  weekday: { level: 'low', expected: '', custom: '', ...(value?.weekday || {}) },
  weekend: { level: 'low', expected: '', custom: '', ...(value?.weekend || {}) },
  peakSeasonNotes: value?.peakSeasonNotes || '',
  additionalNotes: value?.additionalNotes || '',
});

const CallVolumeSection = ({ value, onChange }) => {
  const data = ensureShape(value);

  const emit = (patch) => {
    if (typeof onChange === 'function') {
      onChange({ ...data, ...patch });
    }
  };

  const handleLevelChange = (period) => (event) => {
    emit({ [period]: { ...data[period], level: event.target.value } });
  };

  const handleFieldChange = (period, field) => (event) => {
    emit({ [period]: { ...data[period], [field]: event.target.value } });
  };

  const handleNotesChange = (field) => (event) => {
    emit({ [field]: event.target.value });
  };

  const renderPeriod = (period, label) => {
    const periodData = data[period];
    return (
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 600, color: (t) => t.palette.text.primary, mb: 1 }}>
          {label}
        </Typography>
        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} md={6}>
            <RadioGroup row name={`${period}-level`} value={periodData.level} onChange={handleLevelChange(period)}>
              {LEVELS.map((level) => (
                <FormControlLabel key={level.value} value={level.value} control={<Radio />} label={level.label} />
              ))}
            </RadioGroup>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="number"
              size="small"
              label="Typical calls"
              value={periodData.expected}
              onChange={handleFieldChange(period, 'expected')}
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            {periodData.level === 'custom' && (
              <TextField
                size="small"
                label="Custom description"
                value={periodData.custom}
                onChange={handleFieldChange(period, 'custom')}
                fullWidth
              />
            )}
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 700, color: (t) => t.palette.error.main }}>
        Call Volume Expectations
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Help our team plan staffing for your account by sharing average and peak workloads.
      </Typography>

      {renderPeriod('weekday', 'Weekday volume')}
      {renderPeriod('weekend', 'Weekend volume')}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Seasonal peaks or launch periods"
            value={data.peakSeasonNotes}
            onChange={handleNotesChange('peakSeasonNotes')}
            multiline
            minRows={2}
            fullWidth
            placeholder="Example: Tax season (Feb-Apr) doubles inbound calls."
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Additional staffing notes"
            value={data.additionalNotes}
            onChange={handleNotesChange('additionalNotes')}
            multiline
            minRows={2}
            fullWidth
            placeholder="Share any plans for marketing pushes, closures, or call routing changes."
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CallVolumeSection;
