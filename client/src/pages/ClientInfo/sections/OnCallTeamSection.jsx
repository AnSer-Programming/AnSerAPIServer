import React from 'react';
import { Typography, Grid, TextField, Button, Paper, Divider, Stack } from '@mui/material';

const normalize = (r = {}) => ({
  name: r.name || '',
  title: r.title || '',
  email: r.email || '',
  cell: r.cell || '',
  home: r.home || '',
  other: r.other || '',
});

const OnCallTeamSection = ({ rows = [], onChange, errors = [] }) => {
  const team = rows.map(normalize);
  const setRows = (next) => onChange?.(next);

  const addRow  = () => setRows([...team, normalize()]);
  const rmRow   = (i) => setRows(team.filter((_, idx) => idx !== i));
  const dupRow  = (i) => setRows([...team.slice(0, i + 1), { ...team[i] }, ...team.slice(i + 1)]);
  const setRow  = (i, patch) => setRows(team.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1, color: '#b00', fontWeight: 700 }}>
        On Call Team
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        (Please send an attachment of your complete on-call team with a schedule, if available.)
      </Typography>

      {team.map((row, i) => {
        const e = errors?.[i] || {};
        const contactMissing = ![row.email, row.cell, row.home, row.other].some(Boolean);

        return (
          <Paper key={i} variant="outlined" sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Name"
                  fullWidth
                  value={row.name}
                  onChange={(ev) => setRow(i, { name: ev.target.value })}
                  error={!!e.name}
                  helperText={e.name}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Title"
                  fullWidth
                  value={row.title}
                  onChange={(ev) => setRow(i, { title: ev.target.value })}
                  error={!!e.title}
                  helperText={e.title}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={row.email}
                  onChange={(ev) => setRow(i, { email: ev.target.value })}
                  error={!!e.email}
                  helperText={e.email}
                  inputProps={{ inputMode: 'email' }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Cell"
                  type="tel"
                  fullWidth
                  value={row.cell}
                  onChange={(ev) => setRow(i, { cell: ev.target.value })}
                  error={!!e.cell}
                  helperText={e.cell}
                  inputProps={{ inputMode: 'tel' }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Home"
                  type="tel"
                  fullWidth
                  value={row.home}
                  onChange={(ev) => setRow(i, { home: ev.target.value })}
                  error={!!e.home}
                  helperText={e.home}
                  inputProps={{ inputMode: 'tel' }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Other"
                  type="tel"
                  fullWidth
                  value={row.other}
                  onChange={(ev) => setRow(i, { other: ev.target.value })}
                  error={!!e.other}
                  helperText={e.other}
                  inputProps={{ inputMode: 'tel' }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" color={contactMissing ? 'error' : 'text.secondary'}>
                  Provide at least one contact method (cell, home, other, or email).
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 1.5 }} />

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button size="small" onClick={() => dupRow(i)}>Duplicate</Button>
              <Button color="error" size="small" onClick={() => rmRow(i)}>Remove</Button>
            </Stack>
          </Paper>
        );
      })}

      <Button variant="outlined" onClick={addRow}>Add Team Member</Button>
    </Paper>
  );
};

export default OnCallTeamSection;
