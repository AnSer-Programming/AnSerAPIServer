import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Collapse,
} from '@mui/material';
import FieldRow from '../components/FieldRow';
import PhoneMaskInput from '../components/PhoneMaskInput';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Groups,
  Phone,
  Email,
  Home,
  Message,
  Notifications,
  Person,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { isValidPhone, getPhoneError } from '../utils/phonePostalValidation';
import { isValidEmail, getEmailError } from '../utils/emailValidation';

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createDefaultEscalationSteps = () => ([
  {
    id: generateId(),
    contactMethod: '',
    attempts: '',
    interval: '',
  },
]);

const ensureArray = (value) => {
  if (Array.isArray(value)) {
    return value.length ? value.map((entry) => entry ?? '') : [''];
  }
  if (value == null || value === '') {
    return [''];
  }
  return [value];
};

const normalizeEscalationSteps = (steps) => {
  if (!Array.isArray(steps) || steps.length === 0) {
    return createDefaultEscalationSteps();
  }
  return steps.map((step) => ({
    id: step?.id || generateId(),
    contactMethod: step?.contactMethod || '',
    attempts: step?.attempts || '',
    interval: step?.interval || '',
  }));
};

const createDefaultTeamMember = () => ({
  id: generateId(),
  name: '',
  title: '',
  role: 'primary', // 'primary' or 'backup'
  email: [''],
  cellPhone: [''],
  homePhone: [''],
  textCell: [''],
  pager: [''],
  msm: [''],
  escalationSteps: createDefaultEscalationSteps(),
});

const normalizeMember = (member = {}) => {
  const base = createDefaultTeamMember();
  return {
    ...base,
    ...member,
    id: member?.id || base.id,
    name: member?.name || '',
    title: member?.title || '',
    role: member?.role || 'primary',
    email: ensureArray(member?.email ?? member?.emails),
    cellPhone: ensureArray(member?.cellPhone ?? member?.cell),
    homePhone: ensureArray(member?.homePhone ?? member?.home),
    textCell: ensureArray(member?.textCell ?? member?.text),
    pager: ensureArray(member?.pager ?? member?.other),
    msm: ensureArray(member?.msm),
    escalationSteps: normalizeEscalationSteps(member?.escalationSteps),
  };
};

const normalizeTeam = (team = []) => {
  if (!Array.isArray(team) || team.length === 0) return [];
  return team.map((member) => normalizeMember(member));
};

const getPrimaryContactValue = (value) => {
  if (Array.isArray(value)) {
    return value.find((entry) => (entry || '').trim()) || '';
  }
  return value || '';
};

const CONTACT_ERROR_KEYS = {
  cellPhone: ['cellPhone', 'cell'],
  homePhone: ['homePhone', 'home'],
  email: ['email'],
  textCell: ['textCell', 'text'],
  pager: ['pager', 'other'],
  msm: ['msm'],
};

const resolveContactError = (errors, contactType) => {
  const keys = CONTACT_ERROR_KEYS[contactType] || [contactType];
  if (!errors) return '';

  for (const key of keys) {
    if (errors[key]) {
      return errors[key];
    }
  }

  return '';
};

const EnhancedOnCallTeamSection = ({ onCall = {}, setOnCall = () => {}, errors = [] }) => {
  const theme = useTheme();
  const { darkMode } = useClientInfoTheme();

  const normalizedInitialTeam = useMemo(() => normalizeTeam(onCall?.team), [onCall?.team]);

  // Initialize team members state with normalized data
  const [teamMembers, setTeamMembers] = useState(normalizedInitialTeam);
  
  // State for managing expanded team members (default all collapsed)
  const [expandedMembers, setExpandedMembers] = useState(() => new Set());

  useEffect(() => {
    setTeamMembers(normalizedInitialTeam);
    setExpandedMembers((prev) => {
      const prevSet = prev || new Set();
      const validIds = new Set(normalizedInitialTeam.map((member) => member.id));
      return new Set([...prevSet].filter((id) => validIds.has(id)));
    });
  }, [normalizedInitialTeam]);
  
  // Refs for scrolling
  const teamMembersRefs = React.useRef({});

  // Anchor elements for the add-method menu per member
  const [addMethodAnchor, setAddMethodAnchor] = useState({});

  const openAddMethodMenu = (memberId, event) => {
    setAddMethodAnchor((prev) => ({ ...prev, [memberId]: event.currentTarget }));
  };

  const closeAddMethodMenu = (memberId) => {
    setAddMethodAnchor((prev) => ({ ...prev, [memberId]: null }));
  };

  // Confirmation dialog for applying defaults
  const [confirmApplyOpen, setConfirmApplyOpen] = useState(false);
  const [confirmApplyMemberId, setConfirmApplyMemberId] = useState(null);

  const openConfirmApply = (memberId) => {
    setConfirmApplyMemberId(memberId);
    setConfirmApplyOpen(true);
  };

  const closeConfirmApply = () => {
    setConfirmApplyMemberId(null);
    setConfirmApplyOpen(false);
  };

  const clearSavedDefaults = () => {
    // Clear defaults on the onCall section
    setOnCall({ ...onCall, defaultContactMethods: [], defaultEscalationSteps: [] });
  };

  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const inputBg = darkMode ? alpha('#fff', 0.06) : theme.palette.common.white;

  const addTeamMember = () => {
    const newMember = createDefaultTeamMember();
    // If there are default contact methods on the onCall section, add them so the new member shows those fields
    const defaults = Array.isArray(onCall?.defaultContactMethods) ? onCall.defaultContactMethods : [];
    if (defaults.length) {
      const added = new Set(defaults.filter(Boolean));
      // ensure cellPhone is always present
      added.add('cellPhone');
      newMember._methodsAdded = Array.from(added);
      // ensure arrays exist for the fields
      for (const k of added) {
        if (!Array.isArray(newMember[k])) newMember[k] = [''];
      }
    }
    // If there are default escalation steps, apply them to the new member
    const defaultEsc = Array.isArray(onCall?.defaultEscalationSteps) ? onCall.defaultEscalationSteps : [];
    if (defaultEsc.length) {
      newMember.escalationSteps = normalizeEscalationSteps(defaultEsc);
    }
    const updatedTeam = normalizeTeam([...teamMembers, newMember]);
    setTeamMembers(updatedTeam);
    setOnCall({ team: updatedTeam });

    // Collapse all existing members and expand only the new one
    setExpandedMembers(new Set([newMember.id]));

    // Scroll to the new member after a short delay
    setTimeout(() => {
      const element = teamMembersRefs.current[newMember.id];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const removeTeamMember = (memberId) => {
    const updatedTeam = teamMembers.filter(member => member.id !== memberId);
    const normalizedTeam = normalizeTeam(updatedTeam);
    setTeamMembers(normalizedTeam);
    setOnCall({ team: normalizedTeam });

    // Remove from expanded set
    setExpandedMembers(prev => {
      const newSet = new Set(prev);
      newSet.delete(memberId);
      return newSet;
    });
  };

  // Toggle member expansion
  const toggleMemberExpansion = (memberId) => {
    setExpandedMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };

  const updateTeamMember = (memberId, field, value) => {
    const updatedTeam = teamMembers.map(member =>
      member.id === memberId ? { ...member, [field]: value } : member
    );
    const normalizedTeam = normalizeTeam(updatedTeam);
    setTeamMembers(normalizedTeam);
    setOnCall({ team: normalizedTeam });
  };

  // Contact method management
  const addContactMethod = (memberId, contactType) => {
    let focusTarget = null;
    const updatedTeam = teamMembers.map(member => {
      if (member.id === memberId) {
        const currentArray = Array.isArray(member[contactType]) ? member[contactType] : [];
        const hasOnlyEmpty = currentArray.length === 1 && (currentArray[0] === '' || currentArray[0] == null);
        const nextArray = currentArray.length === 0 || hasOnlyEmpty ? [''] : [...currentArray, ''];
        const targetIndex = (currentArray.length === 0 || hasOnlyEmpty) ? 0 : nextArray.length - 1;
        const added = Array.isArray(member._methodsAdded)
          ? member._methodsAdded.filter((method) => method !== contactType)
          : [];
        added.push(contactType);
        focusTarget = { memberId, contactType, index: targetIndex };
        return {
          ...member,
          [contactType]: nextArray,
          _methodsAdded: added,
        };
      }
      return member;
    });
    const normalizedTeam = normalizeTeam(updatedTeam);
    setTeamMembers(normalizedTeam);
    setOnCall({ team: normalizedTeam });
    if (focusTarget) {
      setPendingFocus(focusTarget);
    }
  };

  const removeContactMethod = (memberId, contactType, index) => {
    const updatedTeam = teamMembers.map(member => {
      if (member.id === memberId) {
        const currentArray = member[contactType] || [];
        const newArray = currentArray.filter((_, i) => i !== index);
        return {
          ...member,
          [contactType]: newArray.length > 0 ? newArray : [''] // Always keep at least one empty field
        };
      }
      return member;
    });
    const normalizedTeam = normalizeTeam(updatedTeam);
    setTeamMembers(normalizedTeam);
    setOnCall({ team: normalizedTeam });
  };

  const updateContactMethod = (memberId, contactType, index, value) => {
    const updatedTeam = teamMembers.map(member => {
      if (member.id === memberId) {
        const currentArray = [...(member[contactType] || [''])];
        currentArray[index] = value;
        return {
          ...member,
          [contactType]: currentArray
        };
      }
      return member;
    });
    const normalizedTeam = normalizeTeam(updatedTeam);
    setTeamMembers(normalizedTeam);
    setOnCall({ team: normalizedTeam });
  };

  const removeContactMethodType = (memberId, contactType) => {
    const updatedTeam = teamMembers.map(member => {
      if (member.id !== memberId) return member;
      const next = { ...member, [contactType]: [''] };
      if (Array.isArray(next._methodsAdded)) {
        next._methodsAdded = next._methodsAdded.filter((method) => method !== contactType);
      }
      return next;
    });
    const normalizedTeam = normalizeTeam(updatedTeam);
    setTeamMembers(normalizedTeam);
    setOnCall({ team: normalizedTeam });

    setContactValidationErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${memberId}-${contactType}-`)) {
          delete next[key];
        }
      });
      return next;
    });
  };

  // Render contact method fields - compact version with validation
  const [contactValidationErrors, setContactValidationErrors] = useState({});
  const [pendingFocus, setPendingFocus] = useState(null);

  const validateContactField = (memberId, contactType, index, value) => {
    const key = `${memberId}-${contactType}-${index}`;
    let error = '';
    
    if (value && value.trim()) {
      if (contactType === 'email') {
        error = getEmailError(value);
      } else if (['cellPhone', 'homePhone', 'textCell'].includes(contactType)) {
        error = getPhoneError(value);
      }
    }
    
    setContactValidationErrors(prev => {
      if (error) {
        return { ...prev, [key]: error };
      } else {
        const next = { ...prev };
        delete next[key];
        return next;
      }
    });
  };

  const renderContactMethodField = (member, contactType, label, icon, errorMessage) => {
    const contacts = member[contactType] || [''];
    const showError = Boolean(errorMessage);
    const canRemoveMethod = true;
    
    const placeholderMap = {
      cellPhone: '(555) 123-4567',
      homePhone: '(555) 987-6543',
      email: 'name@company.com',
      textCell: '(555) 123-4567',
      pager: 'Pager number or code',
      msm: 'MSM username or ID',
    };

    return (
      <Box sx={{ mb: 1.5 }}>
        {contacts.map((contact, index) => {
          const validationKey = `${member.id}-${contactType}-${index}`;
          const validationError = contactValidationErrors[validationKey] || '';
          const fieldError = (showError && index === 0) ? errorMessage : validationError;
          
        const showRowRemove = contacts.length > 1;
        const showMethodRemove = !showRowRemove && canRemoveMethod;
        const shouldAutoFocus = Boolean(
          pendingFocus
            && pendingFocus.memberId === member.id
            && pendingFocus.contactType === contactType
            && pendingFocus.index === index
        );
        const isPhoneType = ['cellPhone', 'homePhone', 'textCell'].includes(contactType);

        return (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
              <TextField
                label={contacts.length > 1 ? `${label} ${index + 1}` : label}
                placeholder={placeholderMap[contactType] || ''}
                value={contact}
                type={contactType === 'email' ? 'email' : 'text'}
                inputMode={contactType === 'email' ? 'email' : (isPhoneType ? 'tel' : 'text')}
                onChange={(e) => {
                  updateContactMethod(member.id, contactType, index, e.target.value);
                  // Clear validation error if user is typing and value becomes valid
                  if (validationError) {
                    const isPhone = ['cellPhone', 'homePhone', 'textCell'].includes(contactType);
                    const isEmailType = contactType === 'email';
                    if ((isPhone && isValidPhone(e.target.value)) || (isEmailType && isValidEmail(e.target.value))) {
                      setContactValidationErrors(prev => {
                        const next = { ...prev };
                        delete next[validationKey];
                        return next;
                      });
                    }
                  }
                }}
                onBlur={(e) => validateContactField(member.id, contactType, index, e.target.value)}
                size="small"
                sx={{ flex: 1, bgcolor: inputBg }}
                error={Boolean(fieldError)}
                helperText={fieldError}
                InputProps={isPhoneType ? { inputComponent: PhoneMaskInput, inputProps: { type: 'phone' } } : undefined}
                inputRef={(node) => {
                  if (node && shouldAutoFocus) {
                    requestAnimationFrame(() => {
                      node.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                      node.focus();
                    });
                    setPendingFocus(null);
                  }
                }}
              />
            {(showRowRemove || showMethodRemove) && (
              <Tooltip title={showRowRemove ? 'Remove this entry' : `Remove ${label}`}>
                <IconButton
                  onClick={() => (showRowRemove
                    ? removeContactMethod(member.id, contactType, index)
                    : removeContactMethodType(member.id, contactType))}
                  color="error"
                  size="small"
                  sx={{ p: 0.5, alignSelf: 'center' }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          );
        })}
      </Box>
    );
  };

  // Escalation steps management
  const addEscalationStep = (memberId) => {
    const updatedTeam = teamMembers.map(member => {
      if (member.id === memberId) {
        const [newStep] = createDefaultEscalationSteps();
        return {
          ...member,
          escalationSteps: [...(member.escalationSteps || []), newStep]
        };
      }
      return member;
    });
    const normalizedTeam = normalizeTeam(updatedTeam);
    setTeamMembers(normalizedTeam);
    setOnCall({ team: normalizedTeam });
  };

  const removeEscalationStep = (memberId, stepId) => {
    const updatedTeam = teamMembers.map(member => {
      if (member.id === memberId) {
        const updatedSteps = member.escalationSteps.filter(step => step.id !== stepId);
        return {
          ...member,
          escalationSteps: updatedSteps.length > 0 ? updatedSteps : createDefaultEscalationSteps()
        };
      }
      return member;
    });
    const normalizedTeam = normalizeTeam(updatedTeam);
    setTeamMembers(normalizedTeam);
    setOnCall({ team: normalizedTeam });
  };

  const updateEscalationStep = (memberId, stepId, field, value) => {
    const updatedTeam = teamMembers.map(member => {
      if (member.id === memberId) {
        const updatedSteps = member.escalationSteps.map(step =>
          step.id === stepId ? { ...step, [field]: value } : step
        );
        return {
          ...member,
          escalationSteps: updatedSteps
        };
      }
      return member;
    });
    const normalizedTeam = normalizeTeam(updatedTeam);
    setTeamMembers(normalizedTeam);
    setOnCall({ team: normalizedTeam });
  };

  // Apply defaults (escalation steps + contact methods) from the selected member to all members and save as onCall defaults
  const applyDefaultsToAll = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;
    const thisSteps = member.escalationSteps || [];
    const methodKeys = ['cellPhone', 'homePhone', 'email', 'textCell', 'pager'];
    const methodsToDefault = methodKeys.filter(k => k !== 'cellPhone' && ((Array.isArray(member._methodsAdded) && member._methodsAdded.includes(k)) || (member[k] && member[k].some(v => (v || '').trim()))));

    const next = teamMembers.map(m => {
      const existingAdded = new Set(Array.isArray(m._methodsAdded) ? m._methodsAdded : []);
      methodsToDefault.forEach(k => existingAdded.add(k));
      existingAdded.add('cellPhone');
      const nm = { ...m, escalationSteps: thisSteps.length ? thisSteps : (m.escalationSteps || []), _methodsAdded: Array.from(existingAdded) };
      methodsToDefault.forEach((k) => {
        if (!Array.isArray(nm[k]) || nm[k].length === 0) nm[k] = [''];
      });
      return nm;
    });

    setTeamMembers(normalizeTeam(next));
    setOnCall({ team: next, defaultEscalationSteps: thisSteps, defaultContactMethods: methodsToDefault });
    // Show summary toast
    setSnack({ open: true, msg: `Applied ${methodsToDefault.length} contact method(s) and ${thisSteps.length} escalation step(s) to ${next.length} members.`, severity: 'success' });
  };

  const teamErrors = Array.isArray(errors) ? errors : [];

  return (
    <>
      <Box sx={{ mb: 3 }}>
  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Box sx={{ 
          p: 1.5, 
          borderRadius: 2, 
          bgcolor: alpha(theme.palette.success.main, 0.15),
          color: theme.palette.success.main 
        }}>
          <Groups fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
            On-Call & Team Members
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add team members and configure how to reach them during after-hours situations
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto' }} />
      </Stack>

      {/* Add Team Member button is rendered after the member list so it appears after the last added member */}

      {teamMembers.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No team members added yet. Click "Add Team Member" to get started.
        </Alert>
      )}

      {teamMembers.map((member, index) => {
        const isExpanded = expandedMembers.has(member.id);
        const memberErrors = teamErrors[index] || {};
        const hasMemberError = Object.keys(memberErrors).length > 0;
        const primaryContact = getPrimaryContactValue(member.cellPhone)
          || getPrimaryContactValue(member.email)
          || getPrimaryContactValue(member.emails)
          || getPrimaryContactValue(member.homePhone)
          || getPrimaryContactValue(member.pager);
        return (
          <Box 
            key={member.id}
            ref={el => teamMembersRefs.current[member.id] = el}
            sx={{ 
              mb: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: hasMemberError ? `1px solid ${alpha(theme.palette.error.main, 0.5)}` : `1px solid ${alpha(theme.palette.divider, 0.12)}`,
              borderRadius: 2,
              boxShadow: hasMemberError ? `0 0 0 2px ${alpha(theme.palette.error.main, 0.08)}` : 'none',
            }}
          >
            {/* Header - Always Visible */}
            <Box 
              sx={{ 
                p: 2,
                borderBottom: isExpanded ? `1px solid ${alpha(theme.palette.divider, 0.12)}` : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderRadius: isExpanded ? '8px 8px 0 0' : '8px',
                bgcolor: hasMemberError ? alpha(theme.palette.error.main, 0.08) : alpha(theme.palette.primary.main, 0.04),
                '&:hover': {
                  bgcolor: hasMemberError ? alpha(theme.palette.error.main, 0.12) : alpha(theme.palette.primary.main, 0.08),
                }
              }}
              onClick={() => toggleMemberExpansion(member.id)}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: 1, 
                  color: hasMemberError ? theme.palette.error.main : theme.palette.primary.main 
                }}>
                  <Person fontSize="small" />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: hasMemberError ? theme.palette.error.main : theme.palette.primary.main }}>
                    {member.name?.trim() || `Team Member ${index + 1}`}
                  </Typography>
                  {member.title?.trim() && (
                    <Typography variant="body2" color="text.secondary">
                      {member.title}
                    </Typography>
                  )}
                  {primaryContact && (
                    <Typography variant="caption" color="text.secondary">
                      Primary contact: {primaryContact}
                    </Typography>
                  )}
                </Box>
              </Stack>
              
              <Stack direction="row" alignItems="center" spacing={1}>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTeamMember(member.id);
                  }}
                  sx={{ 
                    borderRadius: 2,
                    minWidth: 'auto',
                    px: 2
                  }}
                >
                  Remove
                </Button>
                {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Stack>
            </Box>

            {/* Collapsible Content */}
            <Collapse in={isExpanded} timeout={300}>
              <Box sx={{ p: { xs: 2, md: 2.5 }, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                <Grid container spacing={2.5}>
                  {/* Basic Information */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                      boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.03)}`,
                      height: '100%'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Box sx={{
                          p: 0.5,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.08),
                          color: theme.palette.primary.main,
                          display: 'flex',
                        }}>
                          <Person fontSize="small" />
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Basic Information
                        </Typography>
                      </Box>
                      <Stack spacing={1.5}>
                        <TextField
                          label="Full Name"
                          placeholder="John Smith"
                          value={member.name}
                          onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                          fullWidth
                          size="small"
                          error={Boolean(memberErrors?.name)}
                          helperText={memberErrors?.name || ''}
                        />
                        <TextField
                          label="Job Title"
                          placeholder="On-Call Technician"
                          value={member.title}
                          onChange={(e) => updateTeamMember(member.id, 'title', e.target.value)}
                          fullWidth
                          size="small"
                        />
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Contact Methods */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'background.paper',
                      border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                      boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.03)}`,
                      height: '100%'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Box sx={{
                          p: 0.5,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.success.main, 0.08),
                          color: theme.palette.success.main,
                          display: 'flex',
                        }}>
                          <Phone fontSize="small" />
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Contact Information
                        </Typography>
                      </Box>

                      {memberErrors?.contactRequired && (
                        <Alert severity="warning" sx={{ mb: 1.5, py: 0.25 }} icon={false}>
                          <Typography variant="caption">{memberErrors.contactRequired}</Typography>
                        </Alert>
                      )}

                      {/* Render contact methods the user has added or that already contain values */}
                      {(() => {
                        const methodKeys = ['cellPhone', 'homePhone', 'pager', 'msm', 'email'];
                        const addedArray = Array.isArray(member._methodsAdded) ? member._methodsAdded : [];
                        const addedOrdered = Array.from(new Set(addedArray.filter(k => methodKeys.includes(k))));
                        const fallback = methodKeys.filter(k => !addedOrdered.includes(k) && (member[k] && member[k].some(v => (v || '').trim())));
                        const finalList = [...fallback, ...addedOrdered];
                        const labelMap = {
                          cellPhone: 'Cell Phone',
                          homePhone: 'Home Phone',
                          email: 'Email',
                          pager: 'Pager',
                          msm: 'MSM',
                        };
                        const iconMap = {
                          cellPhone: <Phone fontSize="small" />,
                          homePhone: <Home fontSize="small" />,
                          email: <Email fontSize="small" />,
                          pager: <Notifications fontSize="small" />,
                          msm: <Message fontSize="small" />,
                        };
                        return finalList.map((k) => (
                          <React.Fragment key={k}>
                            {renderContactMethodField(member, k, labelMap[k], iconMap[k], resolveContactError(memberErrors, k))}
                          </React.Fragment>
                        ));
                      })()}

                      {/* Button to add another contact method */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.5 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => openAddMethodMenu(member.id, e)}
                          startIcon={<AddIcon />}
                          sx={{
                            flex: 1,
                            textTransform: 'none',
                            fontSize: 12,
                            color: 'text.secondary',
                            borderColor: alpha(theme.palette.divider, 0.6),
                            borderStyle: 'dashed',
                            borderRadius: 1.5,
                            minHeight: 40,
                            py: 0.5,
                            justifyContent: 'center',
                            pl: 1,
                            '&:hover': {
                              borderColor: theme.palette.primary.main,
                              color: theme.palette.primary.main,
                              bgcolor: alpha(theme.palette.primary.main, 0.04),
                            }
                          }}
                        >
                          Add contact method
                        </Button>
                        <Box sx={{ width: 32, height: 32, flexShrink: 0 }} />
                      </Box>
                      <Menu
                        anchorEl={addMethodAnchor[member.id]}
                        open={Boolean(addMethodAnchor[member.id])}
                        onClose={() => closeAddMethodMenu(member.id)}
                      >
                        {[
                          ['cellPhone', 'Cell Phone'],
                          ['homePhone', 'Home Phone'],
                          ['pager', 'Pager'],
                          ['msm', 'MSM'],
                          ['email', 'Email'],
                        ].map(([key, label]) => (
                          <MenuItem
                            key={key}
                            onClick={() => { addContactMethod(member.id, key); closeAddMethodMenu(member.id); }}
                          >
                            {label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Box>
                  </Grid>

                  {/* Escalation Procedures - Timeline Style */}
                  <Grid item xs={12}>
                    <Box sx={{
                      p: 2.5,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.warning.main, 0.03),
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.15)}`,
                    }}>
                      {/* Header */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{
                            p: 0.75,
                            borderRadius: 1.5,
                            bgcolor: alpha(theme.palette.warning.main, 0.12),
                            color: theme.palette.warning.dark,
                            display: 'flex',
                          }}>
                            <Notifications fontSize="small" />
                          </Box>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                              Escalation Procedures
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              How we reach this person, step by step
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Timeline Steps */}
                      <Box sx={{ position: 'relative', pl: 1 }}>
                        {member.escalationSteps?.map((step, stepIndex) => {
                          const isLast = stepIndex === member.escalationSteps.length - 1;
                          return (
                            <Box
                              key={step.id}
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 2,
                                mb: isLast ? 0 : 1.5,
                                position: 'relative',
                              }}
                            >
                              {/* Timeline connector */}
                              <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                pt: 0.5,
                              }}>
                                {/* Step number circle */}
                                <Box sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: '50%',
                                  bgcolor: theme.palette.warning.main,
                                  color: '#fff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: 13,
                                  flexShrink: 0,
                                  zIndex: 1,
                                }}>
                                  {stepIndex + 1}
                                </Box>
                                {/* Vertical line */}
                                {!isLast && (
                                  <Box sx={{
                                    width: 2,
                                    flexGrow: 1,
                                    bgcolor: alpha(theme.palette.warning.main, 0.3),
                                    minHeight: 40,
                                    mt: 0.5,
                                  }} />
                                )}
                              </Box>

                              {/* Step content */}
                              <Box sx={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                flexWrap: 'wrap',
                                p: 1.5,
                                borderRadius: 1.5,
                                bgcolor: 'background.paper',
                                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                                boxShadow: `0 1px 3px ${alpha(theme.palette.common.black, 0.04)}`,
                              }}>
                                <FormControl size="small" sx={{ minWidth: 150, flex: '1 1 150px' }}>
                                  <InputLabel>Contact Method</InputLabel>
                                  <Select
                                    value={step.contactMethod}
                                    onChange={(e) => updateEscalationStep(member.id, step.id, 'contactMethod', e.target.value)}
                                    label="Contact Method"
                                  >
                                    {/* Only show contact methods that have been added for this member */}
                                    {(() => {
                                      const menuItems = [];
                                      const addedMethods = Array.isArray(member._methodsAdded) ? member._methodsAdded : [];

                                      // Helper to get non-empty values from a contact array
                                      const getFilledValues = (arr) => (arr || []).filter(v => (v || '').trim());

                                      // Cell Phones
                                      const cellPhones = getFilledValues(member.cellPhone);
                                      if (cellPhones.length > 0 || addedMethods.includes('cellPhone')) {
                                        if (cellPhones.length > 1) {
                                          cellPhones.forEach((_, idx) => {
                                            menuItems.push(<MenuItem key={`cell-${idx}`} value={`cell-${idx}`}>Cell Phone {idx + 1}</MenuItem>);
                                            menuItems.push(<MenuItem key={`text-${idx}`} value={`text-${idx}`}>Text Cell {idx + 1}</MenuItem>);
                                          });
                                        } else {
                                          menuItems.push(<MenuItem key="cell" value="cell">Cell Phone</MenuItem>);
                                          if (cellPhones.length === 1) {
                                            menuItems.push(<MenuItem key="text" value="text">Text Cell</MenuItem>);
                                          }
                                        }
                                      }

                                      // Home Phone
                                      const homePhones = getFilledValues(member.homePhone);
                                      if (homePhones.length > 0 || addedMethods.includes('homePhone')) {
                                        if (homePhones.length > 1) {
                                          homePhones.forEach((_, idx) => {
                                            menuItems.push(<MenuItem key={`home-${idx}`} value={`home-${idx}`}>Home Phone {idx + 1}</MenuItem>);
                                          });
                                        } else {
                                          menuItems.push(<MenuItem key="home" value="home">Home Phone</MenuItem>);
                                        }
                                      }

                                      // Pager
                                      const pagers = getFilledValues(member.pager);
                                      if (pagers.length > 0 || addedMethods.includes('pager')) {
                                        if (pagers.length > 1) {
                                          pagers.forEach((_, idx) => {
                                            menuItems.push(<MenuItem key={`pager-${idx}`} value={`pager-${idx}`}>Pager {idx + 1}</MenuItem>);
                                          });
                                        } else {
                                          menuItems.push(<MenuItem key="pager" value="pager">Pager</MenuItem>);
                                        }
                                      }

                                      // MSM
                                      const msms = getFilledValues(member.msm);
                                      if (msms.length > 0 || addedMethods.includes('msm')) {
                                        if (msms.length > 1) {
                                          msms.forEach((_, idx) => {
                                            menuItems.push(<MenuItem key={`msm-${idx}`} value={`msm-${idx}`}>MSM {idx + 1}</MenuItem>);
                                          });
                                        } else {
                                          menuItems.push(<MenuItem key="msm" value="msm">MSM</MenuItem>);
                                        }
                                      }

                                      // Email
                                      const emails = getFilledValues(member.email);
                                      if (emails.length > 0 || addedMethods.includes('email')) {
                                        if (emails.length > 1) {
                                          emails.forEach((_, idx) => {
                                            menuItems.push(<MenuItem key={`email-${idx}`} value={`email-${idx}`}>Email {idx + 1}</MenuItem>);
                                          });
                                        } else {
                                          menuItems.push(<MenuItem key="email" value="email">Email</MenuItem>);
                                        }
                                      }

                                      return menuItems;
                                    })()}
                                  </Select>
                                </FormControl>

                                <FormControl size="small" sx={{ minWidth: 130, flex: '0 1 130px' }}>
                                  <InputLabel>Attempts</InputLabel>
                                  <Select
                                    value={step.attempts}
                                    onChange={(e) => updateEscalationStep(member.id, step.id, 'attempts', e.target.value)}
                                    label="Attempts"
                                  >
                                    <MenuItem value="1">1 Attempt</MenuItem>
                                    <MenuItem value="2">2 Attempts</MenuItem>
                                    <MenuItem value="3">3 Attempts</MenuItem>
                                    <MenuItem value="5">5 Attempts</MenuItem>
                                    <MenuItem value="continuous">Continuous</MenuItem>
                                  </Select>
                                </FormControl>

                                <FormControl size="small" sx={{ minWidth: 120, flex: '0 1 120px' }}>
                                  <InputLabel>Interval</InputLabel>
                                  <Select
                                    value={step.interval}
                                    onChange={(e) => updateEscalationStep(member.id, step.id, 'interval', e.target.value)}
                                    label="Interval"
                                  >
                                    <MenuItem value="immediate">Immediate</MenuItem>
                                    <MenuItem value="2min">2 Minutes</MenuItem>
                                    <MenuItem value="5min">5 Minutes</MenuItem>
                                    <MenuItem value="10min">10 Minutes</MenuItem>
                                    <MenuItem value="15min">15 Minutes</MenuItem>
                                    <MenuItem value="30min">30 Minutes</MenuItem>
                                  </Select>
                                </FormControl>

                                {member.escalationSteps.length > 1 && (
                                  <Tooltip title="Remove step">
                                    <IconButton
                                      onClick={() => removeEscalationStep(member.id, step.id)}
                                      size="small"
                                      sx={{
                                        color: theme.palette.error.main,
                                        opacity: 0.7,
                                        '&:hover': { opacity: 1, bgcolor: alpha(theme.palette.error.main, 0.08) }
                                      }}
                                    >
                                      <RemoveIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>

                      {/* Footer actions */}
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          startIcon={<AddIcon />}
                          onClick={() => addEscalationStep(member.id)}
                          size="small"
                          variant="contained"
                          sx={{
                            bgcolor: theme.palette.warning.main,
                            color: theme.palette.warning.contrastText,
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': { bgcolor: theme.palette.warning.dark }
                          }}
                        >
                          Add Step
                        </Button>
                        <Button
                          onClick={() => openConfirmApply(member.id)}
                          size="small"
                          variant="text"
                          sx={{ textTransform: 'none', fontSize: 12, color: 'text.secondary' }}
                        >
                          Apply to all members
                        </Button>
                        <Button
                          onClick={() => clearSavedDefaults()}
                          size="small"
                          variant="text"
                          sx={{ textTransform: 'none', fontSize: 12, color: 'text.disabled' }}
                        >
                          Clear defaults
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Box>
        );
      })}
      {/* Add Team Member button */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addTeamMember}
          sx={{
            px: 6,
            py: 1.5,
            fontSize: '1rem',
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: alpha(theme.palette.success.main, 0.5),
            color: theme.palette.success.main,
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: theme.palette.success.main,
              bgcolor: alpha(theme.palette.success.main, 0.04),
            }
          }}
        >
          Add Team Member
        </Button>
      </Box>
      </Box>

      <Dialog open={confirmApplyOpen} onClose={closeConfirmApply} maxWidth="sm" fullWidth>
        <DialogTitle>Apply defaults to all contacts?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">This will copy the selected member's escalation steps and contact methods to all existing team members and save them as defaults for future members. This will overwrite existing escalation steps for team members.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmApply}>Cancel</Button>
          <Button onClick={() => { applyDefaultsToAll(confirmApplyMemberId); closeConfirmApply(); }} variant="contained" color="primary">Apply</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

EnhancedOnCallTeamSection.propTypes = {
  onCall: PropTypes.shape({
    team: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        title: PropTypes.string,
        email: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        cellPhone: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        homePhone: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        otherPhone: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        contactMethods: PropTypes.arrayOf(PropTypes.string),
        notificationPreferences: PropTypes.shape({
          email: PropTypes.bool,
          sms: PropTypes.bool,
          call: PropTypes.bool,
        }),
        escalationSteps: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string,
            method: PropTypes.string,
            value: PropTypes.string,
            wait: PropTypes.string,
          })
        ),
      })
    ),
  }).isRequired,
  setOnCall: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.any),
};

export default EnhancedOnCallTeamSection;
