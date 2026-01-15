import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Select, MenuItem, Typography, FormControl } from '@mui/material';
import { HOURS_12, MINUTE_INTERVALS, MERIDIEMS } from '../constants/config';

const DayTimeRangePicker = ({ day, type, values, onChange, showHeader }) => {
  const handleChange = (field, value) => {
    onChange(type, day, field, value);
  };

  return (
    <>
      {showHeader && (
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={2}></Grid>

          <Grid item xs={5}>
            <Typography align="center" variant="subtitle2" fontWeight="bold">
              Start Time
            </Typography>
            <Grid container>
              <Grid item xs={4}><Typography variant="caption" align="center">Hour</Typography></Grid>
              <Grid item xs={4}><Typography variant="caption" align="center">Minute</Typography></Grid>
              <Grid item xs={4}><Typography variant="caption" align="center">AM/PM</Typography></Grid>
            </Grid>
          </Grid>

          <Grid item xs={5}>
            <Typography align="center" variant="subtitle2" fontWeight="bold">
              End Time
            </Typography>
            <Grid container>
              <Grid item xs={4}><Typography variant="caption" align="center">Hour</Typography></Grid>
              <Grid item xs={4}><Typography variant="caption" align="center">Minute</Typography></Grid>
              <Grid item xs={4}><Typography variant="caption" align="center">AM/PM</Typography></Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      <Grid container spacing={1} alignItems="center" sx={{ mb: 1 }}>
        <Grid item xs={2}>
          <Typography>{day.charAt(0).toUpperCase() + day.slice(1)}</Typography>
        </Grid>

        {/* Start Time */}
        <Grid item xs={5}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <Select
                  value={values.startHour || ''}
                  onChange={(e) => handleChange('startHour', e.target.value)}
                >
                  {HOURS_12.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <Select
                  value={values.startMinute || ''}
                  onChange={(e) => handleChange('startMinute', e.target.value)}
                >
                  {MINUTE_INTERVALS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <Select
                  value={values.startMeridiem || ''}
                  onChange={(e) => handleChange('startMeridiem', e.target.value)}
                >
                  {MERIDIEMS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {/* End Time */}
        <Grid item xs={5}>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <Select
                  value={values.endHour || ''}
                  onChange={(e) => handleChange('endHour', e.target.value)}
                >
                  {HOURS_12.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <Select
                  value={values.endMinute || ''}
                  onChange={(e) => handleChange('endMinute', e.target.value)}
                >
                  {MINUTE_INTERVALS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <Select
                  value={values.endMeridiem || ''}
                  onChange={(e) => handleChange('endMeridiem', e.target.value)}
                >
                  {MERIDIEMS.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

DayTimeRangePicker.propTypes = {
  day: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  values: PropTypes.shape({
    startHour: PropTypes.string,
    startMinute: PropTypes.string,
    startMeridiem: PropTypes.string,
    endHour: PropTypes.string,
    endMinute: PropTypes.string,
    endMeridiem: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
  showHeader: PropTypes.bool,
};

export default DayTimeRangePicker;
