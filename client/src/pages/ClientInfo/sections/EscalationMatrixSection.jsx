import React, { useMemo } from 'react';
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
} from '@mui/material';
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
                <TextField
                  label="Contact Name"
                  value={step.name}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  error={Boolean(rowErrors.name)}
                  helperText={rowErrors.name || ''}
                />
                <TextField
                  label="Role / Responsibility"
                  value={step.role}
                  onChange={(e) => handleChange(index, 'role', e.target.value)}
                  helperText={rowErrors.role || ''}
                />
                <TextField
                  label="Best Contact Details"
                  value={step.contact}
                  onChange={(e) => handleChange(index, 'contact', e.target.value)}
                  error={Boolean(rowErrors.contact)}
                  helperText={rowErrors.contact || ''}
                />
                <TextField
                  label="Availability Window / Timing"
                  value={step.window}
                  onChange={(e) => handleChange(index, 'window', e.target.value)}
                  helperText={rowErrors.window || ''}
                />
              </Box>

              <TextField
                label="Additional Notes"
                value={step.notes}
                onChange={(e) => handleChange(index, 'notes', e.target.value)}
                multiline
                minRows={2}
                sx={{ mt: 2 }}
                helperText={rowErrors.notes || ''}
              />
            </Paper>
          );
        })}
      </Stack>

      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        sx={{ mt: 3, textTransform: 'none', borderRadius: 2 }}
      >
        Add Another Contact
      </Button>
    </Paper>
  );
};

export default EscalationMatrixSection;
