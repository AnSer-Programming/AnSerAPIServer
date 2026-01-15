// src/pages/ClientInfo/components/HolidayMultiDatePicker.jsx

import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material';

const formatDate = (value) => {
  if (!value) return '';
  try {
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return value;
    const dateObj = new Date(Date.UTC(year, month - 1, day));
    return dateObj.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (error) {
    return value;
  }
};

const normalize = (value) => {
  if (!value) return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  // Force YYYY-MM-DD formatting
  const [year, month, day] = trimmed.split('-');
  if (!year || !month || !day) return '';
  return [year.padStart(4, '0'), month.padStart(2, '0'), day.padStart(2, '0')].join('-');
};

const HolidayMultiDatePicker = ({
  label = 'Add another date',
  value = [],
  onChange,
  disabled = false,
  helperText = 'Use the calendar to add each observed date. You can remove any date using the chips below.',
}) => {
  const [pendingDate, setPendingDate] = useState('');
  const [error, setError] = useState('');

  const sortedDates = useMemo(() => {
    if (!Array.isArray(value)) return [];
    return [...value].sort((a, b) => a.localeCompare(b));
  }, [value]);

  const emitChange = (next) => {
    if (typeof onChange === 'function') {
      onChange(next);
    }
  };

  const handleAdd = () => {
    if (!pendingDate) {
      setError('Pick a date before adding.');
      return;
    }

    const normalized = normalize(pendingDate);
    if (!normalized) {
      setError('Invalid date format.');
      return;
    }

    if (sortedDates.includes(normalized)) {
      setError('That date is already listed.');
      return;
    }

    const next = [...sortedDates, normalized].sort((a, b) => a.localeCompare(b));
    emitChange(next);
    setPendingDate('');
    setError('');
  };

  const handleRemove = (target) => {
    const next = sortedDates.filter((item) => item !== target);
    emitChange(next);
  };

  const handleDateChange = (event) => {
    if (error) setError('');
    setPendingDate(event.target.value);
  };

  return (
    <Box sx={{ mt: 1.5 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
        <TextField
          type="date"
          size="small"
          value={pendingDate}
          onChange={handleDateChange}
          disabled={disabled}
          sx={{ maxWidth: 220 }}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={handleAdd} disabled={disabled}>
          Add Date
        </Button>
      </Stack>
      {helperText && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {helperText}
        </Typography>
      )}
      {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
          {error}
        </Typography>
      )}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
        {sortedDates.map((date) => (
          <Chip
            key={date}
            label={formatDate(date)}
            onDelete={disabled ? undefined : () => handleRemove(date)}
            sx={{ mb: 1 }}
          />
        ))}
        {sortedDates.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No extra holiday dates yet.
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

HolidayMultiDatePicker.propTypes = {
  label: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
};

export default HolidayMultiDatePicker;
