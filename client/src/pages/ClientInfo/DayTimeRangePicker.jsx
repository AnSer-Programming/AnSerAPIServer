// src/pages/ClientInfo/DayTimeRangePicker.jsx
import React from 'react';
import { Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = ['00', '15', '30', '45'];
const ampm = ['AM', 'PM'];

const timeFieldLabelMap = {
  startHour: 'Start Hour',
  startMinute: 'Minute',
  startAmPm: 'AM/PM',
  endHour: 'End Hour',
  endMinute: 'Minute',
  endAmPm: 'AM/PM',
};

const DayTimeRangePicker = ({ day, type, values, onChange }) => {
  const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);

  return (
    <Grid container spacing={1} alignItems="center" sx={{ mb: 2 }}>
      <Grid item xs={12} sm={1.5}>
        <Typography>{dayLabel}</Typography>
      </Grid>
      {["startHour", "startMinute", "startAmPm", "endHour", "endMinute", "endAmPm"].map((fieldKey) => (
        <Grid item xs={6} sm={1.5} key={`${day}-${type}-${fieldKey}`}>
          <FormControl fullWidth size="small">
            <InputLabel>{timeFieldLabelMap[fieldKey]}</InputLabel>
            <Select
              value={values?.[fieldKey] || ''}
              onChange={(e) => onChange(type, day, fieldKey, e.target.value)}
              label={timeFieldLabelMap[fieldKey]}
            >
              {(fieldKey.includes('Hour') ? hours :
                fieldKey.includes('Minute') ? minutes : ampm).map(opt => (
                  <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      ))}
    </Grid>
  );
};

export default DayTimeRangePicker;

