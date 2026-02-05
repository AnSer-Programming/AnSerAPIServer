import React from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
  Divider,
  Stack,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

const OnCallRotationSection = ({ data = {}, onChange, errors = {} }) => {
  const theme = useTheme();
  const set = (patch) => onChange?.({ ...data, ...patch });
  return (
    <Box sx={{ px: 1 }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
            On Call Rotation Schedule
          </Typography>
          <Typography variant="body2" color="text.secondary">
            How often does the on-call rotation change?
          </Typography>
        </Box>

        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.6) }} />

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
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
              placeholder="e.g., Monday - or - 15th"
              value={data.dayOrDate || ''}
              onChange={(e) => set({ dayOrDate: e.target.value })}
              fullWidth
              error={!!errors.dayOrDate}
              helperText={errors.dayOrDate}
            />
          </Grid>
        </Grid>

        <TextField
          label="Other - please explain"
          value={data.otherExplain || ''}
          onChange={(e) => set({ otherExplain: e.target.value })}
          fullWidth
          multiline
          minRows={2}
          error={!!errors.otherExplain}
          helperText={errors.otherExplain}
        />
      </Stack>
    </Box>
  );
};

export default OnCallRotationSection;
