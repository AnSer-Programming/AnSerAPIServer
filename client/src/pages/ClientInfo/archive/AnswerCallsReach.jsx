// AnswerCallsReach.jsx - Alternative implementation showing structured reach/handling rules
// Based on the image workflow: Define call types → Configure reach/handling for each type

import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Paper,
  Container,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Divider,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  NavigateNext, 
  NavigateBefore,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';
import { createSharedStyles } from '../utils/sharedStyles';
import { WIZARD_ROUTES } from '../constants/routes';
import BUSINESS_REASONS from '../data/businessReasons';

const BUSINESS_TYPE_OPTIONS = [
  { value: '', label: '-- Select a business type --' },
  { value: 'HVAC (heating, ventilation, air conditioning)', label: 'HVAC (heating, ventilation, air conditioning)' },
  { value: 'Property Management / Rentals', label: 'Property Management / Rentals' },
  { value: 'Construction / Contracting', label: 'Construction / Contracting' },
  { value: 'Landscaping / Tree / Snow Removal', label: 'Landscaping / Tree / Snow Removal' },
  { value: 'Medical / Healthcare (hospitals, clinics)', label: 'Medical / Healthcare (hospitals, clinics)' },
  { value: 'Funeral Home / Mortuary Services', label: 'Funeral Home / Mortuary Services' },
  { value: 'Veterinary / Animal Services', label: 'Veterinary / Animal Services' },
  { value: 'Insurance / Claims / Risk', label: 'Insurance / Claims / Risk' },
  { value: 'Legal / Law Enforcement / Compliance', label: 'Legal / Law Enforcement / Compliance' },
  { value: 'Logistics / Transportation / Delivery / Towing', label: 'Logistics / Transportation / Delivery / Towing' },
  { value: 'IT / Telecom / Software / Network', label: 'IT / Telecom / Software / Network' },
  { value: 'Manufacturing / Industrial / Equipment', label: 'Manufacturing / Industrial / Equipment' },
  { value: 'Misc / Unlisted / Other.', label: 'Misc / Unlisted / Other.' },
];

// Prefilled reach suggestions (from image)
const REACH_SUGGESTIONS = [
  'Prefill all Team Members',
  'Team Name + "On-Call"',
  'Office - Auto-Email',
  'Hold For Morning Cue',
  'Direct to On-Call Person',
  'Send SMS to Primary Contact',
  'Emergency Escalation',
  'Manager Override',
];

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const AnswerCallsReach = () => {
  const theme = useTheme();
  const { darkMode } = useClientInfoTheme();
  const sharedStyles = createSharedStyles(theme, darkMode);
  const history = useHistory();
  const { getSection, updateSection, markStepVisited } = useWizard();

  // Two-phase workflow state
  const [currentPhase, setCurrentPhase] = useState('define'); // 'define' or 'configure'
  const [currentConfigureIndex, setCurrentConfigureIndex] = useState(0);

  // Persisted section shape
  const section = getSection('answerCallsReach') || {};
  const businessType = section.businessType || '';
  const callTypes = Array.isArray(section.callTypes) ? section.callTypes : [];

  // Local UI state
  const [editingBuffers, setEditingBuffers] = useState({});
  const commitTimeoutRef = useRef({});

  useEffect(() => {
    // Ensure at least one call type exists
    if (!callTypes || callTypes.length === 0) {
      const first = [{
        id: makeId(),
        name: '',
        handlingSteps: [{ id: makeId(), action: 'Reach', targets: [] }]
      }];
      updateSection('answerCallsReach', { ...section, callTypes: first });
    }
    
    // Set page title
    const prev = document.title;
    document.title = 'Call Handling & Reach Rules — AnSer Communications';
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; created = true; }
    meta.content = 'Configure how calls should be handled and who to reach for each call type.';
    if (created) document.head.appendChild(meta);
    markStepVisited && markStepVisited('answer-calls');
    return () => { document.title = prev; if (created && meta && meta.parentNode) meta.parentNode.removeChild(meta); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(commitTimeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  const setSection = (patch) => updateSection('answerCallsReach', { ...section, ...patch });

  const handleBusinessTypeChange = (e) => setSection({ businessType: e.target.value });

  // Phase 1: Define call types
  const addCallType = () => {
    const newId = makeId();
    const next = [...callTypes];
    next.push({
      id: newId,
      name: '',
      handlingSteps: [{ id: makeId(), action: 'Reach', targets: [] }]
    });
    setSection({ callTypes: next });
  };

  const removeCallType = (id) => {
    if (callTypes.length <= 1) return;
    const next = callTypes.filter((ct) => ct.id !== id);
    setSection({ callTypes: next });
  };

  const updateCallTypeName = (id, name) => {
    const next = callTypes.map((ct) => (ct.id === id ? { ...ct, name } : ct));
    setSection({ callTypes: next });
  };

  // Phase 2: Configure handling for each type
  const addHandlingStep = (callTypeId) => {
    const next = callTypes.map((ct) => {
      if (ct.id === callTypeId) {
        const steps = [...(ct.handlingSteps || [])];
        steps.push({ id: makeId(), action: 'Reach', targets: [] });
        return { ...ct, handlingSteps: steps };
      }
      return ct;
    });
    setSection({ callTypes: next });
  };

  const removeHandlingStep = (callTypeId, stepId) => {
    const next = callTypes.map((ct) => {
      if (ct.id === callTypeId) {
        const steps = ct.handlingSteps.filter((s) => s.id !== stepId);
        // Keep at least one step
        if (steps.length === 0) {
          steps.push({ id: makeId(), action: 'Reach', targets: [] });
        }
        return { ...ct, handlingSteps: steps };
      }
      return ct;
    });
    setSection({ callTypes: next });
  };

  const updateHandlingStep = (callTypeId, stepId, patch) => {
    const next = callTypes.map((ct) => {
      if (ct.id === callTypeId) {
        const steps = ct.handlingSteps.map((s) =>
          s.id === stepId ? { ...s, ...patch } : s
        );
        return { ...ct, handlingSteps: steps };
      }
      return ct;
    });
    setSection({ callTypes: next });
  };

  // Navigation between phases
  const canProceedToPhase2 = () => {
    return businessType && callTypes.length > 0 && callTypes.every(ct => ct.name?.trim());
  };

  const startConfiguring = () => {
    if (canProceedToPhase2()) {
      setCurrentPhase('configure');
      setCurrentConfigureIndex(0);
    }
  };

  const backToDefine = () => {
    setCurrentPhase('define');
  };

  const nextCallType = () => {
    if (currentConfigureIndex < callTypes.length - 1) {
      setCurrentConfigureIndex(currentConfigureIndex + 1);
    }
  };

  const prevCallType = () => {
    if (currentConfigureIndex > 0) {
      setCurrentConfigureIndex(currentConfigureIndex - 1);
    }
  };

  const isLastCallType = currentConfigureIndex === callTypes.length - 1;

  // Get suggestions based on business type
  const examples = (BUSINESS_REASONS[businessType]?.client_facing) || [];

  return (
    <Box sx={sharedStyles.layout.pageWrapper}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 2, md: 3 },
            mb: 2,
            background: darkMode
              ? `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}06 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.main}06 0%, ${theme.palette.secondary.main}02 100%)`,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: theme.palette.primary.main }}>
            Call Handling & Reach Rules
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Define your call types, then configure how each should be handled.
          </Typography>
        </Paper>

        {/* Phase Indicator */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Stepper activeStep={currentPhase === 'define' ? 0 : 1} sx={{ mb: 2 }}>
            <Step>
              <StepLabel>Define Call Types</StepLabel>
            </Step>
            <Step>
              <StepLabel>Configure Handling</StepLabel>
            </Step>
          </Stepper>
        </Paper>

        {/* PHASE 1: Define Call Types */}
        {currentPhase === 'define' && (
          <>
            {/* Business Type */}
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 0.5 }}>Business Type</Typography>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1 }}>
                What type of business is this?
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="business-type-label">Select business type</InputLabel>
                <Select
                  labelId="business-type-label"
                  value={businessType}
                  label="Select business type"
                  onChange={handleBusinessTypeChange}
                  size="small"
                >
                  {BUSINESS_TYPE_OPTIONS.map((o) => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>

            {/* Call Types Definition */}
            <Paper sx={sharedStyles.card('primary', 'outlined')}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 0.5 }}>
                    Prefill all the created types of calls
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>
                    Add all the call types you expect to receive. You'll configure handling next.
                  </Typography>
                </Box>
                <ArrowForwardIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
              </Box>

              {!businessType && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Select a business type above to see suggested call types
                </Alert>
              )}

              <Box sx={{ mt: 2 }}>
                {callTypes.map((ct, index) => (
                  <Paper key={ct.id} variant="outlined" sx={{ p: 2, mb: 2, bgcolor: theme.palette.background.default }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip 
                        label={index + 1} 
                        size="small" 
                        color="primary" 
                        sx={{ fontWeight: 700 }}
                      />
                      <Autocomplete
                        freeSolo
                        fullWidth
                        options={examples}
                        value={ct.name || ''}
                        onChange={(e, newValue) => updateCallTypeName(ct.id, newValue || '')}
                        inputValue={ct.name || ''}
                        onInputChange={(e, newInput) => updateCallTypeName(ct.id, newInput)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder="e.g. No Heat / Emergency"
                            label="Call Type Name"
                          />
                        )}
                      />
                      <IconButton 
                        color="error" 
                        onClick={() => removeCallType(ct.id)}
                        disabled={callTypes.length <= 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Box>

              <Button 
                variant="outlined" 
                onClick={addCallType} 
                startIcon={<AddIcon />}
                fullWidth
                sx={{ mt: 1 }}
              >
                Add Another Call Type
              </Button>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={startConfiguring}
                  disabled={!canProceedToPhase2()}
                  endIcon={<NavigateNext />}
                  size="large"
                >
                  Configure Handling for Each Type
                </Button>
              </Box>

              {!canProceedToPhase2() && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Please select a business type and name all call types before proceeding
                </Alert>
              )}
            </Paper>
          </>
        )}

        {/* PHASE 2: Configure Handling */}
        {currentPhase === 'configure' && callTypes[currentConfigureIndex] && (
          <>
            <Alert severity="info" sx={{ mb: 2 }}>
              <strong>Must go through all types</strong> — Configure handling for each call type ({currentConfigureIndex + 1} of {callTypes.length})
            </Alert>

            <Paper sx={sharedStyles.card('primary', 'outlined')}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {callTypes[currentConfigureIndex].name || 'Unnamed Call Type'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  How do you want these calls handled?
                </Typography>
              </Box>

              {/* Handling Steps */}
              {callTypes[currentConfigureIndex].handlingSteps?.map((step, stepIndex) => (
                <Paper key={step.id} variant="outlined" sx={{ p: 2, mb: 2, bgcolor: theme.palette.background.default }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    <Chip 
                      label={stepIndex + 1} 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel>Action</InputLabel>
                        <Select
                          value={step.action || 'Reach'}
                          label="Action"
                          onChange={(e) => updateHandlingStep(
                            callTypes[currentConfigureIndex].id,
                            step.id,
                            { action: e.target.value }
                          )}
                        >
                          <MenuItem value="Reach">Reach</MenuItem>
                          <MenuItem value="Hold">Hold</MenuItem>
                          <MenuItem value="Email">Email</MenuItem>
                          <MenuItem value="Escalate">Escalate</MenuItem>
                        </Select>
                      </FormControl>

                      <Autocomplete
                        multiple
                        freeSolo
                        options={REACH_SUGGESTIONS}
                        value={step.targets || []}
                        onChange={(e, newValue) => updateHandlingStep(
                          callTypes[currentConfigureIndex].id,
                          step.id,
                          { targets: newValue }
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder="Select or type who to reach..."
                            helperText="Pick from suggestions or type custom reach targets"
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={option}
                              size="small"
                              {...getTagProps({ index })}
                            />
                          ))
                        }
                      />
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => removeHandlingStep(
                        callTypes[currentConfigureIndex].id,
                        step.id
                      )}
                      disabled={callTypes[currentConfigureIndex].handlingSteps?.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              ))}

              <Button
                variant="outlined"
                onClick={() => addHandlingStep(callTypes[currentConfigureIndex].id)}
                startIcon={<AddIcon />}
                fullWidth
              >
                Add Another Handling Step
              </Button>

              <Divider sx={{ my: 3 }} />

              {/* Navigation between call types */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={currentConfigureIndex === 0 ? backToDefine : prevCallType}
                  startIcon={<NavigateBefore />}
                >
                  {currentConfigureIndex === 0 ? 'Back to Define' : 'Previous Type'}
                </Button>

                <Typography variant="body2" color="text.secondary">
                  {currentConfigureIndex + 1} of {callTypes.length}
                </Typography>

                <Button
                  variant="contained"
                  onClick={isLastCallType ? () => {} : nextCallType}
                  endIcon={<NavigateNext />}
                >
                  {isLastCallType ? 'Complete' : 'Next Type'}
                </Button>
              </Box>
            </Paper>
          </>
        )}

        {/* Footer navigation */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button startIcon={<NavigateBefore />} variant="outlined" onClick={() => history.push(WIZARD_ROUTES.COMPANY_INFO)}>
            Back
          </Button>
          <Button 
            endIcon={<NavigateNext />} 
            variant="contained" 
            onClick={() => history.push(WIZARD_ROUTES.ON_CALL)}
            disabled={currentPhase === 'define' || !isLastCallType}
          >
            Next: On Call
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AnswerCallsReach;
