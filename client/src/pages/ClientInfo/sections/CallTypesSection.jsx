// src/pages/ClientInfo/sections/CallTypesSection.jsx

import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Chip,
  TextField,
  Typography,
  Switch,
  Button,
  Stack,
  Divider,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { useWizard } from '../context_API/WizardContext';

const CALL_TYPE_OPTIONS = [
  { key: 'newLead', label: 'New customer or sales inquiry' },
  { key: 'existingClient', label: 'Existing client needs assistance' },
  { key: 'urgentIssue', label: 'Urgent or emergency issue' },
  { key: 'serviceRequest', label: 'Service or maintenance request' },
  { key: 'billingQuestion', label: 'Billing or account question' },
];

const DEFAULT_CALL_TYPE_STATE = {
  enabled: false,
  customLabel: '',
  instructions: '',
  reachPrimary: '',
  reachSecondary: '',
  notes: '',
  autoEmailOffice: false,
};

const normalizeCallTypes = (value) => {
  const normalized = {};
  CALL_TYPE_OPTIONS.forEach(({ key }) => {
    normalized[key] = { ...DEFAULT_CALL_TYPE_STATE };
  });

  let otherText = '';

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    CALL_TYPE_OPTIONS.forEach(({ key }) => {
      const current = value[key];
      if (current && typeof current === 'object') {
        normalized[key] = {
          enabled: Boolean(current.enabled),
          customLabel: current.customLabel ?? '',
          instructions: current.instructions ?? '',
          reachPrimary: current.reachPrimary ?? '',
          reachSecondary: current.reachSecondary ?? '',
          notes: current.notes ?? '',
          autoEmailOffice: Boolean(current.autoEmailOffice),
        };
      }
    });
    if (typeof value.otherText === 'string') {
      otherText = value.otherText;
    }
  }

  if (Array.isArray(value) && value.length) {
    const legacyLines = value
      .map((item) => [item?.name, item?.instructions]
        .filter(Boolean)
        .join('  '))
      .filter(Boolean);
    if (!otherText && legacyLines.length) {
      otherText = legacyLines.join('\n');
    }
  }

  return {
    ...normalized,
    otherText,
  };
};

const deepEqual = (a, b) => {
  if (a === b) return true;
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
};

const getDisplayLabel = (key, callTypes) => {
  const callType = callTypes[key];
  if (callType?.customLabel) {
    return callType.customLabel;
  }
  return CALL_TYPE_OPTIONS.find(o => o.key === key)?.label || key;
};

const CallTypesSection = ({ errors = {} }) => {
  const { formData, updateSection } = useWizard();
  const theme = useTheme();
  const rawCallTypes = formData.answerCalls?.callTypes;
  const [activeKey, setActiveKey] = useState(null);

  const callTypes = useMemo(() => normalizeCallTypes(rawCallTypes), [rawCallTypes]);

  useEffect(() => {
    if (!deepEqual(rawCallTypes, callTypes)) {
      updateSection('answerCalls', { callTypes });
    }
  }, [rawCallTypes, callTypes, updateSection]);

  const setCallTypes = (next) => {
    updateSection('answerCalls', { callTypes: next });
  };

  const updateType = (key, patch) => {
    const next = {
      ...callTypes,
      [key]: {
        ...callTypes[key],
        ...patch,
      },
    };
    setCallTypes(next);
  };

  const chipStyles = (selected, enabled) => ({
    bgcolor: selected
      ? theme.palette.primary.main
      : enabled
      ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.08)
      : 'transparent',
    color: selected
      ? theme.palette.primary.main
      : enabled
      ? theme.palette.text.primary
      : theme.palette.text.disabled,
    fontWeight: selected ? 600 : 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.35 : 0.16),
    },
  });

  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Call Types
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select the call types your team recognizes and describe how to handle each one.
          </Typography>
        </Box>

        {/* Call Type Selection Chips */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {CALL_TYPE_OPTIONS.map(({ key, label }) => (
            <Chip
              key={key}
              label={label}
              onClick={() => setActiveKey(activeKey === key ? null : key)}
              sx={chipStyles(activeKey === key, callTypes[key]?.enabled)}
            />
          ))}
        </Stack>

        {/* Detailed Form for Selected Call Type */}
        {activeKey && (
          <Box>
            <Divider sx={{ my: 2 }} />
            <Stack spacing={2.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {getDisplayLabel(activeKey, callTypes)}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Enable
                  </Typography>
                  <Switch
                    checked={!!callTypes[activeKey]?.enabled}
                    onChange={(e) => updateType(activeKey, { enabled: e.target.checked })}
                    size="small"
                  />
                </Stack>
              </Box>

              {callTypes[activeKey]?.enabled && (
                <Stack spacing={2}>
                  <TextField
                    label="Call type label"
                    placeholder={CALL_TYPE_OPTIONS.find(o => o.key === activeKey)?.label}
                    value={callTypes[activeKey]?.customLabel || ''}
                    onChange={(e) => updateType(activeKey, { customLabel: e.target.value })}
                    error={Boolean(errors[activeKey]?.customLabel)}
                    helperText={errors[activeKey]?.customLabel || 'Optional custom name for this call type.'}
                    fullWidth
                    size="small"
                  />

                  <TextField
                    label="Quick instruction"
                    placeholder="e.g., 'Transfer to extension 5 or take message'"
                    value={callTypes[activeKey]?.instructions || ''}
                    onChange={(e) => updateType(activeKey, { instructions: e.target.value })}
                    error={Boolean(errors[activeKey]?.instructions)}
                    helperText={errors[activeKey]?.instructions}
                    fullWidth
                    size="small"
                    multiline
                    minRows={2}
                  />

                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Primary contact"
                      placeholder="Name or department"
                      value={callTypes[activeKey]?.reachPrimary || ''}
                      onChange={(e) => updateType(activeKey, { reachPrimary: e.target.value })}
                      error={Boolean(errors[activeKey]?.reachPrimary)}
                      helperText={errors[activeKey]?.reachPrimary}
                      fullWidth
                      size="small"
                    />
                    <TextField
                      label="Secondary contact"
                      placeholder="Backup contact"
                      value={callTypes[activeKey]?.reachSecondary || ''}
                      onChange={(e) => updateType(activeKey, { reachSecondary: e.target.value })}
                      fullWidth
                      size="small"
                    />
                  </Stack>

                  <TextField
                    label="Detailed script/notes"
                    placeholder="Exact words to say or detailed handling instructions..."
                    value={callTypes[activeKey]?.notes || ''}
                    onChange={(e) => updateType(activeKey, { notes: e.target.value })}
                    error={Boolean(errors[activeKey]?.notes)}
                    helperText={errors[activeKey]?.notes || 'We will use these instructions when this call type arrives.'}
                    fullWidth
                    size="small"
                    multiline
                    minRows={3}
                  />

                  <Stack direction="row" spacing={1}>
                    <Button
                      variant={callTypes[activeKey]?.autoEmailOffice ? 'contained' : 'outlined'}
                      onClick={() => updateType(activeKey, { autoEmailOffice: !callTypes[activeKey]?.autoEmailOffice })}
                      size="small"
                      startIcon={callTypes[activeKey]?.autoEmailOffice ? '' : undefined}
                    >
                      Auto-email office when received
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Box>
        )}

        <Divider />

        {/* Everything Else */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Everything Else
          </Typography>
          <TextField
            placeholder="List other call types, special routing instructions, seasonal changes, or anything else we should know..."
            value={callTypes.otherText || ''}
            onChange={(e) => setCallTypes({ ...callTypes, otherText: e.target.value })}
            error={Boolean(errors.otherText)}
            helperText={errors.otherText || 'We will review these notes to ensure nothing is missed.'}
            fullWidth
            size="small"
            multiline
            minRows={3}
          />
        </Box>
      </Stack>
    </Paper>
  );
};

export default CallTypesSection;
