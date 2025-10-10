import React from 'react';
import { Box, TextField, Button, Paper, Typography, Grid } from '@mui/material';
import { useWizard } from '../context_API/WizardContext';

const OnCallDepartmentsSection = ({ errors = [] }) => {
  const { formData, updateSection } = useWizard();
  const rows = Array.isArray(formData.onCall?.departments) ? formData.onCall.departments : [];

  const setRow = (index, payload) => {
    const next = rows.map((r, i) => (i === index ? { ...r, ...payload } : r));
    updateSection('onCall', { ...formData.onCall, departments: next });
  };

  const addRow = () => {
    const next = [
      ...rows,
      { department: '', contact: '' }
    ];
    updateSection('onCall', { ...formData.onCall, departments: next });
  };

  const removeRow = (index) => {
    const next = rows.filter((_, i) => i !== index);
    updateSection('onCall', { ...formData.onCall, departments: next });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">On-Call Departments</Typography>
      <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
        {rows.map((row, idx) => (
          <Paper key={idx} variant="outlined" sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={5}>
                <TextField
                  label="Department"
                  value={row.department}
                  onChange={(e) => setRow(idx, { department: e.target.value })}
                  fullWidth
                  error={!!errors[idx]?.department}
                  helperText={errors[idx]?.department}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Contact Info"
                  value={row.contact}
                  onChange={(e) => setRow(idx, { contact: e.target.value })}
                  fullWidth
                  error={!!errors[idx]?.contact}
                  helperText={errors[idx]?.contact}
                />
              </Grid>
              <Grid item xs={2}>
                <Button color="error" size="small" onClick={() => removeRow(idx)}>
                  Remove
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={addRow}>Add Department</Button>
      </Box>
    </Box>
  );
};

export default OnCallDepartmentsSection;
