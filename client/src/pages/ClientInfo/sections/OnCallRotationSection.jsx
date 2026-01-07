import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
  Paper,
} from '@mui/material';

const OnCallRotationSection = ({ data = {}, onChange, errors = {} }) => {
  const set = (patch) => onChange?.({ ...data, ...patch });

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1, color: '#b00', fontWeight: 700 }}>
        On Call Rotation Schedule
      </Typography>

      <Box sx={{ pl: 1, mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          Change cadence
        </Typography>
        <RadioGroup
          row
          value={data.frequency || ''}
          onChange={(e) => set({ frequency: e.target.value })}
        >
          <FormControlLabel value="daily" control={<Radio />} label="Daily" />
          <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
          <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
        </RadioGroup>
      </Box>

      <Grid container spacing={2} sx={{ mb: 1 }}>
        <Grid item xs={12} md={4}>
          <TextField
            label="On Call change begins at (Time)"
            type="time"
            value={data.changeBeginsTime || ''}
            onChange={(e) => set({ changeBeginsTime: e.target.value })}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 900 }} // 15-minute increments
            fullWidth
            error={!!errors.changeBeginsTime}
            helperText={errors.changeBeginsTime}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            label="On Day of Week or Date of Month"
            placeholder="e.g., Monday • or • 15th"
            value={data.dayOrDate || ''}
            onChange={(e) => set({ dayOrDate: e.target.value })}
            fullWidth
            error={!!errors.dayOrDate}
            helperText={errors.dayOrDate}
          />
        </Grid>
      </Grid>

      <TextField
        label="Other — please explain"
        value={data.otherExplain || ''}
        onChange={(e) => set({ otherExplain: e.target.value })}
        fullWidth
        multiline
        minRows={2}
        error={!!errors.otherExplain}
        helperText={errors.otherExplain}
      />
    </Paper>
  );
};

export default OnCallRotationSection;
