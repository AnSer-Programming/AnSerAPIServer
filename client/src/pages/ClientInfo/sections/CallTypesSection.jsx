// src/pages/ClientInfo/sections/CallTypesSection.jsx

import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormHelperText,
  Divider,
  Paper,
} from '@mui/material';
import { useWizard } from '../context_API/WizardContext';

const CALL_TYPE_OPTIONS = [
  {
    key: 'newLead',
    label: 'New customer or sales inquiry',
    helper: 'Gather caller details and note ideal follow-up path so we can qualify the lead.',
  },
  {
    key: 'existingClient',
    label: 'Existing client needs assistance',
    helper: 'Outline who should be notified and what information we must collect.',
  },
  {
    key: 'urgentIssue',
    label: 'Urgent or emergency issue',
    helper: 'Define the escalation steps so we can reach your team immediately.',
  },
  {
    key: 'serviceRequest',
    label: 'Service or maintenance request',
    helper: 'Let us know the workflow for routine requests and updates.',
  },
  {
    key: 'billingQuestion',
    label: 'Billing or account question',
    helper: 'Share how to handle payment questions or balance disputes.',
  },
];

const DEFAULT_CALL_TYPE_STATE = {
  enabled: false,
  instructions: '',
  differsAfterHours: null,
  afterHoursInstructions: '',
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
          instructions: current.instructions ?? '',
          differsAfterHours:
            current.differsAfterHours === true
              ? true
              : current.differsAfterHours === false
                ? false
                : null,
          afterHoursInstructions: current.afterHoursInstructions ?? '',
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
        .join(' — '))
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

const CallTypesSection = ({ errors = {} }) => {
  const { formData, updateSection } = useWizard();
  const rawCallTypes = formData.answerCalls?.callTypes;

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

  const handleToggle = (key) => (event) => {
    const enabled = event.target.checked;
    updateType(key, enabled ? { enabled } : { ...DEFAULT_CALL_TYPE_STATE });
  };

  const handleDiffersChange = (key) => (event) => {
    const value = event.target.value;
    if (value === 'yes') {
      updateType(key, { differsAfterHours: true });
    } else if (value === 'no') {
      updateType(key, { differsAfterHours: false, afterHoursInstructions: '' });
    } else {
      updateType(key, { differsAfterHours: null, afterHoursInstructions: '' });
    }
  };

  const handleOtherChange = (event) => {
    setCallTypes({
      ...callTypes,
      otherText: event.target.value,
    });
  };

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Typography variant="body2" color="text.secondary">
        Pick the call types your team wants us to recognize. Enable each scenario, tell us what to do, and let us know if the process changes after hours. Use “Other call types” for anything unique.
      </Typography>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {CALL_TYPE_OPTIONS.map(({ key, label, helper }) => {
          const state = callTypes[key];
          const fieldErrors = errors[key] || {};
          return (
            <Paper
              key={key}
              variant="outlined"
              sx={{ p: 2.5, borderRadius: 2, borderColor: state.enabled ? 'primary.main' : 'divider' }}
            >
              <FormControlLabel
                control={<Checkbox checked={!!state.enabled} onChange={handleToggle(key)} />}
                label={
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {helper}
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: 'flex-start', mb: state.enabled ? 2 : 0 }}
              />

              {state.enabled && (
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <TextField
                    label="What should we do?"
                    value={state.instructions}
                    onChange={(e) => updateType(key, { instructions: e.target.value })}
                    error={Boolean(fieldErrors.instructions)}
                    helperText={fieldErrors.instructions || 'Include callers to notify, forms to capture, or systems to update.'}
                    multiline
                    minRows={2}
                    fullWidth
                  />

                  <FormControl component="fieldset" error={Boolean(fieldErrors.differsAfterHours)}>
                    <FormLabel component="legend">Does this differ during office hours?</FormLabel>
                    <RadioGroup
                      row
                      value={state.differsAfterHours === true ? 'yes' : state.differsAfterHours === false ? 'no' : ''}
                      onChange={handleDiffersChange(key)}
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                    {fieldErrors.differsAfterHours && (
                      <FormHelperText>{fieldErrors.differsAfterHours}</FormHelperText>
                    )}
                  </FormControl>

                  {state.differsAfterHours === true && (
                    <TextField
                      label="After-hours instructions"
                      value={state.afterHoursInstructions}
                      onChange={(e) => updateType(key, { afterHoursInstructions: e.target.value })}
                      error={Boolean(fieldErrors.afterHoursInstructions)}
                      helperText={fieldErrors.afterHoursInstructions || 'Tell us exactly what changes when the office is closed.'}
                      multiline
                      minRows={2}
                      fullWidth
                    />
                  )}
                </Box>
              )}
            </Paper>
          );
        })}
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Other call types or special instructions
        </Typography>
        <TextField
          placeholder="List additional scenarios, seasonal changes, or anything else we should be ready for."
          value={callTypes.otherText}
          onChange={handleOtherChange}
          error={Boolean(errors.otherText)}
          helperText={errors.otherText || 'We’ll review these notes with you to make sure nothing is missed.'}
          multiline
          minRows={3}
          fullWidth
        />
      </Box>
    </Box>
  );
};

export default CallTypesSection;
