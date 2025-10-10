import React from 'react';
import { Box, FormControlLabel, Checkbox, TextField, Typography } from '@mui/material';

const NotificationRulesSection = ({ data = {}, onChange, errors = {} }) => {
  const toggle = (field) => () => {
    onChange?.({ ...data, [field]: !data[field] });
  };

  const handleChange = (e) => {
    onChange?.({ ...data, callTypes: e.target.value });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Notification Rules</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Choose when we should immediately notify your team. You can select more than one option.
      </Typography>
      <FormControlLabel
        control={<Checkbox checked={!!data.allCalls} onChange={toggle('allCalls')} />}
        label="Notify us for every message"
      />
      <FormControlLabel
        control={<Checkbox checked={!!data.holdAll} onChange={toggle('holdAll')} />}
        label="Hold all dispatches until someone reviews"
      />
      <FormControlLabel
        control={<Checkbox checked={!!data.cannotWait} onChange={toggle('cannotWait')} />}
        label="Escalate when caller says it cannot wait"
      />
      <FormControlLabel
        control={<Checkbox checked={!!data.emergencyOnly} onChange={toggle('emergencyOnly')} />}
        label="Emergency-only notifications"
      />
      <TextField
        label="Specific Call Types (define below)"
        value={data.callTypes || ''}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        sx={{ mt: 2 }}
        error={Boolean(errors.callTypes)}
        helperText={errors.callTypes || 'List any additional call types or instructions for when to page or email your team.'}
      />
    </Box>
  );
};

export default NotificationRulesSection;
