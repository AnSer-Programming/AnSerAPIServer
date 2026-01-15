// TimeRangePicker.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField } from '@mui/material';

const TimeRangePicker = ({ label, value = {}, onChange }) => {
  const handleChange = (key, val) => {
    onChange({ ...value, [key]: val });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} sm={3}>
        <TextField
          label="Start Hour"
          type="number"
          value={value.startHour || ''}
          onChange={(e) => handleChange('startHour', e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          label="Start Minute"
          type="number"
          value={value.startMinute || ''}
          onChange={(e) => handleChange('startMinute', e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          label="End Hour"
          type="number"
          value={value.endHour || ''}
          onChange={(e) => handleChange('endHour', e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <TextField
          label="End Minute"
          type="number"
          value={value.endMinute || ''}
          onChange={(e) => handleChange('endMinute', e.target.value)}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

TimeRangePicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.shape({
    startHour: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    startMinute: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    endHour: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    endMinute: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onChange: PropTypes.func.isRequired,
};

export default TimeRangePicker;
