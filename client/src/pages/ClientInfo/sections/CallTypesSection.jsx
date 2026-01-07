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
  Select,
  MenuItem,
} from '@mui/material';
import FieldRow from '../components/FieldRow';
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
  clarificationPrompt: '',
  reachPrimary: '',
  reachSecondary: '',
  reachPrimaryMemberId: null,
  reachSecondaryMemberId: null,
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
          clarificationPrompt: current.clarificationPrompt ?? '',
            reachPrimary: current.reachPrimary ?? '',
            reachSecondary: current.reachSecondary ?? '',
            reachPrimaryMemberId: current.reachPrimaryMemberId ?? null,
            reachSecondaryMemberId: current.reachSecondaryMemberId ?? null,
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

const chipStyles = (theme, isActive, isEnabled) => ({
  cursor: 'pointer',
  borderColor: isActive ? 'primary.main' : isEnabled ? 'success.main' : 'divider',
  backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.1) : isEnabled ? alpha(theme.palette.success.main, 0.1) : 'transparent',
  color: isActive ? 'primary.main' : isEnabled ? 'success.main' : 'text.secondary',
  '&:hover': {
    backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.15) : isEnabled ? alpha(theme.palette.success.main, 0.15) : alpha(theme.palette.action.hover, 0.1),
  },
});

const CallTypesSection = ({ errors = {} }) => {
  const { formData, updateSection } = useWizard();
  const theme = useTheme();
  const rawCallTypes = formData.answerCalls?.callTypes;
  const [activeKey, setActiveKey] = useState(null);

  // roster from onCall section (used for member selects)
  const team = Array.isArray(formData.onCall?.team) ? formData.onCall.team : [];

  const callTypes = useMemo(() => normalizeCallTypes(rawCallTypes), [rawCallTypes]);

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
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {CALL_TYPE_OPTIONS.map(({ key, label }) => (
            <Chip
              key={key}
              label={label}
              onClick={() => setActiveKey(activeKey === key ? null : key)}
              sx={chipStyles(theme, activeKey === key, callTypes[key]?.enabled)}
            />
          ))}
        </Stack>
        {activeKey && (
          <Box sx={{ mt: 2 }}>
            <FieldRow helperText={errors[activeKey]?.customLabel || 'Optional custom name for this call type.'}>
              <TextField
                label="Call type label"
                placeholder={CALL_TYPE_OPTIONS.find(o => o.key === activeKey)?.label}
                value={callTypes[activeKey]?.customLabel || ''}
                onChange={(e) => updateType(activeKey, { customLabel: e.target.value })}
                error={Boolean(errors[activeKey]?.customLabel)}
                size="small"
                fullWidth
              />
            </FieldRow>
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
            {callTypes[activeKey]?.enabled && (
              <Stack spacing={2} sx={{ mt: 2 }}>
                <FieldRow helperText={errors[activeKey]?.instructions}>
                  <TextField
                    label="Quick instruction"
                    placeholder="e.g., 'Transfer to extension 5 or take message'"
                    value={callTypes[activeKey]?.instructions || ''}
                    onChange={(e) => updateType(activeKey, { instructions: e.target.value })}
                    error={Boolean(errors[activeKey]?.instructions)}
                    fullWidth
                    size="small"
                    multiline
                    minRows={2}
                  />
                </FieldRow>
                <FieldRow helperText={errors[activeKey]?.clarificationPrompt || 'Add the clarifying question or keywords you rely on.'}>
                  <TextField
                    label="How do you recognize this call type?"
                    placeholder="What do you ask the caller so you know it fits this category?"
                    value={callTypes[activeKey]?.clarificationPrompt || ''}
                    onChange={(e) => updateType(activeKey, { clarificationPrompt: e.target.value })}
                    error={Boolean(errors[activeKey]?.clarificationPrompt)}
                    fullWidth
                    size="small"
                    multiline
                    minRows={2}
                  />
                </FieldRow>
                <FieldRow helperText={errors[activeKey]?.notes || 'We will use these instructions when this call type arrives.'}>
                  <TextField
                    label="Detailed script/notes"
                    placeholder="Exact words to say or detailed handling instructions..."
                    value={callTypes[activeKey]?.notes || ''}
                    onChange={(e) => updateType(activeKey, { notes: e.target.value })}
                    error={Boolean(errors[activeKey]?.notes)}
                    fullWidth
                    size="small"
                    multiline
                    minRows={3}
                  />
                </FieldRow>
              </Stack>
            )}
          </Box>
        )}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Everything Else
          </Typography>
          <FieldRow helperText={errors.otherText || 'We will review these notes to ensure nothing is missed.'}>
            <TextField
              placeholder="List other call types, special routing instructions, seasonal changes, or anything else we should know..."
              value={callTypes.otherText || ''}
              onChange={(e) => setCallTypes({ ...callTypes, otherText: e.target.value })}
              error={Boolean(errors.otherText)}
              fullWidth
              size="small"
              multiline
              minRows={3}
            />
          </FieldRow>
        </Box>
      </Stack>
    </Paper>
  );
}
export default CallTypesSection;
