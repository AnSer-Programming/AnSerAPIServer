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
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { Add as AddIcon, Delete as DeleteIcon, NavigateNext, NavigateBefore, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
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

const COMMON_CATEGORIES = [
  'No Heat',
  'No A/C',
  'Water Leak / Burst Pipe',
  'Thermostat Issue',
  'Routine Maintenance',
  'Emergency / After Hours',
  'Billing Question',
  'New Service / Quote',
];

// keep a small set of common categories as quick choices
const BUSINESS_CATEGORY_EXAMPLES = {
  HVAC: ['No Heat', 'No A/C', 'Thermostat Issue'],
  PropertyMgmt: ['Tenant emergency', 'Maintenance request'],
  Medical: ['Appointment', 'Medication refill', 'Lab results'],
  Funeral: ['Arrangement question', 'Service scheduling'],
  Service: ['Estimate request', 'Repair follow-up'],
  Other: ['General inquiry'],
};

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const AnswerCallsNew = () => {
  const theme = useTheme();
  const { darkMode } = useClientInfoTheme();
  const sharedStyles = createSharedStyles(theme, darkMode);
  const history = useHistory();
  const { getSection, updateSection, markStepVisited } = useWizard();

  // Persisted section shape: { businessType: '', categories: [{ id, selectedCommon, customName, details }] }
  const section = getSection('answerCalls') || {};
  const businessType = section.businessType || '';
  const categories = Array.isArray(section.categories) ? section.categories : [];

  // Local UI state (NOT persisted) - manages minimized/expanded state per session only
  const [minimizedMap, setMinimizedMap] = useState({});

  // Focus-guard: local editing buffers to prevent mid-edit clobbering
  const [editingBuffers, setEditingBuffers] = useState({});
  const commitTimeoutRef = useRef({});

  useEffect(() => {
    // ensure at least one category exists on initial load
    if (!categories || categories.length === 0) {
      const first = [{ id: makeId(), selectedCommon: '', customName: '', details: '' }];
      updateSection('answerCalls', { ...section, categories: first });
    }
    // set page title/meta
    const prev = document.title;
    document.title = 'Call Type Designer — AnSer Communications';
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; created = true; }
    meta.content = 'Design call categories and clarifying questions for incoming calls.';
    if (created) document.head.appendChild(meta);
    markStepVisited && markStepVisited('answer-calls');
    return () => { document.title = prev; if (created && meta && meta.parentNode) meta.parentNode.removeChild(meta); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup commit timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(commitTimeoutRef.current).forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, []);

  // Move focus to the main heading on mount for keyboard users
  useEffect(() => {
    const el = document.getElementById('answercalls-title');
    if (el && typeof el.focus === 'function') el.focus();
  }, []);

  const setSection = (patch) => updateSection('answerCalls', { ...section, ...patch });

  const handleBusinessTypeChange = (e) => setSection({ businessType: e.target.value });

  const addCategory = () => {
    // minimize existing categories and add a new expanded one
    const newId = makeId();
    const next = [...(categories || [])];
    next.push({ id: newId, selectedCommon: '', customName: '', details: '' });
    setSection({ categories: next });
    // Set new category as expanded (all others inherit their minimized state from minimizedMap)
    setMinimizedMap(prev => ({ ...prev, [newId]: false }));
  };

  const removeCategory = (id) => {
    // don't remove last one
    if (categories.length <= 1) return;
    const next = categories.filter((c) => c.id !== id);
    setSection({ categories: next });
    // Clean up UI state and editing buffers for removed category
    setMinimizedMap(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setEditingBuffers(prev => {
      const updated = { ...prev };
      delete updated[`${id}-customName`];
      delete updated[`${id}-details`];
      return updated;
    });
    // Clear any pending commit timeouts
    if (commitTimeoutRef.current[`${id}-customName`]) {
      clearTimeout(commitTimeoutRef.current[`${id}-customName`]);
      delete commitTimeoutRef.current[`${id}-customName`];
    }
    if (commitTimeoutRef.current[`${id}-details`]) {
      clearTimeout(commitTimeoutRef.current[`${id}-details`]);
      delete commitTimeoutRef.current[`${id}-details`];
    }
  };

  const updateCategory = (id, patch) => {
    const next = categories.map((c) => (c.id === id ? { ...c, ...patch } : c));
    setSection({ categories: next });
  };

  // Focus-guard: Start editing (store value in local buffer)
  const startEditing = (fieldKey, initialValue) => {
    setEditingBuffers(prev => ({ ...prev, [fieldKey]: initialValue }));
  };

  // Focus-guard: Commit edit (write to WizardContext after delay or on blur)
  const commitEdit = (id, fieldName, value) => {
    const fieldKey = `${id}-${fieldName}`;
    
    // Clear any pending timeout for this field
    if (commitTimeoutRef.current[fieldKey]) {
      clearTimeout(commitTimeoutRef.current[fieldKey]);
    }

    // Clear editing buffer
    setEditingBuffers(prev => {
      const updated = { ...prev };
      delete updated[fieldKey];
      return updated;
    });

    // Commit to WizardContext
    updateCategory(id, { [fieldName]: value });
  };

  // Focus-guard: Schedule delayed commit (for idle typing)
  const scheduleCommit = (id, fieldName, value, delay = 600) => {
    const fieldKey = `${id}-${fieldName}`;
    
    // Clear existing timeout
    if (commitTimeoutRef.current[fieldKey]) {
      clearTimeout(commitTimeoutRef.current[fieldKey]);
    }

    // Schedule new commit
    commitTimeoutRef.current[fieldKey] = setTimeout(() => {
      commitEdit(id, fieldName, value);
      delete commitTimeoutRef.current[fieldKey];
    }, delay);
  };

  const onCallCategorySelectChange = (id, value) => {
    // copy to customName if empty
    const cat = categories.find((c) => c.id === id) || {};
    const patch = { selectedCommon: value };
    if (!cat.customName && value) patch.customName = value;
    updateCategory(id, patch);
  };

  const handleCategoryFreeInputChange = (id, newValue) => {
    // when user picks or types in the combined field
    const allExamples = BUSINESS_REASONS[businessType]?.client_facing || BUSINESS_CATEGORY_EXAMPLES[businessType] || [];
    const isSuggestion = typeof newValue === 'string' && allExamples.includes(newValue);
    
    const fieldKey = `${id}-customName`;
    
    // Update local buffer
    setEditingBuffers(prev => ({ ...prev, [fieldKey]: newValue || '' }));
    
    // Schedule commit (will be cancelled if user continues typing)
    scheduleCommit(id, 'customName', newValue || '', 600);
    
    // Also update selectedCommon immediately if it's a suggestion
    if (isSuggestion) {
      updateCategory(id, { selectedCommon: newValue });
    } else {
      updateCategory(id, { selectedCommon: '' });
    }
  };

  const handleCategoryAccordionChange = (id) => (_, isExpanded) => {
    setMinimizedMap(prev => ({ ...prev, [id]: !isExpanded }));
  };

  // Helper to check if a category is minimized (default: false = expanded)
  const isMinimized = (id) => minimizedMap[id] === true;

  const getAvailableExamples = (catId) => {
    const used = (categories || []).map((c) => c.selectedCommon).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
    const list = (examples || []).filter((e) => !used.includes(e) || (categories.find((c) => c.id === catId)?.selectedCommon === e));
    return list;
  };

  // Prefer the richer master reasons when available (client_facing array), fallback to small set
  const examples = (BUSINESS_REASONS[businessType]?.client_facing) || BUSINESS_CATEGORY_EXAMPLES[businessType] || [];

  return (
    <Box sx={sharedStyles.layout.pageWrapper}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Paper
          elevation={2}
          role="region"
          aria-labelledby="answercalls-title"
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
          <Typography id="answercalls-title" component="h1" variant="h5" tabIndex={-1} sx={{ fontWeight: 700, mb: 0.5, color: theme.palette.primary.main }}>
            Answering & Call Handling
          </Typography>
          <Typography variant="body2" color="text.secondary">Define the categories and clarifying questions agents should use when answering calls.</Typography>
        </Paper>

        {/* Business Type Card */}
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 0.5 }}>Business Type</Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1 }}>Start by telling us what kind of account this is. Categories will belong to this business type.</Typography>

          <FormControl fullWidth>
            <InputLabel id="business-type-label">Select business type</InputLabel>
            <Select
              labelId="business-type-label"
              value={businessType}
              label="Select business type"
              onChange={handleBusinessTypeChange}
              size="small"
              inputProps={{ 'aria-label': 'Business type' }}
            >
              {BUSINESS_TYPE_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Categories Card */}
        <Paper sx={sharedStyles.card('primary', 'outlined')}>
          <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 0.5 }}>Call Categories</Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 1 }}>How do we identify this type of call from others? For each category, what clarifying questions should agents ask?</Typography>

          <Box sx={{ mt: 1 }}>
            {categories.map((cat, index) => {
              const minimized = isMinimized(cat.id);
              const customNameKey = `${cat.id}-customName`;
              const detailsKey = `${cat.id}-details`;

              // Use editing buffer if available, otherwise use persisted value
              const displayCustomName = editingBuffers[customNameKey] !== undefined
                ? editingBuffers[customNameKey]
                : cat.customName || '';
              const displayDetails = editingBuffers[detailsKey] !== undefined
                ? editingBuffers[detailsKey]
                : cat.details || '';

              return (
                <Accordion
                  key={cat.id}
                  expanded={!minimized}
                  onChange={handleCategoryAccordionChange(cat.id)}
                  disableGutters
                  sx={{
                    mb: 1.5,
                    border: '1px solid #e1e5ea',
                    borderRadius: 1,
                    boxShadow: 'none',
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`category-${cat.id}-content`}
                    id={`category-${cat.id}-header`}
                    sx={{ px: 2, py: 1 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                      <Box sx={{ flex: '0 0 auto', minWidth: 220 }}>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          {displayCustomName || cat.selectedCommon || `Call Category ${index + 1}`}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 2, pb: 2 }}>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      <Grid item xs={12}>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.5 }}>Pick one of the suggestions or type your own</Typography>
                        <Autocomplete
                          freeSolo
                          options={getAvailableExamples(cat.id)}
                          value={displayCustomName}
                          onChange={(_e, newValue) => handleCategoryFreeInputChange(cat.id, newValue)}
                          inputValue={displayCustomName}
                          onInputChange={(_e, newInput) => handleCategoryFreeInputChange(cat.id, newInput)}
                          onFocus={() => startEditing(customNameKey, cat.customName || '')}
                          onBlur={() => commitEdit(cat.id, 'customName', displayCustomName)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="e.g. Boiler Pressure Low"
                              inputProps={{ ...params.inputProps, 'aria-label': `Category input for ${cat.id}` }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ mb: 1, p: 1, borderRadius: 1, border: `1px solid ${theme.palette.divider}`, bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50] }}>
                        <Box component="ul" sx={{ pl: 2, mt: 0, mb: 0 }}>
                          <li style={{ listStyleType: 'disc', marginBottom: 6 }}><strong>What clarifying questions should agents ask?</strong></li>
                          <li style={{ listStyleType: 'disc' }}>How do we identify this from other calls?</li>
                          <li style={{ listStyleType: 'disc' }}>What follow-up questions confirm the issue?</li>
                          <li style={{ listStyleType: 'disc' }}>Any safety or access notes?</li>
                        </Box>
                      </Box>

                      <TextField
                        multiline
                        minRows={4}
                        fullWidth
                        size="small"
                        value={displayDetails}
                        onFocus={() => startEditing(detailsKey, cat.details || '')}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setEditingBuffers(prev => ({ ...prev, [detailsKey]: newValue }));
                          scheduleCommit(cat.id, 'details', newValue, 600);
                        }}
                        onBlur={() => commitEdit(cat.id, 'details', displayDetails)}
                        inputProps={{ 'aria-label': `Clarifying questions for ${displayCustomName || 'category'}` }}
                      />
                    </Box>

                    <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                      <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => removeCategory(cat.id)}>Remove</Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>

          <Box sx={{ mt: 1 }}>
            <Box sx={sharedStyles.buttonGroup}>
              <Button variant="contained" onClick={addCategory} startIcon={<AddIcon />}>+ Add Another Category</Button>
              <Box />
            </Box>
          </Box>
        </Paper>

        {/* Footer navigation */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button startIcon={<NavigateBefore />} variant="outlined" onClick={() => history.push(WIZARD_ROUTES.COMPANY_INFO)}>Back</Button>
          <Button endIcon={<NavigateNext />} variant="contained" onClick={() => history.push(WIZARD_ROUTES.ON_CALL)}>Next: On Call</Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AnswerCallsNew;

