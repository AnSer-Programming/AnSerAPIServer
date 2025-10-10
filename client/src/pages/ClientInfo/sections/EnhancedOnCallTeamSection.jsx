import React, { useState, useEffect, useMemo } from 'react';
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
  IconButton,
  Alert,
  Collapse,
} from '@mui/material';
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
  email: [''],
  cellPhone: [''],
  homePhone: [''],
  textCell: [''],
  pager: [''],
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
    email: ensureArray(member?.email ?? member?.emails),
    cellPhone: ensureArray(member?.cellPhone ?? member?.cell),
    homePhone: ensureArray(member?.homePhone ?? member?.home),
  textCell: ensureArray(member?.textCell ?? member?.text),
    pager: ensureArray(member?.pager ?? member?.other),
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
  
  // State for managing expanded team members - expand first member by default
  const [expandedMembers, setExpandedMembers] = useState(() => (
    normalizedInitialTeam.length > 0 ? new Set([normalizedInitialTeam[0].id]) : new Set()
  ));

  useEffect(() => {
    setTeamMembers(normalizedInitialTeam);
    setExpandedMembers((prev) => {
      if (normalizedInitialTeam.length === 0) {
        return new Set();
      }

      if (prev.size > 0) {
        return prev;
      }

      return new Set([normalizedInitialTeam[0].id]);
    });
  }, [normalizedInitialTeam]);
  
  // Refs for scrolling
  const teamMembersRefs = React.useRef({});

  const inputBg = darkMode ? alpha('#fff', 0.06) : theme.palette.common.white;

  const addTeamMember = () => {
    const newMember = createDefaultTeamMember();
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
    const updatedTeam = teamMembers.map(member => {
      if (member.id === memberId) {
        const currentArray = member[contactType] || [];
        return {
          ...member,
          [contactType]: [...currentArray, '']
        };
      }
      return member;
    });
    const normalizedTeam = normalizeTeam(updatedTeam);
    setTeamMembers(normalizedTeam);
    setOnCall({ team: normalizedTeam });
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

  // Render contact method fields with Add/Remove functionality
  const renderContactMethodField = (member, contactType, label, icon, errorMessage) => {
    const contacts = member[contactType] || [''];
    const showError = Boolean(errorMessage);
    
    return (
      <Box sx={{ mb: 2 }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: showError ? theme.palette.error.main : 'inherit'
          }}
        >
          {icon}
          {label}
        </Typography>
        {contacts.map((contact, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TextField
              label={`${label} ${contacts.length > 1 ? index + 1 : ''}`}
              value={contact}
              onChange={(e) => updateContactMethod(member.id, contactType, index, e.target.value)}
              size="small"
              sx={{ flex: 1, bgcolor: inputBg }}
              error={showError && index === 0}
              helperText={showError && index === 0 ? errorMessage : ''}
            />
            {contacts.length > 1 && (
              <IconButton
                onClick={() => removeContactMethod(member.id, contactType, index)}
                color="error"
                size="small"
              >
                <RemoveIcon />
              </IconButton>
            )}
          </Box>
        ))}
        <Button
          startIcon={<AddIcon />}
          onClick={() => addContactMethod(member.id, contactType)}
          size="small"
          variant="outlined"
          sx={{ mt: 1 }}
        >
          Add {label}
        </Button>
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

  const teamErrors = Array.isArray(errors) ? errors : [];

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
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
            On-Call Team Members & Escalation
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Add team members and configure escalation procedures for each contact method
          </Typography>
        </Box>
      </Stack>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={addTeamMember}
        sx={{ 
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.success.main}, ${alpha(theme.palette.success.main, 0.8)})`,
          '&:hover': {
            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.9)}, ${alpha(theme.palette.success.main, 0.7)})`,
          }
        }}
      >
        Add Team Member
      </Button>

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
              <Box sx={{ p: 2, pt: 1, bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
                <Grid container spacing={3}>
                  {/* Basic Information */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person fontSize="small" />
                      Basic Information
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        label="Full Name"
                        value={member.name}
                        onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                        fullWidth
                        size="small"
                        sx={{ mb: 2, bgcolor: inputBg }}
                        error={Boolean(memberErrors?.name)}
                        helperText={memberErrors?.name || ''}
                      />
                      <TextField
                        label="Title/Position"
                        value={member.title}
                        onChange={(e) => updateTeamMember(member.id, 'title', e.target.value)}
                        fullWidth
                        size="small"
                        sx={{ bgcolor: inputBg }}
                      />
                    </Box>
                  </Grid>

                  {/* Contact Methods */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone fontSize="small" />
                      Contact Methods
                    </Typography>

                    {memberErrors?.contactRequired && (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        {memberErrors.contactRequired}
                      </Alert>
                    )}
                    
                    {renderContactMethodField(member, 'cellPhone', 'Cell Phone', <Phone fontSize="small" />, resolveContactError(memberErrors, 'cellPhone'))}
                    {renderContactMethodField(member, 'homePhone', 'Home Phone', <Home fontSize="small" />, resolveContactError(memberErrors, 'homePhone'))}
                    {renderContactMethodField(member, 'email', 'Email', <Email fontSize="small" />, resolveContactError(memberErrors, 'email'))}
                    {renderContactMethodField(member, 'textCell', 'Text Cell', <Message fontSize="small" />, resolveContactError(memberErrors, 'textCell'))}
                    {renderContactMethodField(member, 'pager', 'Send Page', <Notifications fontSize="small" />, resolveContactError(memberErrors, 'pager'))}
                  </Grid>

                  {/* Escalation Procedures */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Notifications fontSize="small" />
                      Escalation Procedures
                    </Typography>
                    
                    {member.escalationSteps?.map((step, stepIndex) => (
                      <Box 
                        key={step.id} 
                        sx={{ 
                          mb: 2, 
                          p: 2,
                          bgcolor: alpha(theme.palette.success.main, 0.05),
                          borderRadius: 1,
                          border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Escalation Step {stepIndex + 1}
                          </Typography>
                          {member.escalationSteps.length > 1 && (
                            <IconButton
                              onClick={() => removeEscalationStep(member.id, step.id)}
                              color="error"
                              size="small"
                            >
                              <RemoveIcon />
                            </IconButton>
                          )}
                        </Box>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Contact Method</InputLabel>
                              <Select
                                value={step.contactMethod}
                                onChange={(e) => updateEscalationStep(member.id, step.id, 'contactMethod', e.target.value)}
                                label="Contact Method"
                                sx={{ bgcolor: inputBg }}
                              >
                                <MenuItem value="cell">Cell Phone</MenuItem>
                                <MenuItem value="home">Home Phone</MenuItem>
                                <MenuItem value="email">Email</MenuItem>
                                <MenuItem value="text">Text Cell</MenuItem>
                                <MenuItem value="pager">Send Page</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Attempts</InputLabel>
                              <Select
                                value={step.attempts}
                                onChange={(e) => updateEscalationStep(member.id, step.id, 'attempts', e.target.value)}
                                label="Attempts"
                                sx={{ bgcolor: inputBg }}
                              >
                                <MenuItem value="1">1 Attempt</MenuItem>
                                <MenuItem value="2">2 Attempts</MenuItem>
                                <MenuItem value="3">3 Attempts</MenuItem>
                                <MenuItem value="5">5 Attempts</MenuItem>
                                <MenuItem value="continuous">Continuous</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Interval</InputLabel>
                              <Select
                                value={step.interval}
                                onChange={(e) => updateEscalationStep(member.id, step.id, 'interval', e.target.value)}
                                label="Interval"
                                sx={{ bgcolor: inputBg }}
                              >
                                <MenuItem value="immediate">Immediate</MenuItem>
                                <MenuItem value="2min">2 Minutes</MenuItem>
                                <MenuItem value="5min">5 Minutes</MenuItem>
                                <MenuItem value="10min">10 Minutes</MenuItem>
                                <MenuItem value="15min">15 Minutes</MenuItem>
                                <MenuItem value="30min">30 Minutes</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Box>
                    ))}

                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => addEscalationStep(member.id)}
                      size="small"
                      variant="outlined"
                      color="success"
                    >
                      Add Escalation Step
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Box>
        );
      })}
    </Box>
  );
};

export default EnhancedOnCallTeamSection;
