import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Chip,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useWizard } from '../context_API/WizardContext';
import FieldRow from '../components/FieldRow';

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const OnCallDepartmentsSection = ({ errors = [], onCall = {}, setOnCall = () => {} }) => {
  const { formData, updateSection } = useWizard();
  const rows = Array.isArray(formData.onCall?.departments) ? formData.onCall.departments : [];
  const team = Array.isArray(formData.onCall?.team) ? formData.onCall.team : [];

  // Convert legacy row shape to new shape safely when rendering
  const normalizedRows = useMemo(() => (
    rows.map((r) => {
      const legacyId = r.id ?? (r.department || r.name || '');
      return {
        ...r,
        id: legacyId || generateId(),
        department: r.department || r.name || '',
        members: Array.isArray(r.members) ? r.members : [],
        contact: r.contact ?? '',
        contactMemberId: r.contactMemberId || null,
      };
    })
  ), [rows]);
  const rowIds = useMemo(() => normalizedRows.map((row) => row.id), [normalizedRows]);

  const persist = (next) => {
    updateSection('onCall', { ...formData.onCall, departments: next });
  };

  const setRow = (index, payload) => {
    const next = normalizedRows.map((r, i) => (i === index ? { ...r, ...payload } : r));
    persist(next);
  };

  const addRow = () => {
    const nextRow = { id: generateId(), department: '', members: [], contact: '', contactMemberId: null };
    const next = [...normalizedRows, nextRow];
    persist(next);
    setExpandedTeams(new Set([nextRow.id]));
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

  const [expandedTeams, setExpandedTeams] = useState(() => new Set());

  useEffect(() => {
    setExpandedTeams((prev) => {
      const prevSet = prev || new Set();
      const next = new Set(rowIds.filter((id) => prevSet.has(id)));
      if (prevSet.size === next.size) {
        let same = true;
        prevSet.forEach((id) => {
          if (!next.has(id)) same = false;
        });
        if (same) return prevSet;
      }
      return next;
    });
  }, [rowIds]);

  useEffect(() => {
    if (rows.some((row) => !row.id)) {
      persist(normalizedRows);
    }
  }, [rows]);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Team Setup</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Define teams (departments/roles) and check which team members belong to each team.
      </Typography>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {normalizedRows.map((row, idx) => (
          <Accordion
            key={row.id}
            variant="outlined"
            expanded={expandedTeams.has(row.id)}
            TransitionProps={{ unmountOnExit: true }}
            onChange={() => {
              setExpandedTeams((prev) => {
                const next = new Set(prev);
                if (next.has(row.id)) next.delete(row.id);
                else next.add(row.id);
                return next;
              });
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {row.department?.trim() || `Team ${idx + 1}`}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {row.members?.length || 0} member{row.members?.length === 1 ? '' : 's'}
                  </Typography>
                </Box>
                {!!errors[idx]?.department && (
                  <Chip label="Name required" color="error" size="small" />
                )}
                <IconButton
                  color="error"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeRow(idx);
                  }}
                  sx={{ ml: 1 }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
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

                <Grid item xs={12} md={8}>
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
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={addRow}>Add Team</Button>
      </Box>
    </Box>
  );
};

export default OnCallDepartmentsSection;
