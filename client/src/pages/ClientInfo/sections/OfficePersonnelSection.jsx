import React from 'react';
import {
  Box, Typography, TextField, Grid, Button, Paper, Divider,
} from '@mui/material';
import { useWizard } from '../context_API/WizardContext';

/**
 * Schema per row:
 * {
 *   name: '',
 *   title: '',
 *   officePhone: '',
 *   officeExt: '',
 *   cellPhone: '',
 *   email: '',
 *   otherPhone: ''
 * }
 *
 * Back-compat: if an entry only has { role, contact }, we map:
 *   title ← role
 *   officePhone ← contact
 */
const normalizeRow = (r = {}) => ({
  name: r.name ?? '',
  title: r.title ?? r.role ?? '',
  officePhone: r.officePhone ?? r.contact ?? '',
  officeExt: r.officeExt ?? '',
  cellPhone: r.cellPhone ?? '',
  email: r.email ?? '',
  otherPhone: r.otherPhone ?? '',
});

const OfficePersonnelSection = ({ errors = {} }) => {
  const { formData, updateSection } = useWizard();
  const companyInfo = formData.companyInfo || {};
  const raw = Array.isArray(companyInfo.officePersonnel) ? companyInfo.officePersonnel : [];
  const personnel = raw.map(normalizeRow);

  const setCompany = (patch) => updateSection('companyInfo', { ...companyInfo, ...patch });
  const setPersonnel = (rows) => setCompany({ officePersonnel: rows });

  const addPerson = () =>
    setPersonnel([
      ...personnel,
      { name: '', title: '', officePhone: '', officeExt: '', cellPhone: '', email: '', otherPhone: '' },
    ]);

  const updatePerson = (i, patch) =>
    setPersonnel(personnel.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  const removePerson = (i) =>
    setPersonnel(personnel.filter((_, idx) => idx !== i));

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Additional Key Contacts
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add office/administrative contacts we may coordinate with. Do not list on-call personnel here—we'll collect them later. Examples: Scheduling Contact, Maintenance Lead, IT, HR, Regional/Local Manager, Workflow SME.
      </Typography>

      {personnel.map((p, idx) => {
        const rowErr = errors?.officePersonnel?.[idx] || {};
        return (
          <Paper key={idx} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Name"
                  placeholder="e.g., Regional Manager"
                  fullWidth
                  value={p.name}
                  onChange={(e) => updatePerson(idx, { name: e.target.value })}
                  error={!!rowErr.name}
                  helperText={rowErr.name}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Team / Department"
                  placeholder="e.g., Scheduling Contact"
                  fullWidth
                  value={p.title}
                  onChange={(e) => updatePerson(idx, { title: e.target.value })}
                  error={!!rowErr.title}
                  helperText={rowErr.title}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Email"
                  fullWidth
                  value={p.email}
                  onChange={(e) => updatePerson(idx, { email: e.target.value })}
                  inputProps={{ inputMode: 'email' }}
                  error={!!rowErr.email}
                  helperText={rowErr.email}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Office Phone"
                  fullWidth
                  value={p.officePhone}
                  onChange={(e) => updatePerson(idx, { officePhone: e.target.value })}
                  inputProps={{ inputMode: 'tel' }}
                  error={!!rowErr.officePhone}
                  helperText={rowErr.officePhone}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <TextField
                  label="Ext"
                  fullWidth
                  value={p.officeExt}
                  onChange={(e) => updatePerson(idx, { officeExt: e.target.value })}
                  error={!!rowErr.officeExt}
                  helperText={rowErr.officeExt}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Cell"
                  fullWidth
                  value={p.cellPhone}
                  onChange={(e) => updatePerson(idx, { cellPhone: e.target.value })}
                  inputProps={{ inputMode: 'tel' }}
                  error={!!rowErr.cellPhone}
                  helperText={rowErr.cellPhone}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Other"
                  fullWidth
                  value={p.otherPhone}
                  onChange={(e) => updatePerson(idx, { otherPhone: e.target.value })}
                  inputProps={{ inputMode: 'tel' }}
                  error={!!rowErr.otherPhone}
                  helperText={rowErr.otherPhone}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 1.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button color="error" size="small" onClick={() => removePerson(idx)}>
                Remove
              </Button>
            </Box>
          </Paper>
        );
      })}

      <Button variant="outlined" onClick={addPerson}>Add Contact</Button>
    </Box>
  );
};

export default OfficePersonnelSection;