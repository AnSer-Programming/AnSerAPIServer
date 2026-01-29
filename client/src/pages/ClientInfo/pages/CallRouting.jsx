// src/pages/ClientInfo/pages/CallRouting.jsx

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Container,
  Button,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  TextField,
  Stack,
  Grid,
  Chip,
  Alert,
  Divider,
  Fade,
  Snackbar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  NavigateNextRounded,
  NavigateBeforeRounded,
  AccountCircle,
  Phone,
  Assessment,
  Add as AddIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
  ArrowDownward,
  Visibility as VisibilityIcon,
  ContentCopy as ContentCopyIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';
import { createSharedStyles } from '../utils/sharedStyles';
import { WIZARD_ROUTES } from '../constants/routes';
import { isValidPhone, getPhoneError } from '../utils/phonePostalValidation';
import { isValidEmail, getEmailError } from '../utils/emailValidation';

const escapeHtml = (value) => {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const normalizeEmailList = (value) => {
  if (Array.isArray(value)) {
    return value.length ? value : [''];
  }
  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }
  return [''];
};

const CallRouting = () => {
  const theme = useTheme();
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const sharedStyles = createSharedStyles(theme, darkMode);
  const { formData, updateSection, markStepVisited } = useWizard();

  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [errors, setErrors] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [prerequisiteDialogOpen, setPrerequisiteDialogOpen] = useState(false);
  const [confirmationErrors, setConfirmationErrors] = useState({}); // { [categoryId]: { phone?: string, email?: { [index]: string } } }

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Call Routing — AnSer Communications';
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      created = true;
    }
    meta.content = 'Assign team members to handle specific call categories';
    if (created) document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      if (created && meta && meta.parentNode) meta.parentNode.removeChild(meta);
    };
  }, []);

  // Check prerequisites: OnCall must have team members before accessing Call Routing
  useEffect(() => {
    const onCallData = formData.onCall || {};
    const hasTeamMembers = Array.isArray(onCallData.team) && onCallData.team.length > 0;

    if (!hasTeamMembers) {
      setPrerequisiteDialogOpen(true);
    }
  }, [formData.onCall]);

  // Get call categories from answerCalls section
  const answerCalls = formData.answerCalls || {};
  const categories = answerCalls.categories || [];

  // Get team members from onCall section
  const onCall = formData.onCall || {};
  const teamMembers = Array.isArray(onCall.team) ? onCall.team : [];
  const departments = Array.isArray(onCall.departments) ? onCall.departments : [];

  const contactEmailOptions = useMemo(() => {
    const options = new Map();
    const addOption = (email, label) => {
      if (!email || typeof email !== 'string') return;
      const trimmed = email.trim();
      if (!trimmed) return;
      if (!options.has(trimmed)) {
        options.set(trimmed, label || trimmed);
      }
    };

    const companyInfo = formData.companyInfo || {};
    if (companyInfo.primaryContact?.email) {
      const name = companyInfo.primaryContact?.name;
      addOption(companyInfo.primaryContact.email, name ? `${name} - ${companyInfo.primaryContact.email}` : companyInfo.primaryContact.email);
    }
    if (companyInfo.billingContact?.email) {
      const name = companyInfo.billingContact?.name;
      addOption(companyInfo.billingContact.email, name ? `${name} - ${companyInfo.billingContact.email}` : companyInfo.billingContact.email);
    }
    if (companyInfo.contactNumbers?.officeEmail) {
      addOption(companyInfo.contactNumbers.officeEmail, `Office - ${companyInfo.contactNumbers.officeEmail}`);
    }
    if (Array.isArray(companyInfo.contactChannels)) {
      companyInfo.contactChannels.forEach((channel) => {
        if (!channel) return;
        const type = channel.type || '';
        if (type === 'group-email' || type === 'email') {
          addOption(channel.value, `Group Email - ${channel.value}`);
        }
      });
    }

    teamMembers.forEach((member) => {
      const emails = Array.isArray(member.email) ? member.email : (member.email ? [member.email] : []);
      emails.forEach((email) => {
        const label = member.name ? `${member.name} - ${email}` : email;
        addOption(email, label);
      });
    });

    return Array.from(options.entries()).map(([value, label]) => ({ value, label }));
  }, [formData.companyInfo, teamMembers]);

  const [emailMenuAnchor, setEmailMenuAnchor] = useState({});

  const openEmailMenu = (key, event) => {
    setEmailMenuAnchor((prev) => ({ ...prev, [key]: event.currentTarget }));
  };

  const closeEmailMenu = (key) => {
    setEmailMenuAnchor((prev) => ({ ...prev, [key]: null }));
  };

  // Get current routing assignments
  const callRouting = formData.callRouting || { categoryAssignments: [] };
  const assignments = callRouting.categoryAssignments || [];

  // Initialize assignments if empty
  useEffect(() => {
    if (categories.length > 0 && assignments.length === 0) {
      const initialAssignments = categories.map(cat => ({
        categoryId: cat.id,
        categoryName: cat.customName || cat.selectedCommon || 'Unnamed Category',
        whenToContact: 'all-hours',
        specialInstructions: '',
        finalAction: 'repeat-until-delivered',
        afterHoursFinalAction: 'repeat-until-delivered',
        escalationSteps: [
          {
            id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            contactPerson: '',
            contactMethod: 'call',
            notes: '',
            repeatSteps: false,
            holdForCheckIn: false,
          }
        ],
      }));
      updateSection('callRouting', { categoryAssignments: initialAssignments });
    }
  }, [categories.length, assignments.length]);

  // Ensure any new category accordions start collapsed
  useEffect(() => {
    setExpandedCategories((prev) => {
      const next = { ...prev };
      let changed = false;
      assignments.forEach((assignment) => {
        if (next[assignment.categoryId] === undefined) {
          next[assignment.categoryId] = false;
          changed = true;
        }
      });
      Object.keys(next).forEach((id) => {
        if (!assignments.some((assignment) => assignment.categoryId === id)) {
          delete next[id];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [assignments]);

  const handleAccordionChange = (categoryId) => (event, isExpanded) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: isExpanded
    }));
  };

  const handleAssignmentChange = (categoryId, field, value) => {
    const updatedAssignments = assignments.map(assignment => {
      if (assignment.categoryId === categoryId) {
        return { ...assignment, [field]: value };
      }
      return assignment;
    });
    updateSection('callRouting', { categoryAssignments: updatedAssignments });
  };

  const handleStepChange = (categoryId, stepId, field, value) => {
    const updatedAssignments = assignments.map(assignment => {
      if (assignment.categoryId === categoryId) {
        const updatedSteps = assignment.escalationSteps.map(step => {
          if (step.id === stepId) {
            return { ...step, [field]: value };
          }
          return step;
        });
        return { ...assignment, escalationSteps: updatedSteps };
      }
      return assignment;
    });
    updateSection('callRouting', { categoryAssignments: updatedAssignments });
  };

  const addEscalationStep = (categoryId) => {
    const updatedAssignments = assignments.map(assignment => {
      if (assignment.categoryId === categoryId) {
        const newStep = {
          id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          contactPerson: '',
          contactMethod: 'call',
          notes: '',
          repeatSteps: false,
          holdForCheckIn: false,
        };
        return {
          ...assignment,
          escalationSteps: [...assignment.escalationSteps, newStep],
        };
      }
      return assignment;
    });
    updateSection('callRouting', { categoryAssignments: updatedAssignments });
  };

  const removeEscalationStep = (categoryId, stepId) => {
    const updatedAssignments = assignments.map(assignment => {
      if (assignment.categoryId === categoryId) {
        const updatedSteps = assignment.escalationSteps.filter(step => step.id !== stepId);
        // Ensure at least one step remains
        if (updatedSteps.length === 0) {
          return assignment;
        }
        return { ...assignment, escalationSteps: updatedSteps };
      }
      return assignment;
    });
    updateSection('callRouting', { categoryAssignments: updatedAssignments });
  };

  // After Hours step handlers
  const handleAfterHoursStepChange = (categoryId, stepId, field, value) => {
    const updatedAssignments = assignments.map(assignment => {
      if (assignment.categoryId === categoryId) {
        const updatedSteps = (assignment.afterHoursSteps || []).map(step => {
          if (step.id === stepId) {
            return { ...step, [field]: value };
          }
          return step;
        });
        return { ...assignment, afterHoursSteps: updatedSteps };
      }
      return assignment;
    });
    updateSection('callRouting', { categoryAssignments: updatedAssignments });
  };

  const addAfterHoursStep = (categoryId) => {
    const updatedAssignments = assignments.map(assignment => {
      if (assignment.categoryId === categoryId) {
        const newStep = {
          id: `step-ah-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          contactPerson: '',
          contactMethod: 'call',
          notes: '',
        };
        return {
          ...assignment,
          afterHoursSteps: [...(assignment.afterHoursSteps || []), newStep],
        };
      }
      return assignment;
    });
    updateSection('callRouting', { categoryAssignments: updatedAssignments });
  };

  const removeAfterHoursStep = (categoryId, stepId) => {
    const updatedAssignments = assignments.map(assignment => {
      if (assignment.categoryId === categoryId) {
        const updatedSteps = (assignment.afterHoursSteps || []).filter(step => step.id !== stepId);
        if (updatedSteps.length === 0) {
          return assignment;
        }
        return { ...assignment, afterHoursSteps: updatedSteps };
      }
      return assignment;
    });
    updateSection('callRouting', { categoryAssignments: updatedAssignments });
  };

  // Initialize after hours steps when "different" is selected
  const initializeAfterHoursSteps = (categoryId, newWhenToContact) => {
    const updatedAssignments = assignments.map(assignment => {
      if (assignment.categoryId === categoryId) {
        const updates = { whenToContact: newWhenToContact };
        // Only add afterHoursSteps if they don't exist yet
        if (!assignment.afterHoursSteps || assignment.afterHoursSteps.length === 0) {
          updates.afterHoursSteps = [{
            id: `step-ah-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            contactPerson: '',
            contactMethod: 'call',
            notes: '',
          }];
        }
        return { ...assignment, ...updates };
      }
      return assignment;
    });
    updateSection('callRouting', { categoryAssignments: updatedAssignments });
  };

  const onNext = () => {
    markStepVisited('call-routing');
    
    // Validate that at least first step has contact assigned (unless it's "Consider Delivered")
    const missingContacts = assignments.filter(a => 
      !a.escalationSteps || 
      a.escalationSteps.length === 0 || 
      (!a.escalationSteps[0].contactPerson && a.escalationSteps[0].contactMethod !== 'delivered')
    );
    
    if (missingContacts.length > 0) {
      setSnack({ 
        open: true, 
        msg: `${missingContacts.length} categor${missingContacts.length === 1 ? 'y needs' : 'ies need'} at least one contact`, 
        severity: 'warning' 
      });
    } else {
      setSnack({ 
        open: true, 
        msg: 'Call routing configured successfully!', 
        severity: 'success' 
      });
    }

    // Proceed to next step
    history.push(WIZARD_ROUTES.OFFICE_REACH);
  };

  const generateDispatchInstructions = () => {
    let html = '<div style="font-family: Arial, sans-serif;">';
    
    assignments.forEach((assignment, catIndex) => {
      if (assignment.escalationSteps && assignment.escalationSteps.length > 0) {
        const safeCategoryName = escapeHtml(assignment.categoryName);
        const safeSpecialInstructions = escapeHtml(assignment.specialInstructions);

        html += `<div style="margin-bottom: 25px; padding: 15px; background: white; border: 1px solid #ddd; border-radius: 4px;">`;
        
        // Category Header
        html += `<h3 style="color: #1565c0; margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">${safeCategoryName}</h3>`;
        
        // Special Instructions at top if exists
        if (assignment.specialInstructions) {
          html += `<p style="margin: 5px 0 15px 0; color: #d32f2f; font-weight: bold;">* ${safeSpecialInstructions}</p>`;
        }
        
        // Escalation steps
        assignment.escalationSteps.forEach((step, stepIndex) => {
          const stepNum = stepIndex + 1;
          let contactName = '';
          
          if (step.contactPerson === 'office') {
            contactName = 'Office';
          } else if (step.contactPerson) {
            const member = teamMembers.find(m => m.id === step.contactPerson);
            contactName = member ? member.name : '';
          }
          
          // Build step line
          const safeContactName = escapeHtml(contactName);

          if (contactName) {
            html += `<p style="margin: 3px 0; font-size: 14px;"><strong>${stepNum})</strong> `;
            
            // Contact method and name
            const methodText = step.contactMethod === 'text' ? 'Text' : 
                              step.contactMethod === 'call' ? 'Call' :
                              step.contactMethod === 'email' ? 'Email' :
                              step.contactMethod === 'delivered' ? 'Consider Delivered' : 'Contact';
            
            if (step.contactMethod !== 'delivered') {
              html += `${methodText} ${safeContactName}`;
            } else {
              html += 'Consider Delivered';
            }
            
            html += `</p>`;
            
          } else if (step.contactMethod === 'delivered') {
            html += `<p style="margin: 3px 0; font-size: 14px;"><strong>${stepNum})</strong> Consider Delivered</p>`;
          }
          
          // Notes if any
          if (step.notes) {
            const safeNotes = escapeHtml(step.notes);
            html += `<p style="margin: 3px 0 3px 15px; font-size: 12px; color: #555; font-style: italic;">${safeNotes}</p>`;
          }
        });
        
        // Repeat instructions after all steps
        const lastStepWithRepeat = assignment.escalationSteps.find(s => s.repeatSteps);
        if (lastStepWithRepeat) {
          const lastStepIndex = assignment.escalationSteps.indexOf(lastStepWithRepeat);
          if (lastStepIndex >= 0) {
            const stepNum = lastStepIndex + 1;
            let stepsToRepeat = '';
            if (stepNum === 1) {
              stepsToRepeat = 'step 1';
            } else {
              const stepNumbers = [];
              for (let i = 1; i <= stepNum; i++) {
                stepNumbers.push(i);
              }
              stepsToRepeat = `steps ${stepNumbers.join(' & ')}`;
            }
            html += `<p style="margin: 10px 0 3px 0; font-size: 14px;"><strong>${stepNum + 1})</strong> Repeat ${stepsToRepeat}</p>`;
          }
        }
        
        html += `</div>`;
      }
    });
    
    html += '</div>';
    return html;
  };

  const handlePreview = () => {
    const instructions = generateDispatchInstructions();
    setPreviewHtml(instructions);
    setPreviewOpen(true);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(previewHtml.replace(/<[^>]*>/g, '')).then(() => {
      setSnack({ open: true, msg: 'Copied to clipboard!', severity: 'success' });
    });
  };

  // Render escalation steps section - reusable for both office hours and after hours
  const renderEscalationSection = (assignment, isAfterHours = false) => {
    const steps = isAfterHours ? (assignment.afterHoursSteps || []) : (assignment.escalationSteps || []);
    const handleStepChangeForMode = isAfterHours ? handleAfterHoursStepChange : handleStepChange;
    const addStepForMode = isAfterHours ? addAfterHoursStep : addEscalationStep;
    const removeStepForMode = isAfterHours ? removeAfterHoursStep : removeEscalationStep;
    const prefix = isAfterHours ? 'afterHours' : '';
    const sectionColor = isAfterHours ? 'secondary' : 'primary';
    const finalActionField = isAfterHours ? 'afterHoursFinalAction' : 'finalAction';
    const repeatCountField = isAfterHours ? 'afterHoursRepeatCount' : 'repeatCount';
    const repeatFinalActionField = isAfterHours ? 'afterHoursRepeatFinalAction' : 'repeatFinalAction';
    const escalateToField = isAfterHours ? 'afterHoursEscalateTo' : 'escalateTo';
    const escalationNotesField = isAfterHours ? 'afterHoursEscalationNotes' : 'escalationNotes';
    const confirmationField = isAfterHours ? 'afterHoursSendConfirmation' : 'sendConfirmationAfterDelivery';
    const confirmTextField = isAfterHours ? 'afterHoursConfirmationViaText' : 'confirmationViaText';
    const confirmEmailField = isAfterHours ? 'afterHoursConfirmationViaEmail' : 'confirmationViaEmail';
    const confirmPhoneField = isAfterHours ? 'afterHoursConfirmationPhone' : 'confirmationPhone';
    const confirmEmailValueField = isAfterHours ? 'afterHoursConfirmationEmail' : 'confirmationEmail';
    const errorKey = isAfterHours ? `${assignment.categoryId}-ah` : assignment.categoryId;
    const emailValues = normalizeEmailList(assignment[confirmEmailValueField]);
    const emailErrorMap = confirmationErrors[errorKey]?.email;
    const emailErrors = emailErrorMap && typeof emailErrorMap === 'object' ? emailErrorMap : {};
    const selectedEmailSet = new Set(
      emailValues.map((email) => email.trim().toLowerCase()).filter(Boolean)
    );
    const availableEmailOptions = contactEmailOptions.filter(
      (option) => !selectedEmailSet.has(option.value.toLowerCase())
    );

    const setEmailErrorForIndex = (index, message) => {
      setConfirmationErrors((prev) => {
        const current = prev[errorKey] || {};
        const nextEmailErrors = current.email && typeof current.email === 'object' ? { ...current.email } : {};

        if (message) {
          nextEmailErrors[index] = message;
        } else {
          delete nextEmailErrors[index];
        }

        const nextEntry = { ...current };
        if (Object.keys(nextEmailErrors).length) {
          nextEntry.email = nextEmailErrors;
        } else {
          delete nextEntry.email;
        }

        if (!nextEntry.phone && !nextEntry.email) {
          const { [errorKey]: _removed, ...rest } = prev;
          return rest;
        }

        return { ...prev, [errorKey]: nextEntry };
      });
    };

    const clearEmailErrorsForKey = () => {
      setConfirmationErrors((prev) => {
        const current = prev[errorKey];
        if (!current || !current.email) return prev;
        const nextEntry = { ...current };
        delete nextEntry.email;
        if (!nextEntry.phone) {
          const { [errorKey]: _removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [errorKey]: nextEntry };
      });
    };

    return (
      <>
        <Stack spacing={2}>
          {steps.map((step, stepIndex) => (
            <Box key={step.id}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette[sectionColor].main, 0.05),
                  border: `1px solid ${alpha(theme.palette[sectionColor].main, 0.2)}`,
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Step {stepIndex + 1}
                  </Typography>
                  {steps.length > 1 && (
                    <Tooltip title="Remove this step">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeStepForMode(assignment.categoryId, step.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Contact Person / Team *</InputLabel>
                      <Select
                        value={step.contactPerson || ''}
                        onChange={(e) => handleStepChangeForMode(assignment.categoryId, step.id, 'contactPerson', e.target.value)}
                        label="Contact Person / Team *"
                        error={stepIndex === 0 && !step.contactPerson}
                      >
                        <MenuItem value="">
                          <em>-- Select team or member --</em>
                        </MenuItem>
                        <MenuItem value="office">
                          <strong>Office / General Contact</strong>
                        </MenuItem>

                        {/* Teams/Departments Section */}
                        {departments.length > 0 && [
                          <MenuItem key={`${prefix}teams-header`} disabled sx={{ opacity: 1 }}>
                            <em style={{ fontWeight: 600 }}>— Teams —</em>
                          </MenuItem>,
                          ...departments.map((dept) => (
                            <MenuItem key={`${prefix}dept-${dept.id}`} value={`team-${dept.id}`}>
                              🏢 {dept.department}
                            </MenuItem>
                          ))
                        ]}

                        {/* Individual Team Members Section */}
                        {teamMembers.length > 0 && [
                          <MenuItem key={`${prefix}members-header`} disabled sx={{ opacity: 1 }}>
                            <em style={{ fontWeight: 600 }}>— Individual Members —</em>
                          </MenuItem>,
                          ...teamMembers.map((member) => (
                            <MenuItem key={`${prefix}member-${member.id}`} value={member.id}>
                              {member.name} {member.role && `(${member.role})`}
                            </MenuItem>
                          ))
                        ]}
                      </Select>
                    </FormControl>
                    
                    {/* Show selected contact's information */}
                    {step.contactPerson && step.contactPerson !== 'office' && (() => {
                      if (typeof step.contactPerson === 'string' && step.contactPerson.startsWith('team-')) {
                        const teamId = step.contactPerson.replace('team-', '');
                        const selectedTeam = departments.find(d => d.id === teamId);
                        if (selectedTeam) {
                          return (
                            <Alert severity="info" sx={{ mt: 1 }}>
                              <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                                🏢 Team: {selectedTeam.department}
                              </Typography>
                              <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                {selectedTeam.members && selectedTeam.members.length > 0
                                  ? `${selectedTeam.members.length} member${selectedTeam.members.length !== 1 ? 's' : ''}`
                                  : 'No members assigned'}
                              </Typography>
                            </Alert>
                          );
                        }
                      }

                      const selectedMember = teamMembers.find(m => m.id === step.contactPerson);
                      if (selectedMember && selectedMember.escalationSteps && selectedMember.escalationSteps.length > 0) {
                        return (
                          <Alert severity="info" sx={{ mt: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                              {selectedMember.name}'s Contact Methods:
                            </Typography>
                            {selectedMember.escalationSteps.map((escStep, idx) => (
                              <Typography key={idx} variant="caption" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                {idx + 1}. {escStep.contactMethod ? escStep.contactMethod.toUpperCase() : 'Method not set'}
                                {escStep.attempts && ` (${escStep.attempts} attempts)`}
                                {escStep.interval && ` - Wait ${escStep.interval} min`}
                              </Typography>
                            ))}
                          </Alert>
                        );
                      }
                      return null;
                    })()}
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Notes for this step"
                      value={step.notes || ''}
                      onChange={(e) => handleStepChangeForMode(assignment.categoryId, step.id, 'notes', e.target.value)}
                      placeholder="e.g., Wait 5 minutes before moving to next step"
                      multiline
                      rows={2}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Arrow between steps */}
              {stepIndex < steps.length - 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
                  <ArrowDownward color="action" />
                </Box>
              )}
            </Box>
          ))}
        </Stack>

        {/* Add Step Button */}
        <Button
          startIcon={<AddIcon />}
          onClick={() => addStepForMode(assignment.categoryId)}
          variant="outlined"
          size="small"
          color={sectionColor}
          sx={{ mt: 2 }}
          fullWidth
        >
          Add Another Step
        </Button>

        {/* When All Steps Are Exhausted */}
        <Box sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.warning.main, 0.08), borderRadius: 2, border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}` }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: theme.palette.warning.dark }}>
            When all steps are exhausted, what should we do?
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Final Action</InputLabel>
                <Select
                  value={assignment[finalActionField] || 'repeat-until-delivered'}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    handleAssignmentChange(assignment.categoryId, finalActionField, nextValue);
                    if (nextValue === 'repeat-times' && !assignment[repeatFinalActionField]) {
                      handleAssignmentChange(assignment.categoryId, repeatFinalActionField, 'hold');
                    }
                  }}
                  label="Final Action"
                >
                  <MenuItem value="repeat-until-delivered">Repeat Steps Until Delivered</MenuItem>
                  <MenuItem value="repeat-times">Repeat Steps X Times</MenuItem>
                  <MenuItem value="repeat-then-escalate">Repeat Steps Then Escalate</MenuItem>
                  <MenuItem value="hold-checkin">Hold for Check-In</MenuItem>
                  <MenuItem value="hold">Hold</MenuItem>
                  <MenuItem value="delivered">Consider Delivered</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Show repeat count field if "Repeat Steps X Times" is selected */}
            {assignment[finalActionField] === 'repeat-times' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Number of Times to Repeat"
                    value={assignment[repeatCountField] || 2}
                    onChange={(e) => handleAssignmentChange(assignment.categoryId, repeatCountField, parseInt(e.target.value) || 1)}
                    inputProps={{ min: 1, max: 10 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>After Repeats</InputLabel>
                    <Select
                      value={assignment[repeatFinalActionField] || 'hold'}
                      onChange={(e) => handleAssignmentChange(assignment.categoryId, repeatFinalActionField, e.target.value)}
                      label="After Repeats"
                    >
                      <MenuItem value="repeat-until-delivered">Repeat Steps Until Delivered</MenuItem>
                      <MenuItem value="repeat-then-escalate">Repeat Steps Then Escalate</MenuItem>
                      <MenuItem value="hold-checkin">Hold for Check-In</MenuItem>
                      <MenuItem value="hold">Hold</MenuItem>
                      <MenuItem value="delivered">Consider Delivered</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}

            {/* Show escalation step if "Repeat Steps Then Escalate" is selected */}
            {(assignment[finalActionField] === 'repeat-then-escalate'
              || (assignment[finalActionField] === 'repeat-times'
                && assignment[repeatFinalActionField] === 'repeat-then-escalate')) && (
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: alpha(theme.palette.error.main, 0.05) }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: theme.palette.error.main }}>
                    Escalation Contact
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Escalate To</InputLabel>
                        <Select
                          value={assignment[escalateToField] || ''}
                          onChange={(e) => handleAssignmentChange(assignment.categoryId, escalateToField, e.target.value)}
                          label="Escalate To"
                        >
                          <MenuItem value="">
                            <em>-- Select escalation contact --</em>
                          </MenuItem>
                          <MenuItem value="office">
                            <strong>Office / General Contact</strong>
                          </MenuItem>
                          {teamMembers.map((member) => (
                            <MenuItem key={`${prefix}esc-${member.id}`} value={member.id}>
                              {member.name} {member.role && `(${member.role})`}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Escalation Notes"
                        value={assignment[escalationNotesField] || ''}
                        onChange={(e) => handleAssignmentChange(assignment.categoryId, escalationNotesField, e.target.value)}
                        placeholder="e.g., Urgent - all attempts failed"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Confirmation after delivery option */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={assignment[confirmationField] || false}
                    onChange={(e) => handleAssignmentChange(assignment.categoryId, confirmationField, e.target.checked)}
                    color="primary"
                  />
                }
                label="Send confirmation after delivery"
              />
              {assignment[confirmationField] && (
                <Box sx={{ mt: 1, pl: 4 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    How would you like to receive confirmation?
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={assignment[confirmTextField] || false}
                          onChange={(e) => handleAssignmentChange(assignment.categoryId, confirmTextField, e.target.checked)}
                          size="small"
                        />
                      }
                      label="Text"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={assignment[confirmEmailField] || false}
                          onChange={(e) => handleAssignmentChange(assignment.categoryId, confirmEmailField, e.target.checked)}
                          size="small"
                        />
                      }
                      label="Email"
                    />
                  </Stack>
                  <Grid container spacing={2}>
                    {assignment[confirmTextField] && (
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Phone Number for Text Confirmation"
                          value={assignment[confirmPhoneField] || ''}
                          onChange={(e) => {
                            handleAssignmentChange(assignment.categoryId, confirmPhoneField, e.target.value);
                            if (confirmationErrors[errorKey]?.phone && isValidPhone(e.target.value)) {
                              setConfirmationErrors(prev => ({
                                ...prev,
                                [errorKey]: { ...prev[errorKey], phone: '' }
                              }));
                            }
                          }}
                          onBlur={(e) => {
                            const value = e.target.value;
                            if (value && !isValidPhone(value)) {
                              setConfirmationErrors(prev => ({
                                ...prev,
                                [errorKey]: { ...prev[errorKey], phone: getPhoneError(value) }
                              }));
                            }
                          }}
                          placeholder="e.g., 206-555-1234"
                          error={!!confirmationErrors[errorKey]?.phone}
                          helperText={confirmationErrors[errorKey]?.phone}
                        />
                      </Grid>
                    )}
                    {assignment[confirmEmailField] && (
                      <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                          {emailValues.map((email, index) => {
                            const errorMsg = emailErrors[index] || '';
                            return (
                              <Box key={`${confirmEmailValueField}-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label={emailValues.length > 1 ? `Email Address ${index + 1}` : 'Email Address for Confirmation'}
                                  value={email}
                                  onChange={(e) => {
                                    const nextList = [...emailValues];
                                    nextList[index] = e.target.value;
                                    handleAssignmentChange(assignment.categoryId, confirmEmailValueField, nextList);
                                    if (errorMsg && isValidEmail(e.target.value)) {
                                      setEmailErrorForIndex(index, '');
                                    }
                                  }}
                                  onBlur={(e) => {
                                    const value = e.target.value;
                                    if (value && !isValidEmail(value)) {
                                      setEmailErrorForIndex(index, getEmailError(value));
                                    } else {
                                      setEmailErrorForIndex(index, '');
                                    }
                                  }}
                                  placeholder="e.g., office@company.com"
                                  error={Boolean(errorMsg)}
                                  helperText={errorMsg}
                                />
                                {emailValues.length > 1 && (
                                  <IconButton
                                    onClick={() => {
                                      const nextList = emailValues.filter((_, i) => i !== index);
                                      handleAssignmentChange(
                                        assignment.categoryId,
                                        confirmEmailValueField,
                                        nextList.length ? nextList : ['']
                                      );
                                      clearEmailErrorsForKey();
                                    }}
                                    color="error"
                                    size="small"
                                    sx={{ p: 0.5 }}
                                  >
                                    <RemoveIcon fontSize="small" />
                                  </IconButton>
                                )}
                              </Box>
                            );
                          })}
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Button
                              size="small"
                              variant="text"
                              startIcon={<AddIcon />}
                              onClick={() => {
                                handleAssignmentChange(
                                  assignment.categoryId,
                                  confirmEmailValueField,
                                  [...emailValues, '']
                                );
                              }}
                            >
                              Add email
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={(e) => openEmailMenu(errorKey, e)}
                              disabled={availableEmailOptions.length === 0}
                            >
                              Add from contacts
                            </Button>
                          </Stack>
                          <Menu
                            anchorEl={emailMenuAnchor[errorKey]}
                            open={Boolean(emailMenuAnchor[errorKey])}
                            onClose={() => closeEmailMenu(errorKey)}
                          >
                            {availableEmailOptions.length === 0 && (
                              <MenuItem disabled>No contact emails available</MenuItem>
                            )}
                            {availableEmailOptions.map((option) => (
                              <MenuItem
                                key={option.value}
                                onClick={() => {
                                  const hasOnlyEmpty = emailValues.length === 1 && !emailValues[0].trim();
                                  handleAssignmentChange(
                                    assignment.categoryId,
                                    confirmEmailValueField,
                                    hasOnlyEmpty ? [option.value] : [...emailValues, option.value]
                                  );
                                  closeEmailMenu(errorKey);
                                }}
                              >
                                {option.label}
                              </MenuItem>
                            ))}
                          </Menu>
                        </Stack>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </>
    );
  };

  // Show warning if no categories or team members
  if (categories.length === 0) {
    return (
      <Box sx={sharedStyles.layout.pageWrapper}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>No Call Categories Defined</Typography>
            <Typography variant="body2">
              Please go back to the "Answer Calls" step and define your call categories first.
            </Typography>
          </Alert>
          <Button
            variant="outlined"
            startIcon={<NavigateBeforeRounded />}
            onClick={() => history.push(WIZARD_ROUTES.ANSWER_CALLS)}
          >
            Back to Answer Calls
          </Button>
        </Container>
      </Box>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <Box sx={sharedStyles.layout.pageWrapper}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>No Team Members Defined</Typography>
            <Typography variant="body2">
              Please go back to the "On Call" step and add your team members first.
            </Typography>
          </Alert>
          <Button
            variant="outlined"
            startIcon={<NavigateBeforeRounded />}
            onClick={() => history.push(WIZARD_ROUTES.ON_CALL)}
          >
            Back to On Call
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={sharedStyles.layout.pageWrapper}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 6 } }}>
        {/* Header */}
        <Fade in timeout={600}>
          <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, mb: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                    color: theme.palette.primary.main,
                  }}
                >
                  <Phone fontSize="large" />
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Call Routing Configuration
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Assign team members to handle specific call categories
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={`${categories.length} Categories`} size="small" color="info" variant="outlined" />
                <Chip label={`${departments.length} Teams · ${teamMembers.length} Personnel`} size="small" color="success" variant="outlined" />
                <Chip 
                  label={`${assignments.filter(a => a.escalationSteps && a.escalationSteps.length > 0 && (a.escalationSteps[0].contactPerson || a.escalationSteps[0].contactMethod === 'delivered')).length}/${assignments.length} Assigned`} 
                  size="small" 
                  color="warning" 
                  variant="outlined" 
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityIcon />}
                  onClick={handlePreview}
                  disabled={assignments.length === 0}
                >
                  Preview
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Fade>

        {/* Category Assignments */}
        <Fade in timeout={800}>
          <Stack spacing={3}>
            {assignments.map((assignment, index) => {
              const hasContact = assignment.escalationSteps && 
                assignment.escalationSteps.length > 0 && 
                (assignment.escalationSteps[0].contactPerson || assignment.escalationSteps[0].contactMethod === 'delivered');
              
              return (
              <Accordion
                key={assignment.categoryId}
                expanded={expandedCategories[assignment.categoryId] || false}
                onChange={handleAccordionChange(assignment.categoryId)}
                sx={{
                  border: `2px solid ${
                    hasContact
                      ? alpha(theme.palette.success.main, 0.3) 
                      : alpha(theme.palette.grey[500], 0.2)
                  }`,
                  '&:before': { display: 'none' },
                  boxShadow: 1,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%', pr: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {assignment.categoryName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Category {index + 1} of {assignments.length}
                        {assignment.escalationSteps && assignment.escalationSteps.length > 0 && 
                          ` • ${assignment.escalationSteps.length} step${assignment.escalationSteps.length !== 1 ? 's' : ''}`
                        }
                      </Typography>
                    </Box>
                    {hasContact && (
                      <Chip 
                        icon={<AccountCircle />} 
                        label="Assigned" 
                        color="success" 
                        size="small" 
                      />
                    )}
                  </Stack>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 2 }}>
                {/* When to Contact - Global setting */}
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>When to Contact</InputLabel>
                    <Select
                      value={assignment.whenToContact || 'all-hours'}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        // If "different" is selected, use special handler that also initializes after hours steps
                        if (newValue === 'different') {
                          initializeAfterHoursSteps(assignment.categoryId, newValue);
                        } else {
                          handleAssignmentChange(assignment.categoryId, 'whenToContact', newValue);
                        }
                      }}
                      label="When to Contact"
                    >
                      <MenuItem value="all-hours">All Hours (24/7)</MenuItem>
                      <MenuItem value="business-hours">Business Hours Only</MenuItem>
                      <MenuItem value="after-hours">After Hours Only</MenuItem>
                      <MenuItem value="different">Different for Office Hours &amp; After Hours</MenuItem>
                      <MenuItem value="emergency">Emergency Only</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Conditional Escalation Sections */}
                {assignment.whenToContact === 'different' ? (
                  <>
                    {/* Office Hours Section */}
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        mb: 3, 
                        bgcolor: alpha(theme.palette.primary.main, 0.03), 
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: theme.palette.primary.main, display: 'flex', alignItems: 'center', gap: 1 }}>
                        ☀️ Office Hours Escalation
                      </Typography>
                      {renderEscalationSection(assignment, false)}
                    </Paper>

                    {/* After Hours Section */}
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        bgcolor: alpha(theme.palette.secondary.main, 0.03), 
                        border: `2px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
                        borderRadius: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: theme.palette.secondary.main, display: 'flex', alignItems: 'center', gap: 1 }}>
                        🌙 After Hours Escalation
                      </Typography>
                      {renderEscalationSection(assignment, true)}
                    </Paper>
                  </>
                ) : (
                  <>
                    {/* Standard Escalation Steps */}
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
                      Escalation Steps
                    </Typography>
                    {renderEscalationSection(assignment, false)}
                  </>
                )}

                {/* Special Instructions - Global */}
                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Special Instructions (applies to all steps)"
                    value={assignment.specialInstructions || ''}
                    onChange={(e) => handleAssignmentChange(assignment.categoryId, 'specialInstructions', e.target.value)}
                    placeholder="e.g., Only call after 8 AM on weekends"
                    multiline
                    rows={2}
                  />
                </Box>
                </AccordionDetails>
              </Accordion>
            );
            })}
          </Stack>
        </Fade>

        {/* Dispatch Instructions Preview Section */}
        <Fade in timeout={1000}>
          <Paper elevation={3} sx={{ p: 3, mt: 4, bgcolor: alpha(theme.palette.grey[100], 0.5), border: '2px solid #1565c0' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1565c0', textTransform: 'uppercase', borderBottom: '2px solid #1565c0', pb: 1 }}>
              Dispatch Instructions
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#d32f2f', fontStyle: 'italic' }}>
              Contact information is in the directory
            </Typography>
            <Typography variant="caption" sx={{ mb: 3, color: '#e91e63', display: 'block' }}>
              Repeat Individual Dr's Instructions until Delivered
            </Typography>
            <Box
              dangerouslySetInnerHTML={{ __html: generateDispatchInstructions() }}
              sx={{
                '& h2, & h3, & h4': { mt: 0 },
              }}
            />
          </Paper>
        </Fade>

        {/* Navigation */}
        <Fade in timeout={1000}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mt: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: darkMode ? theme.palette.grey[900] : theme.palette.grey[50],
            }}
          >
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeRounded />}
              onClick={() => history.push(WIZARD_ROUTES.ON_CALL_ESCALATION)}
              sx={{ minWidth: 120 }}
            >
              Back
            </Button>

            <Button
              variant="contained"
              endIcon={<NavigateNextRounded />}
              onClick={onNext}
              sx={{
                minWidth: 160,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              Next: Other Info
            </Button>
          </Paper>
        </Fade>
      </Container>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Dispatch Instructions Preview</Typography>
            <IconButton onClick={() => setPreviewOpen(false)} size="small">
              <DeleteIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            dangerouslySetInnerHTML={{ __html: previewHtml }}
            sx={{
              '& h2, & h3, & h4': { mt: 0 },
              maxHeight: '60vh',
              overflow: 'auto',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyToClipboard}
            variant="outlined"
          >
            Copy as Text
          </Button>
          <Button onClick={() => setPreviewOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Prerequisite Dialog - redirects to OnCall if teams not set up */}
      <Dialog
        open={prerequisiteDialogOpen}
        onClose={() => {}}
        aria-labelledby="prerequisite-dialog-title"
      >
        <DialogTitle id="prerequisite-dialog-title">
          Complete On-Call Setup First
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Before assigning call routing, you need to set up your on-call team members in the <strong>On Call</strong> section.
          </Alert>
          <Typography variant="body2">
            Call Routing assigns specific team members to handle different types of calls. You'll need to add at least one team member before you can configure routing assignments.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setPrerequisiteDialogOpen(false);
              history.push(WIZARD_ROUTES.ON_CALL);
            }}
            color="primary"
            variant="contained"
            autoFocus
          >
            Go to On Call Setup
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CallRouting;
