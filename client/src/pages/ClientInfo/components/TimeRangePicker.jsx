// TimeRangePicker.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import TwelveHourTimeField from './TwelveHourTimeField';
import { normalizeTime24h } from '../utils/timeFormatting';

const pad2 = (value) => String(value).padStart(2, '0');

const toTimeValue = (hour, minute) => {
  const hourText = String(hour ?? '').trim();
  const minuteText = String(minute ?? '').trim();
  if (!hourText || !minuteText) return '';

  const hourNum = Number(hourText);
  const minuteNum = Number(minuteText);
  if (Number.isNaN(hourNum) || Number.isNaN(minuteNum)) return '';
  if (hourNum < 0 || hourNum > 23 || minuteNum < 0 || minuteNum > 59) return '';

  return `${pad2(hourNum)}:${pad2(minuteNum)}`;
};

const fromTimeValue = (timeValue) => {
  const normalized = normalizeTime24h(timeValue);
  if (!normalized) {
    return { hour: '', minute: '' };
  }

  const [hour, minute] = normalized.split(':');
  return { hour, minute };
};

const TimeRangePicker = ({ label, value = {}, onChange }) => {
  const updateRange = (patch) => {
    onChange({ ...value, ...patch });
  };

  const handleStartChange = (nextValue) => {
    const { hour, minute } = fromTimeValue(nextValue);
    updateRange({ startHour: hour, startMinute: minute });
  };

  const handleEndChange = (nextValue) => {
    const { hour, minute } = fromTimeValue(nextValue);
    updateRange({ endHour: hour, endMinute: minute });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TwelveHourTimeField
          label={label ? `${label} Start` : 'Start Time'}
          value={toTimeValue(value.startHour, value.startMinute)}
          onChange={handleStartChange}
          stepMinutes={5}
          emptyOptionLabel="Start time"
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TwelveHourTimeField
          label={label ? `${label} End` : 'End Time'}
          value={toTimeValue(value.endHour, value.endMinute)}
          onChange={handleEndChange}
          stepMinutes={5}
          emptyOptionLabel="End time"
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
