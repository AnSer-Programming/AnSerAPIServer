// src/pages/ClientInfo/sections/SpecialEventsSection.jsx

import React from 'react';
import { Typography, Divider, Paper, TextField, Button, Box } from '@mui/material';
import TimeRangePicker from '../components/TimeRangePicker';
import FieldRow from '../components/FieldRow';

const SpecialEventsSection = ({ events = [], onChange, errors = [] }) => (
  <>
    <Divider sx={{ my: 3 }} />
    <Typography variant="h6" gutterBottom>Holidays & Special Events</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
      Capture any one-off closure or schedule change so our team can plan ahead. Examples include staff retreats, building maintenance, or annual inventory counts.
    </Typography>

    {events.map((ev, i) => (
      <Paper key={ev.id || i} variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FieldRow helperText={errors[i]?.name || 'Example: Summer maintenance shutdown'}>
            <TextField
              label="Event Name"
              value={ev.name || ''}
              onChange={(e) => {
                const copy = [...events];
                copy[i] = { ...copy[i], name: e.target.value };
                onChange(copy);
              }}
              error={!!errors[i]?.name}
            />
          </FieldRow>
          <FieldRow helperText={errors[i]?.date || 'Pick the first day this schedule change begins'}>
            <TextField
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={ev.date || ''}
              onChange={(e) => {
                const copy = [...events];
                copy[i] = { ...copy[i], date: e.target.value };
                onChange(copy);
              }}
              error={!!errors[i]?.date}
            />
          </FieldRow>
        </Box>

        <TimeRangePicker
          label="Hours"
          value={ev.hours ?? { startHour: '09', startMinute: '00', endHour: '17', endMinute: '00' }}
          onChange={(val) => {
            const copy = [...events];
            copy[i] = { ...copy[i], hours: val };
            onChange(copy);
          }}
        />

        <Button size="small" color="error" sx={{ mt: 1 }} onClick={() => onChange(events.filter((_, idx) => idx !== i))}>
          Remove
        </Button>
      </Paper>
    ))}

    <Button
      variant="outlined"
      onClick={() =>
        onChange([
          ...events,
          { name: '', date: '', hours: { startHour: '09', startMinute: '00', endHour: '17', endMinute: '00' } },
        ])
      }
    >
      Add Special Event
    </Button>
  </>
);

export default SpecialEventsSection;
