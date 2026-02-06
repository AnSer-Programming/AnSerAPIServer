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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert,
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

const splitTopLevel = (value, delimiter = ' / ') => {
  const parts = [];
  let buffer = '';
  let depth = 0;

  for (let i = 0; i < value.length; i += 1) {
    const ch = value[i];
    if (ch === '(') depth += 1;
    if (ch === ')') depth = Math.max(0, depth - 1);

    if (depth === 0 && value.slice(i, i + delimiter.length) === delimiter) {
      if (buffer.trim()) parts.push(buffer.trim());
      buffer = '';
      i += delimiter.length - 1;
      continue;
    }

    buffer += ch;
  }

  if (buffer.trim()) parts.push(buffer.trim());
  return parts;
};

const findSeparatorOutsideParens = (value, separators) => {
  let depth = 0;
  for (let i = 0; i < value.length; i += 1) {
    const ch = value[i];
    if (ch === '(') depth += 1;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (depth !== 0) continue;

    for (const sep of separators) {
      if (value.slice(i, i + sep.length) === sep) {
        return { index: i, sep };
      }
    }
  }

  return null;
};

const expandParentheticalOptions = (value) => {
  const start = value.indexOf('(');
  if (start === -1) return [value];

  let depth = 0;
  let end = -1;
  for (let i = start; i < value.length; i += 1) {
    const ch = value[i];
    if (ch === '(') depth += 1;
    if (ch === ')') {
      depth -= 1;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }

  if (end === -1) return [value];

  const inside = value.slice(start + 1, end);
  const insideParts = splitTopLevel(inside);
  if (insideParts.length <= 1) return [value];

  const prefix = value.slice(0, start).trimEnd();
  const suffix = value.slice(end + 1).trimStart();

  return insideParts.map((part) => {
    const core = prefix ? `${prefix} (${part.trim()})` : `(${part.trim()})`;
    return suffix ? `${core} ${suffix}` : core;
  });
};

const splitReason = (raw) => {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return [];

  const dashSeparators = [' - ', ' – ', ' — '];
  const dashMatch = findSeparatorOutsideParens(trimmed, dashSeparators);
  if (dashMatch) {
    const prefix = trimmed.slice(0, dashMatch.index).trim();
    const rest = trimmed.slice(dashMatch.index + dashMatch.sep.length).trim();
    if (prefix && rest) {
      const restParts = splitTopLevel(rest);
      if (restParts.length > 1) {
        return restParts.flatMap((part) => expandParentheticalOptions(`${prefix} - ${part.trim()}`));
      }
    }
  }

  return splitTopLevel(trimmed).flatMap(expandParentheticalOptions);
};

const normalizeSuggestionList = (list = []) => {
  const seen = new Set();
  const output = [];

  list.forEach((item) => {
    splitReason(item).forEach((entry) => {
      const cleaned = entry.replace(/\s+/g, ' ').trim();
      if (!cleaned) return;
      const key = cleaned.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      output.push(cleaned);
    });
  });

  return output;
};

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const AnswerCallsNew = () => {
  const theme = useTheme();
  const { darkMode } = useClientInfoTheme();
  const sharedStyles = createSharedStyles(theme, darkMode);
  const history = useHistory();
  const { getSection, updateSection, markStepVisited, validateSection } = useWizard();

  // Persisted section shape: { businessType: '', categories: [{ id, selectedCommon, customName, details }] }
  const section = getSection('answerCalls') || {};
  const businessType = section.businessType || '';
  const categories = Array.isArray(section.categories) ? section.categories : [];

  // Local UI state (NOT persisted) - manages minimized/expanded state per session only
  // Initialize all categories as collapsed on page load
  const [minimizedMap, setMinimizedMap] = useState(() => {
    const initial = {};
    if (Array.isArray(section.categories)) {
      section.categories.forEach(cat => {
        initial[cat.id] = true; // all collapsed by default
      });
    }
    return initial;
  });

  // Confirmation dialog for category removal
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  // Focus-guard: local editing buffers to prevent mid-edit clobbering
  const [editingBuffers, setEditingBuffers] = useState({});
  const commitTimeoutRef = useRef({});

  useEffect(() => {
    // Ensure any categories loaded later start collapsed
    setMinimizedMap((prev) => {
      const next = { ...prev };
      let changed = false;
      categories.forEach((cat) => {
        if (next[cat.id] === undefined) {
          next[cat.id] = true;
          changed = true;
        }
      });
      Object.keys(next).forEach((id) => {
        if (!categories.some((cat) => cat.id === id)) {
          delete next[id];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [categories]);

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

  const getFirstValidationMessage = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
      for (const item of value) {
        const message = getFirstValidationMessage(item);
        if (message) return message;
      }
      return '';
    }
    if (typeof value === 'object') {
      for (const item of Object.values(value)) {
        const message = getFirstValidationMessage(item);
        if (message) return message;
      }
      return '';
    }
    return '';
  };

  const handleBusinessTypeChange = (e) => setSection({ businessType: e.target.value });

  // Prefer the richer master reasons when available (client_facing array), fallback to small set
  const rawExamples = BUSINESS_REASONS[businessType]?.client_facing || BUSINESS_CATEGORY_EXAMPLES[businessType] || [];
  const examples = normalizeSuggestionList(rawExamples);
  const exampleMap = new Map(examples.map((example) => [example.toLowerCase(), example]));

  const addCategory = () => {
    // minimize existing categories and add a new expanded one
    const newId = makeId();
    const next = [...(categories || [])];
    next.push({ id: newId, selectedCommon: '', customName: '', details: '' });
    setSection({ categories: next });
    // Collapse all existing categories, expand only the new one
    const newMinimizedMap = {};
    categories.forEach(cat => {
      newMinimizedMap[cat.id] = true; // minimize all existing
    });
    newMinimizedMap[newId] = false; // expand the new one
    setMinimizedMap(newMinimizedMap);
  };

  const requestRemoveCategory = (id) => {
    // don't remove last one
    if (categories.length <= 1) return;
    setCategoryToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmRemoveCategory = () => {
    if (!categoryToDelete) return;
    const next = categories.filter((c) => c.id !== categoryToDelete);
    setSection({ categories: next });
    // Clean up UI state and editing buffers for removed category
    setMinimizedMap(prev => {
      const updated = { ...prev };
      delete updated[categoryToDelete];
      return updated;
    });
    setEditingBuffers(prev => {
      const updated = { ...prev };
      delete updated[`${categoryToDelete}-customName`];
      delete updated[`${categoryToDelete}-details`];
      return updated;
    });
    // Clear any pending commit timeouts
    if (commitTimeoutRef.current[`${categoryToDelete}-customName`]) {
      clearTimeout(commitTimeoutRef.current[`${categoryToDelete}-customName`]);
      delete commitTimeoutRef.current[`${categoryToDelete}-customName`];
    }
    if (commitTimeoutRef.current[`${categoryToDelete}-details`]) {
      clearTimeout(commitTimeoutRef.current[`${categoryToDelete}-details`]);
      delete commitTimeoutRef.current[`${categoryToDelete}-details`];
    }
    // Close dialog and reset
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const cancelRemoveCategory = () => {
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
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
    const rawValue = typeof newValue === 'string' ? newValue : '';
    const normalizedValue = rawValue.trim();
    const matchedExample = normalizedValue ? exampleMap.get(normalizedValue.toLowerCase()) : '';
    const isSuggestion = Boolean(matchedExample);
    
    const fieldKey = `${id}-customName`;
    
    // Update local buffer
    setEditingBuffers(prev => ({ ...prev, [fieldKey]: rawValue }));
    
    // Schedule commit (will be cancelled if user continues typing)
    scheduleCommit(id, 'customName', rawValue, 600);
    
    // Also update selectedCommon immediately if it's a suggestion
    if (isSuggestion) {
      updateCategory(id, { selectedCommon: matchedExample });
    } else {
      updateCategory(id, { selectedCommon: '' });
    }
  };

  const onNext = () => {
    markStepVisited?.('answer-calls');
    const validationErrors = validateSection?.('answerCalls', section);

    if (validationErrors) {
      const message = getFirstValidationMessage(validationErrors)
        || 'Please complete required answer-calls fields before continuing.';
      setSnack({ open: true, msg: message, severity: 'error' });
      return;
    }

    history.push(WIZARD_ROUTES.ON_CALL);
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
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Business Type</Typography>
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
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Call Categories</Typography>
          <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 0.5 }}>How do we identify this type of call from others? For each category, what clarifying questions should agents ask?</Typography>

          <Box>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Typography variant="h5" sx={{ fontWeight: 700, fontSize: '1.35rem', color: theme.palette.text.primary }}>
                        {displayCustomName || cat.selectedCommon || `Call Category ${index + 1}`}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 400, mb: 0.5, color: 'text.secondary' }}>Pick one of the suggestions or type your own</Typography>
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

                    <Box sx={{ mt: 1 }}>
                      <Typography sx={{ fontSize: 10, fontWeight: 400, mb: 0.5, color: 'text.secondary' }}>
                        What clarifying questions should agents ask for this call type?
                      </Typography>
                      <Box sx={{ fontSize: 12, color: 'text.secondary', mb: 1, pl: 1 }}>
                        <ul style={{ margin: 0, paddingLeft: 16 }}>
                          <li>How do we identify this from other calls?</li>
                          <li>What follow-up questions confirm the issue?</li>
                          <li>Any safety or access notes?</li>
                        </ul>
                      </Box>
                      <TextField
                        multiline
                        minRows={3}
                        fullWidth
                        size="small"
                        placeholder="e.g. Is this an emergency? When did the issue start? Have you tried restarting?"
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
                      <Button size="small" variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => requestRemoveCategory(cat.id)}>Remove</Button>
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
          <Button endIcon={<NavigateNext />} variant="contained" onClick={onNext}>Next: On Call Setup</Button>
        </Box>
      </Container>

      {/* Confirmation Dialog for Category Removal */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={cancelRemoveCategory}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Remove Call Category?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to remove this call category? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelRemoveCategory} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmRemoveCategory} color="error" variant="contained" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AnswerCallsNew;

