import React from 'react';
import {
  Typography,
  TextField,
  Paper,
  Grid,
  Box,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';

const OnCallProceduresSection = ({ data = {}, onChange, errors = {} }) => {
  const set = (patch) => onChange?.({ ...data, ...patch });

  const sameAs = !!data.businessHoursSameAsOnCall;

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1, color: '#b00', fontWeight: 700 }}>
        On Call Procedures
      </Typography>

      <TextField
        label="Please outline the order and how we are to notify the on call and escalation procedures (if no answer/response)."
        value={data.onCallProcedures || ''}
        onChange={(e) => set({ onCallProcedures: e.target.value })}
        fullWidth
        multiline
        minRows={4}
        sx={{ mb: 2 }}
        error={!!errors.onCallProcedures}
        helperText={errors.onCallProcedures}
      />

      {/* Quick parameters to structure the free text above */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
          Quick parameters (optional)
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Attempts"
              type="number"
              inputProps={{ min: 0 }}
              value={data.attempts ?? ''}
              onChange={(e) => set({ attempts: e.target.value === '' ? '' : Number(e.target.value) })}
              fullWidth
              error={!!errors.attempts}
              helperText={errors.attempts}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Minutes between attempts"
              type="number"
              inputProps={{ min: 0 }}
              value={data.minutesBetweenAttempts ?? ''}
              onChange={(e) =>
                set({ minutesBetweenAttempts: e.target.value === '' ? '' : Number(e.target.value) })
              }
              fullWidth
              error={!!errors.minutesBetweenAttempts}
              helperText={errors.minutesBetweenAttempts}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Escalate after (min)"
              type="number"
              inputProps={{ min: 0 }}
              value={data.escalateAfterMinutes ?? ''}
              onChange={(e) =>
                set({ escalateAfterMinutes: e.target.value === '' ? '' : Number(e.target.value) })
              }
              fullWidth
              error={!!errors.escalateAfterMinutes}
              helperText={errors.escalateAfterMinutes}
            />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              label="Escalate to (name/role/number)"
              value={data.escalateTo || ''}
              onChange={(e) => set({ escalateTo: e.target.value })}
              fullWidth
              error={!!errors.escalateTo}
              helperText={errors.escalateTo}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!data.stopAfterSuccessfulContact}
                  onChange={(e) => set({ stopAfterSuccessfulContact: e.target.checked })}
                />
              }
              label="Stop after successful contact"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!data.leaveVoicemail}
                  onChange={(e) => set({ leaveVoicemail: e.target.checked })}
                />
              }
              label="Leave voicemail if no answer"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!data.smsOk}
                  onChange={(e) => set({ smsOk: e.target.checked })}
                />
              }
              label="SMS allowed"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!data.emailOk}
                  onChange={(e) => set({ emailOk: e.target.checked })}
                />
              }
              label="Email allowed"
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" sx={{ mb: 1, color: '#b00', fontWeight: 700 }}>
        Notification Procedures for Business Hours
      </Typography>

      <FormControlLabel
        sx={{ mb: 1 }}
        control={
          <Checkbox
            checked={sameAs}
            onChange={(e) => set({ businessHoursSameAsOnCall: e.target.checked })}
          />
        }
        label="Same as on-call procedures"
      />

      <TextField
        label="If different from above, explain what we should do with calls during business hours."
        value={data.businessHoursNotification || ''}
        onChange={(e) => set({ businessHoursNotification: e.target.value })}
        fullWidth
        multiline
        minRows={4}
        disabled={sameAs}
        error={!!errors.businessHoursNotification}
        helperText={
          errors.businessHoursNotification ||
          (sameAs ? 'Using the same procedure as On Call.' : '')
        }
      />
    </Paper>
  );
};

export default OnCallProceduresSection;
