// src/pages/ClientInfo/pages/CallRouting.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Container,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Divider,
  LinearProgress,
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

const escapeHtml = (value) => {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

  // Get call categories from answerCalls section
  const answerCalls = formData.answerCalls || {};
  const categories = answerCalls.categories || [];

  // Get team members from onCall section
  const onCall = formData.onCall || {};
  const teamMembers = Array.isArray(onCall.team) ? onCall.team : [];

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
        escalationSteps: [
          {
            id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            contactPerson: '',
            contactMethod: 'call',
            notes: '',
            ifNaAction: 'go-to-next',
            repeatSteps: false,
            holdForCheckIn: false,
          }
        ],
      }));
      updateSection('callRouting', { categoryAssignments: initialAssignments });
    }
  }, [categories.length, assignments.length]);

  // Initialize all accordions to be expanded
  useEffect(() => {
    if (assignments.length > 0) {
      const initialExpanded = {};
      assignments.forEach(assignment => {
        initialExpanded[assignment.categoryId] = true;
      });
      setExpandedCategories(initialExpanded);
    }
  }, [assignments.length]);

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
          ifNaAction: 'go-to-next',
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

  const getCompletionPercentage = () => {
    if (assignments.length === 0) return 0;
    const withContacts = assignments.filter(a => 
      a.escalationSteps && 
      a.escalationSteps.length > 0 && 
      (a.escalationSteps[0].contactPerson || a.escalationSteps[0].contactMethod === 'delivered')
    ).length;
    return Math.round((withContacts / assignments.length) * 100);
  };

  const progress = getCompletionPercentage();

  // Helper function to check if an array has values
  const hasValue = (arr) => {
    if (!Array.isArray(arr)) return false;
    return arr.some(val => val && val.trim() !== '');
  };

  // Get available contact methods for a specific person
  const getAvailableContactMethods = (personId) => {
    if (!personId || personId === 'office') {
      // Office can have all methods
      return ['call', 'text', 'email', 'pager', 'call-text', 'call-email', 'text-email', 'call-text-email', 'all', 'delivered'];
    }

    const member = teamMembers.find(m => m.id === personId);
    if (!member) {
      return ['delivered']; // If no member found, only allow "Consider Delivered"
    }

    const availableMethods = [];
    const hasPhone = hasValue(member.cellPhone) || hasValue(member.homePhone);
    const hasText = hasValue(member.textCell) || hasValue(member.cellPhone); // Cell phone can be used for text
    const hasEmail = hasValue(member.email);
    const hasPager = hasValue(member.pager);

    // Single methods
    if (hasPhone) availableMethods.push('call');
    if (hasText) availableMethods.push('text');
    if (hasEmail) availableMethods.push('email');
    if (hasPager) availableMethods.push('pager');

    // Combination methods
    if (hasPhone && hasText) availableMethods.push('call-text');
    if (hasPhone && hasEmail) availableMethods.push('call-email');
    if (hasText && hasEmail) availableMethods.push('text-email');
    if (hasPhone && hasText && hasEmail) availableMethods.push('call-text-email');

    // Try all methods if multiple are available
    if (availableMethods.length > 1) availableMethods.push('all');

    // Always allow "Consider Delivered" as a fallback
    availableMethods.push('delivered');

    return availableMethods;
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
            
            // If N/A action on same line or next line
            if (step.ifNaAction && step.ifNaAction !== 'go-to-next') {
              if (step.ifNaAction === 'no-cue') {
                html += `<p style="margin: 3px 0 3px 15px; font-size: 13px; color: #666;">If N/A, NO CUE</p>`;
              } else if (step.ifNaAction === 'lmtc') {
                html += `<p style="margin: 3px 0 3px 15px; font-size: 13px; color: #666;">If N/A, LMTC</p>`;
              } else if (step.ifNaAction === 'hold-checkin') {
                html += `<p style="margin: 3px 0 3px 15px; font-size: 13px; color: #666;">If N/A, Hold for Check-In</p>`;
              } else if (step.ifNaAction === 'auto-email') {
                html += `<p style="margin: 3px 0 3px 15px; font-size: 13px; color: #666;">If N/A, Auto-Email & Consider Delivered</p>`;
              }
            }
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
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
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

            {/* Progress Indicator */}
            <Box sx={{ mt: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Completion
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {progress}%
                </Typography>
              </Stack>
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />
            </Box>

            {/* Preview Button */}
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<VisibilityIcon />}
                onClick={handlePreview}
                disabled={assignments.length === 0}
              >
                Preview Dispatch Instructions
              </Button>
            </Box>

            {/* Summary Stats */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6} md={4}>
                <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.info.main, 0.05) }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                      {categories.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Call Categories
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={4}>
                <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                      {teamMembers.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Team Members
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                      {assignments.filter(a => a.escalationSteps && a.escalationSteps.length > 0 && (a.escalationSteps[0].contactPerson || a.escalationSteps[0].contactMethod === 'delivered')).length}/{assignments.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Categories Assigned
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
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
                      onChange={(e) => handleAssignmentChange(assignment.categoryId, 'whenToContact', e.target.value)}
                      label="When to Contact"
                    >
                      <MenuItem value="all-hours">All Hours (24/7)</MenuItem>
                      <MenuItem value="business-hours">Business Hours Only</MenuItem>
                      <MenuItem value="after-hours">After Hours Only</MenuItem>
                      <MenuItem value="emergency">Emergency Only</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Escalation Steps */}
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: theme.palette.primary.main }}>
                  Escalation Steps
                </Typography>

                <Stack spacing={2}>
                  {assignment.escalationSteps && assignment.escalationSteps.map((step, stepIndex) => (
                    <Box key={step.id}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.05),
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Step {stepIndex + 1}
                          </Typography>
                          {assignment.escalationSteps.length > 1 && (
                            <Tooltip title="Remove this step">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => removeEscalationStep(assignment.categoryId, step.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Contact Person {step.contactMethod !== 'delivered' && '*'}</InputLabel>
                              <Select
                                value={step.contactPerson || ''}
                                onChange={(e) => handleStepChange(assignment.categoryId, step.id, 'contactPerson', e.target.value)}
                                label={`Contact Person ${step.contactMethod !== 'delivered' ? '*' : ''}`}
                                error={stepIndex === 0 && !step.contactPerson && step.contactMethod !== 'delivered'}
                                disabled={step.contactMethod === 'delivered'}
                              >
                                <MenuItem value="">
                                  <em>{step.contactMethod === 'delivered' ? '-- No contact needed --' : '-- Select team member --'}</em>
                                </MenuItem>
                                <MenuItem value="office">
                                  <strong>Office / General Contact</strong>
                                </MenuItem>
                                {teamMembers.map((member) => (
                                  <MenuItem key={member.id} value={member.id}>
                                    {member.name} {member.role && `(${member.role})`}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            
                            {/* Show selected member's escalation steps */}
                            {step.contactPerson && step.contactPerson !== 'office' && (() => {
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

                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Contact Method</InputLabel>
                              <Select
                                value={step.contactMethod || 'call'}
                                onChange={(e) => handleStepChange(assignment.categoryId, step.id, 'contactMethod', e.target.value)}
                                label="Contact Method"
                              >
                                {(() => {
                                  const availableMethods = getAvailableContactMethods(step.contactPerson);
                                  const methodLabels = {
                                    'call': 'Call',
                                    'text': 'Text/SMS',
                                    'email': 'Email',
                                    'pager': 'Pager',
                                    'call-text': 'Call + Text',
                                    'call-email': 'Call + Email',
                                    'text-email': 'Text + Email',
                                    'call-text-email': 'Call + Text + Email',
                                    'all': 'Try All Methods',
                                    'delivered': 'Consider Delivered'
                                  };
                                  
                                  return availableMethods.map(method => (
                                    <MenuItem key={method} value={method}>
                                      {methodLabels[method]}
                                    </MenuItem>
                                  ));
                                })()}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small">
                              <InputLabel>If N/A Action</InputLabel>
                              <Select
                                value={step.ifNaAction || 'go-to-next'}
                                onChange={(e) => handleStepChange(assignment.categoryId, step.id, 'ifNaAction', e.target.value)}
                                label="If N/A Action"
                              >
                                <MenuItem value="go-to-next">If N/A go to next step</MenuItem>
                                <MenuItem value="no-cue">If N/A NO CUE</MenuItem>
                                <MenuItem value="lmtc">If N/A LMTC</MenuItem>
                                <MenuItem value="hold-checkin">If N/A Hold for Check-In</MenuItem>
                                <MenuItem value="auto-email">If N/A Auto-Email & Consider Delivered</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Repeat Steps?</InputLabel>
                              <Select
                                value={step.repeatSteps ? 'yes' : 'no'}
                                onChange={(e) => handleStepChange(assignment.categoryId, step.id, 'repeatSteps', e.target.value === 'yes')}
                                label="Repeat Steps?"
                              >
                                <MenuItem value="no">No - Don't Repeat</MenuItem>
                                <MenuItem value="yes">Yes - Repeat All Steps Up to This One</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Hold for Check-In Mode</InputLabel>
                              <Select
                                value={step.holdForCheckIn ? 'yes' : 'no'}
                                onChange={(e) => handleStepChange(assignment.categoryId, step.id, 'holdForCheckIn', e.target.value === 'yes')}
                                label="Hold for Check-In Mode"
                              >
                                <MenuItem value="no">No - Proceed Normally</MenuItem>
                                <MenuItem value="yes">Yes - Hold Until Check-In</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Notes for this step"
                              value={step.notes || ''}
                              onChange={(e) => handleStepChange(assignment.categoryId, step.id, 'notes', e.target.value)}
                              placeholder="e.g., Wait 5 minutes before moving to next step"
                              multiline
                              rows={2}
                            />
                          </Grid>
                        </Grid>
                      </Box>

                      {/* Arrow between steps */}
                      {stepIndex < assignment.escalationSteps.length - 1 && (
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
                  onClick={() => addEscalationStep(assignment.categoryId)}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  Add Another Step
                </Button>

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
              onClick={() => history.push(WIZARD_ROUTES.ON_CALL)}
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
