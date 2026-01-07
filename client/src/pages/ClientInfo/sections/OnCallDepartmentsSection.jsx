import React from 'react';
import { Box, TextField, Button, Paper, Typography, Grid, Checkbox, FormControlLabel, MenuItem, Select, List, ListItem, ListItemText } from '@mui/material';
import { useWizard } from '../context_API/WizardContext';
import FieldRow from '../components/FieldRow';

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const OnCallDepartmentsSection = ({ errors = [], onCall = {}, setOnCall = () => {} }) => {
  const { formData, updateSection } = useWizard();
  const rows = Array.isArray(formData.onCall?.departments) ? formData.onCall.departments : [];
  const team = Array.isArray(formData.onCall?.team) ? formData.onCall.team : [];

  // Convert legacy row shape to new shape safely when rendering
  const normalizedRows = rows.map((r) => ({
    id: r.id || generateId(),
    department: r.department || r.name || '',
    members: Array.isArray(r.members) ? r.members : [],
    contact: r.contact || r.contact || '',
    contactMemberId: r.contactMemberId || null,
  }));

  const persist = (next) => {
    updateSection('onCall', { ...formData.onCall, departments: next });
  };

  const setRow = (index, payload) => {
    const next = normalizedRows.map((r, i) => (i === index ? { ...r, ...payload } : r));
    persist(next);
  };

  const addRow = () => {
    const next = [
      ...normalizedRows,
      { id: generateId(), department: '', members: [], contact: '', contactMemberId: null },
    ];
    persist(next);
  };

  const removeRow = (index) => {
    const next = normalizedRows.filter((_, i) => i !== index);
    persist(next);
  };

  const toggleMember = (index, memberId) => {
    const next = normalizedRows.map((r, i) => {
      if (i !== index) return r;
      const members = new Set(r.members || []);
      if (members.has(memberId)) members.delete(memberId); else members.add(memberId);
      return { ...r, members: Array.from(members) };
    });
    persist(next);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Teams</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Define teams (departments/roles) and check which team members belong to each team.
      </Typography>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {normalizedRows.map((row, idx) => (
          <Paper key={row.id} variant="outlined" sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} md={4}>
                <FieldRow helperText={errors[idx]?.department}>
                  <TextField
                    label="Team / Department"
                    value={row.department}
                    onChange={(e) => setRow(idx, { department: e.target.value })}
                    fullWidth
                    error={!!errors[idx]?.department}
                  />
                </FieldRow>
                <Box sx={{ mt: 1 }}>
                  <Select
                    value={row.contactMemberId || ''}
                    onChange={(e) => setRow(idx, { contactMemberId: e.target.value || null })}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="">No default contact</MenuItem>
                    {team.map((m) => (
                      <MenuItem key={m.id} value={m.id}>{m.name || m.id}</MenuItem>
                    ))}
                  </Select>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Members</Typography>
                <List dense>
                  {team.map((member) => (
                    <ListItem key={member.id} sx={{ py: 0 }}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={Array.isArray(row.members) && row.members.includes(member.id)}
                            onChange={() => toggleMember(idx, member.id)}
                          />
                        )}
                        label={<ListItemText primary={member.name || member.id} secondary={member.title || ''} />}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12} md={2}>
                <Button color="error" size="small" onClick={() => removeRow(idx)}>Remove</Button>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={addRow}>Add Team</Button>
      </Box>
    </Box>
  );
};

export default OnCallDepartmentsSection;
