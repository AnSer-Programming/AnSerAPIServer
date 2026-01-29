import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Stack,
  Paper,
  Divider,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useWizard } from '../context_API/WizardContext';
import FieldRow from '../components/FieldRow';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward,
  ArrowDownward,
  ContentCopy as DuplicateIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';

const createStep = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  role: '',
  contact: '',
  window: '',
  notes: '',
});

const normalizeStep = (step = {}) => {
  const base = createStep();
  return {
    ...base,
    ...step,
    id: step.id || base.id,
    name: step.name ?? '',
    role: step.role ?? '',
    contact: step.contact ?? '',
    window: step.window ?? '',
    notes: step.notes ?? '',
  };
};

const EscalationMatrixSection = ({ steps = [], onChange = () => {}, errors = [] }) => {
  const theme = useTheme();
  const { darkMode } = useClientInfoTheme();
  const { formData } = useWizard();
  const team = Array.isArray(formData.onCall?.team) ? formData.onCall.team : [];
  const departments = Array.isArray(formData.onCall?.departments) ? formData.onCall.departments : [];
  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [selectedStepsToApply, setSelectedStepsToApply] = useState(new Set());

  const normalizedSteps = useMemo(() => {
    if (Array.isArray(steps) && steps.length) {
      return steps.map(normalizeStep);
    }
    return [createStep()];
  }, [steps]);

  const baseError = (!Array.isArray(errors) && typeof errors === 'object') ? errors.base : null;
  const stepErrors = Array.isArray(errors) ? errors : [];

  const handleChange = (index, field, value) => {
    const next = normalizedSteps.map((step, idx) => (
      idx === index ? { ...step, [field]: value } : step
    ));
    onChange(next);
  };

  const handleAdd = () => {
    onChange([...normalizedSteps, createStep()]);
  };

  const handleDuplicate = (index) => {
    const duplicate = normalizeStep({ ...normalizedSteps[index], id: undefined });
    const next = [...normalizedSteps];
    next.splice(index + 1, 0, duplicate);
    onChange(next);
  };

  const handleRemove = (index) => {
    const next = normalizedSteps.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const handleMove = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= normalizedSteps.length) return;
    const next = [...normalizedSteps];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  };

  const handleOpenApplyDialog = () => {
    setSelectedStepsToApply(new Set(normalizedSteps.map((_, idx) => idx)));
    setOpenApplyDialog(true);
  };

  const handleApplyToAll = () => {
    // Apply all steps to selected indices
    // For now, just copy steps 0 to all selected
    if (selectedStepsToApply.size === 0) {
      setOpenApplyDialog(false);
      return;
    }

    const templateSteps = normalizedSteps.slice(0, 1); // Use first step as template
    // This would be connected to team members in the parent component
    // For now, just close the dialog
    setOpenApplyDialog(false);
  };

  const handleToggleStepSelection = (index) => {
    const next = new Set(selectedStepsToApply);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setSelectedStepsToApply(next);
  };

  const cardBg = alpha(theme.palette.info.main, darkMode ? 0.08 : 0.04);
  const cardBorder = alpha(theme.palette.info.main, 0.25);

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${cardBorder}`, backgroundColor: cardBg }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Escalation Plan</Typography>
          <Typography variant="body2" color="text.secondary">
            Prioritize who we contact first, capture their role, and note the window when they should be reached.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
          }}
        >
          Add Escalation Contact
        </Button>
      </Stack>

      {baseError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {baseError}
        </Alert>
      )}

      <Stack spacing={2}>
        {normalizedSteps.map((step, index) => {
          const rowErrors = stepErrors[index] || {};
          const hasErrors = Object.keys(rowErrors).length > 0;

          return (
            <Paper
              key={step.id || index}
              sx={{
                borderRadius: 2,
                border: `1px solid ${hasErrors ? theme.palette.error.light : cardBorder}`,
                backgroundColor: hasErrors
                  ? alpha(theme.palette.error.main, darkMode ? 0.12 : 0.06)
                  : (darkMode ? alpha('#fff', 0.04) : theme.palette.common.white),
                p: 2.5,
              }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Escalation Step {index + 1}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Tooltip title="Move up">
                    <span>
                      <IconButton size="small" onClick={() => handleMove(index, -1)} disabled={index === 0}>
                        <ArrowUpward fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Move down">
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => handleMove(index, 1)}
                        disabled={index === normalizedSteps.length - 1}
                      >
                        <ArrowDownward fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Duplicate">
                    <IconButton size="small" onClick={() => handleDuplicate(index)}>
                      <DuplicateIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove">
                    <IconButton size="small" color="error" onClick={() => handleRemove(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <FieldRow helperText={rowErrors.name || ''}>
                  <TextField
                    label="Contact Name"
                    value={step.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                    error={Boolean(rowErrors.name)}
                  />
                </FieldRow>
                <FieldRow helperText={rowErrors.role || ''}>
                  <TextField
                    label="Role / Responsibility"
                    value={step.role}
                    onChange={(e) => handleChange(index, 'role', e.target.value)}
                  />
                </FieldRow>
                {/* Department select */}
                <Select
                  value={step.departmentId || ''}
                  onChange={(e) => handleChange(index, 'departmentId', e.target.value || null)}
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="">No department</MenuItem>
                  {departments.map((d) => (
                    <MenuItem key={d.id || d.department} value={d.id || d.department}>{d.department || d.name}</MenuItem>
                  ))}
                </Select>
                {/* Choose roster member (filtered by department) or enter custom contact */}
                <Box>
                  <Select
                    value={step.contactMemberId || ''}
                    onChange={(e) => {
                      const memberId = e.target.value || null;
                      if (memberId) {
                        const member = team.find((m) => m.id === memberId);
                        const primary = (member?.cellPhone && member.cellPhone[0]) || (member?.email && member.email[0]) || '';
                        handleChange(index, 'contactMemberId', memberId);
                        handleChange(index, 'contact', member?.name || primary || '');
                      } else {
                        handleChange(index, 'contactMemberId', null);
                      }
                    }}
                    displayEmpty
                    fullWidth
                  >
                    <MenuItem value="">Custom contact (enter below)</MenuItem>
                    {(step.departmentId
                      ? (departments.find((d) => (d.id || d.department) === step.departmentId)?.members || [])
                      : team.map((m) => m.id)
                    ).map((memberId) => {
                      const member = team.find((m) => m.id === memberId) || {};
                      return (
                        <MenuItem key={memberId} value={memberId}>
                          {member.name || member.id} {member.cellPhone?.[0] ? `\u2014 ${member.cellPhone[0]}` : member.email?.[0] ? `\u2014 ${member.email[0]}` : ''}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  {!step.contactMemberId && (
                    <FieldRow helperText={rowErrors.contact || ''}>
                      <TextField
                        label="Best Contact Details"
                        value={step.contact}
                        onChange={(e) => handleChange(index, 'contact', e.target.value)}
                        error={Boolean(rowErrors.contact)}
                        sx={{ mt: 1 }}
                      />
                    </FieldRow>
                  )}
                </Box>
                <FieldRow helperText={rowErrors.window || ''}>
                  <TextField
                    label="Availability Window / Timing"
                    value={step.window}
                    onChange={(e) => handleChange(index, 'window', e.target.value)}
                  />
                </FieldRow>
              </Box>

              <FieldRow helperText={rowErrors.notes || ''}>
                <TextField
                  label="Additional Notes"
                  value={step.notes}
                  onChange={(e) => handleChange(index, 'notes', e.target.value)}
                  multiline
                  minRows={2}
                  sx={{ mt: 2 }}
                />
              </FieldRow>
            </Paper>
          );
        })}
      </Stack>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        sx={{ mt: 3, textTransform: 'none', borderRadius: 2, mr: 2 }}
      >
        Add Another Contact
      </Button>

      <Button
        variant="outlined"
        color="success"
        onClick={handleOpenApplyDialog}
        sx={{ mt: 3, textTransform: 'none', borderRadius: 2 }}
      >
        Apply these steps to multiple team members
      </Button>

      <Dialog open={openApplyDialog} onClose={() => setOpenApplyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Apply default steps</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Apply these steps as the default for all selected team members? This will overwrite their existing steps.
          </Typography>
          <Box sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid', borderColor: 'divider', p: 1, borderRadius: 1 }}>
            {normalizedSteps.map((step, index) => (
              <FormControlLabel
                key={step.id}
                control={
                  <Checkbox
                    checked={selectedStepsToApply.has(index)}
                    onChange={() => handleToggleStepSelection(index)}
                  />
                }
                label={`${index + 1}. ${step.name || step.role || 'Step ' + (index + 1)}`}
                sx={{ display: 'block', mb: 1 }}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenApplyDialog(false)}>Cancel</Button>
          <Button onClick={handleApplyToAll} variant="contained" color="success">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

EscalationMatrixSection.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      role: PropTypes.string,
      contact: PropTypes.string,
      window: PropTypes.string,
      notes: PropTypes.string,
    })
  ),
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.any),
};

export default EscalationMatrixSection;
