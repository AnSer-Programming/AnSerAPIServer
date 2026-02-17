import React, { useMemo } from 'react';
import { MenuItem, TextField } from '@mui/material';
import { buildTimeOptions, normalizeTime24h } from '../utils/timeFormatting';

const TwelveHourTimeField = ({
  value,
  onChange,
  stepMinutes = 15,
  includeEmptyOption = true,
  emptyOptionLabel = 'Select time',
  SelectProps,
  ...textFieldProps
}) => {
  const options = useMemo(() => buildTimeOptions(stepMinutes), [stepMinutes]);
  const normalizedValue = normalizeTime24h(value);

  return (
    <TextField
      select
      {...textFieldProps}
      value={normalizedValue}
      onChange={(event) => onChange?.(event.target.value)}
      SelectProps={{
        displayEmpty: includeEmptyOption,
        ...SelectProps,
      }}
    >
      {includeEmptyOption && (
        <MenuItem value="">
          <em>{emptyOptionLabel}</em>
        </MenuItem>
      )}
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default TwelveHourTimeField;
