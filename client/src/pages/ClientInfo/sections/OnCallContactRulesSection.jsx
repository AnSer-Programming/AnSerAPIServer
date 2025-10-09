import React from 'react';
import { Typography, Checkbox, FormControlLabel, Grid, TextField, Paper, Box } from '@mui/material';

const OnCallContactRulesSection = ({ data = {}, onChange, errors = {} }) => {
  const set = (patch) => onChange?.({ ...data, ...patch });

  const handleToggle = (key) => (e) => {
    const checked = e.target.checked;
    // Avoid contradictory states
    if (key === 'allCalls' && checked) {
      set({
        allCalls: true,
        callerCannotWait: false,
        emergencyOnly: false,
        specificCallTypes: false,
        holdAllCalls: false,
      });
      return;
    }
    if (key === 'holdAllCalls' && checked) {
      set({
        allCalls: false,
        callerCannotWait: false,
        emergencyOnly: false,
        specificCallTypes: false,
        holdAllCalls: true,
      });
      return;
    }
    set({ [key]: checked });
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1, color: '#b00', fontWeight: 700 }}>
        When should AnSer contact your On-Call staff?
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={<Checkbox checked={!!data.allCalls} onChange={handleToggle('allCalls')} />}
            label="All calls"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={<Checkbox checked={!!data.callerCannotWait} onChange={handleToggle('callerCannotWait')} />}
            label="Caller says it cannot wait"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={<Checkbox checked={!!data.holdAllCalls} onChange={handleToggle('holdAllCalls')} />}
            label="Hold all calls"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={<Checkbox checked={!!data.emergencyOnly} onChange={handleToggle('emergencyOnly')} />}
            label="Emergency only (define below)"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={<Checkbox checked={!!data.specificCallTypes} onChange={handleToggle('specificCallTypes')} />}
            label="Specific call types (define below)"
          />
        </Grid>
      </Grid>

      {/* Conditional details */}
      {data.emergencyOnly && (
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Define what qualifies as an emergency for this account"
            value={data.emergencyDefinition || ''}
            onChange={(e) => set({ emergencyDefinition: e.target.value })}
            fullWidth
            multiline
            minRows={3}
            error={!!errors.emergencyDefinition}
            helperText={errors.emergencyDefinition}
          />
        </Box>
      )}

      {data.specificCallTypes && (
        <Box sx={{ mt: 2 }}>
          <TextField
            label="List specific call types that require on-call contact"
            value={data.specificTypes || ''}
            onChange={(e) => set({ specificTypes: e.target.value })}
            fullWidth
            multiline
            minRows={3}
            placeholder="e.g., equipment failure, patient discharge, security alert…"
            error={!!errors.specificTypes}
            helperText={errors.specificTypes}
          />
        </Box>
      )}

      {/* General notes */}
      <TextField
        sx={{ mt: 2 }}
        label="Notes / definitions (additional context)"
        value={data.notes || ''}
        onChange={(e) => set({ notes: e.target.value })}
        fullWidth
        multiline
        minRows={3}
        error={!!errors.notes}
        helperText={errors.notes}
      />
    </Paper>
  );
};

export default OnCallContactRulesSection;
