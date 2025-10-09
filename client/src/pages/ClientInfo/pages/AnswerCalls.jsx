// src/pages/ClientInfo/pages/AnswerCalls.jsx
import React from 'react';
import {
  Box,
  Paper,
  Container,
  Button,
  Snackbar,
  Alert,
  Typography,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  Chip,
  FormHelperText,
  Grid,
  Divider,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CheckCircleOutlined,
  NavigateNextRounded,
  NavigateBeforeRounded,
  ExpandMoreRounded,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

import ClientInfoNavbar from '../shared_layout_routing/ClientInfoNavbar';
import ClientInfoFooter from '../shared_layout_routing/ClientInfoFooter';
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';
import CallTypesSection from '../sections/CallTypesSection';
import { createSharedStyles } from '../utils/sharedStyles';
import { WIZARD_ROUTES } from '../constants/routes';

const STANDARD_ROUTINE =
  'Thank you for calling [Business Name]. This is … How may I help you?';

const STANDARD_URGENT =
  'Thank you for calling [Business Name]. Please hold, and I will transfer you to our on-call staff right away.';

const AnswerCalls = () => {
  const theme = useTheme();
  const { darkMode } = useClientInfoTheme();
  const sharedStyles = createSharedStyles(theme, darkMode);
  const history = useHistory();
  const { updateSection, validateSection, markStepVisited, getSection } = useWizard();

  const [snack, setSnack] = React.useState(false);
  const [expanded, setExpanded] = React.useState('routine');
  const [errors, setErrors] = React.useState({});

  const ac = getSection('answerCalls') || {};

  const setAC = (patch) => updateSection('answerCalls', { ...ac, ...patch });
  const handleRoutineChange = (patch) => setAC({ routine: { ...(ac.routine || {}), ...patch } });
  const handleUrgentChange = (patch) => setAC({ urgent: { ...(ac.urgent || {}), ...patch } });

  const onSave = () => {
    markStepVisited('answer-calls');
    setSnack(true);
  };

  const onNext = () => {
    markStepVisited('answer-calls');
    const validationErrors = validateSection('answerCalls', ac);
    
    // Show validation feedback but don't block navigation
    if (validationErrors) {
      setErrors(validationErrors);
      setSnack(true);
    } else {
      setErrors({});
    }
    
    // Always proceed to next step
    history.push('/ClientInfoReact/NewFormWizard/on-call');
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const hasConfiguredCallType = (() => {
      if (Array.isArray(ac.callTypes)) {
        return ac.callTypes.length > 0;
      }
      if (ac.callTypes && typeof ac.callTypes === 'object') {
        return Object.entries(ac.callTypes).some(([key, value]) => key !== 'otherText' && value?.enabled);
      }
      return false;
    })();

    const fields = [
      ac.routine?.useStandard !== undefined || ac.routine?.custom,
      ac.urgent?.useStandard !== undefined || ac.urgent?.custom,
      hasConfiguredCallType,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const progress = getCompletionPercentage();
  const steps = ['Company Info', 'Office Hours', 'Call Handling', 'Review'];

  const softBg = (c) =>
    darkMode ? alpha(theme.palette[c].main, 0.12) : alpha(theme.palette[c].main, 0.06);
  const inputBg = darkMode ? alpha('#fff', 0.06) : theme.palette.common.white;
  const card = (c = 'primary') => ({
    p: 2,
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette[c].main, 0.25)}`,
    bgcolor: softBg(c),
  });

  const accordionStyle = (color) => ({
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette[color].main, 0.25)}`,
    backgroundColor: softBg(color),
    boxShadow: 'none',
    '&:before': { display: 'none' },
    '&.Mui-expanded': { margin: 0 },
  });

  const accordionSummarySx = {
    px: { xs: 2, md: 3 },
    py: 2,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 0.5,
  };

  const accordionDetailsSx = {
    px: { xs: 2, md: 3 },
    pb: 3,
    pt: 0,
  };

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // === New: Call Classification Section ===
  const CallClassificationSection = () => (
    <Paper sx={{ ...card('info'), mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.info.main }}>
        📞 Call Classification
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Help us understand what types of calls you consider routine vs urgent so we can handle them appropriately.
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.info.main }}>
            Routine Calls (Non-Urgent)
          </Typography>
          <TextField
            label="What calls are considered routine?"
            placeholder="Examples: general inquiries, appointments, order status, billing questions..."
            value={ac.classification?.routineTypes || ''}
            onChange={(e) => setAC({ classification: { ...(ac.classification || {}), routineTypes: e.target.value } })}
            fullWidth
            multiline
            rows={4}
            sx={{ bgcolor: inputBg, mb: 2 }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.error.main }}>
            Urgent Calls (Immediate Attention)
          </Typography>
          <TextField
            label="What calls are considered urgent?"
            placeholder="Examples: emergencies, system down, critical client issues, after-hours emergencies..."
            value={ac.classification?.urgentTypes || ''}
            onChange={(e) => setAC({ classification: { ...(ac.classification || {}), urgentTypes: e.target.value } })}
            fullWidth
            multiline
            rows={4}
            sx={{ bgcolor: inputBg, mb: 2 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  // === New: Routine Call Workflow Section ===
  const RoutineWorkflowSection = () => (
    <Paper sx={{ ...card('info'), mb: 0 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.info.main }}>
        📋 Routine Call Handling Workflow
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Message Delivery Method
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={ac.routineWorkflow?.deliveryMethod || 'next-day'}
              onChange={(e) => setAC({ routineWorkflow: { ...(ac.routineWorkflow || {}), deliveryMethod: e.target.value } })}
            >
              <FormControlLabel 
                value="next-day" 
                control={<Radio />} 
                label="Hold messages and send next business day at opening time" 
              />
              <FormControlLabel 
                value="immediate-email" 
                control={<Radio />} 
                label="Send via email immediately as calls come in" 
              />
              <FormControlLabel 
                value="immediate-fax" 
                control={<Radio />} 
                label="Send via fax immediately as calls come in" 
              />
              <FormControlLabel 
                value="immediate-text" 
                control={<Radio />} 
                label="Send via text/SMS immediately as calls come in" 
              />
              <FormControlLabel 
                value="custom" 
                control={<Radio />} 
                label="Custom delivery schedule" 
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Delivery Details
          </Typography>
          
          {(ac.routineWorkflow?.deliveryMethod === 'next-day' || !ac.routineWorkflow?.deliveryMethod) && (
            <TextField
              label="What time should we send messages each morning?"
              placeholder="e.g., 7:00 AM, when office opens, 8:30 AM"
              value={ac.routineWorkflow?.morningDeliveryTime || ''}
              onChange={(e) => setAC({ routineWorkflow: { ...(ac.routineWorkflow || {}), morningDeliveryTime: e.target.value } })}
              fullWidth
              sx={{ bgcolor: inputBg, mb: 2 }}
            />
          )}
          
          <TextField
            label="Special delivery instructions"
            placeholder="Any specific requirements for routine message delivery..."
            value={ac.routineWorkflow?.specialInstructions || ''}
            onChange={(e) => setAC({ routineWorkflow: { ...(ac.routineWorkflow || {}), specialInstructions: e.target.value } })}
            fullWidth
            multiline
            rows={3}
            sx={{ bgcolor: inputBg }}
          />
        </Grid>
      </Grid>
    </Paper>
  );

  // === New: Urgent Call Workflow Section ===
  const UrgentWorkflowSection = () => (
    <Paper sx={{ ...card('error'), mb: 0 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: theme.palette.error.main }}>
        🚨 Urgent Call Handling Workflow
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Initial Contact Method
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              value={ac.urgentWorkflow?.initialContact || 'call-immediately'}
              onChange={(e) => setAC({ urgentWorkflow: { ...(ac.urgentWorkflow || {}), initialContact: e.target.value } })}
            >
              <FormControlLabel 
                value="call-immediately" 
                control={<Radio />} 
                label="Call the on-call person immediately" 
              />
              <FormControlLabel 
                value="text-then-call" 
                control={<Radio />} 
                label="Text first, then call if no response" 
              />
              <FormControlLabel 
                value="text-only" 
                control={<Radio />} 
                label="Text only (don't call unless instructed)" 
              />
            </RadioGroup>
          </FormControl>
          
          {ac.urgentWorkflow?.initialContact === 'text-then-call' && (
            <TextField
              label="How long to wait before calling?"
              placeholder="e.g., 5 minutes, 10 minutes"
              value={ac.urgentWorkflow?.waitTime || ''}
              onChange={(e) => setAC({ urgentWorkflow: { ...(ac.urgentWorkflow || {}), waitTime: e.target.value } })}
              fullWidth
              sx={{ bgcolor: inputBg, mt: 2 }}
            />
          )}
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
            Second Call Handling
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            What should we do if a second urgent call comes in while we're still handling the first?
          </Typography>
          
          <FormControl component="fieldset">
            <RadioGroup
              value={ac.urgentWorkflow?.secondCallHandling || 'same-as-first'}
              onChange={(e) => setAC({ urgentWorkflow: { ...(ac.urgentWorkflow || {}), secondCallHandling: e.target.value } })}
            >
              <FormControlLabel 
                value="same-as-first" 
                control={<Radio />} 
                label="Follow same procedure as first call" 
              />
              <FormControlLabel 
                value="escalate-immediately" 
                control={<Radio />} 
                label="Escalate immediately (call backup contact)" 
              />
              <FormControlLabel 
                value="different-procedure" 
                control={<Radio />} 
                label="Use different procedure" 
              />
            </RadioGroup>
          </FormControl>
          
          {ac.urgentWorkflow?.secondCallHandling === 'different-procedure' && (
            <TextField
              label="Describe the procedure for second calls"
              placeholder="What should we do differently for the second urgent call?"
              value={ac.urgentWorkflow?.secondCallProcedure || ''}
              onChange={(e) => setAC({ urgentWorkflow: { ...(ac.urgentWorkflow || {}), secondCallProcedure: e.target.value } })}
              fullWidth
              multiline
              rows={3}
              sx={{ bgcolor: inputBg, mt: 2 }}
            />
          )}
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <TextField
        label="Additional urgent call instructions"
        placeholder="Any other special requirements for urgent calls, escalation contacts, time limits, etc..."
  value={ac.urgentWorkflow?.additionalInstructions || ''}
  onChange={(e) => setAC({ urgentWorkflow: { ...(ac.urgentWorkflow || {}), additionalInstructions: e.target.value } })}
        fullWidth
        multiline
        rows={3}
        sx={{ bgcolor: inputBg }}
      />
    </Paper>
  );

  // === UNUSED COMPONENTS (to be removed) ====================================
  /*
  const RoutineForm = () => (
    <Paper sx={{ ...card('info') }}>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>Routine phrase</Typography>
      <RadioGroup
        value={ac.routine.useStandard ? 'standard' : 'custom'}
        onChange={(e) => handleRoutineChange({ useStandard: e.target.value === 'standard' })}
      >
        <FormControlLabel
          value="standard"
          control={<Radio size="small" />}
          label={
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Use standard phrase</Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                “{STANDARD_ROUTINE}”
              </Typography>
            </Box>
          }
        />
        <FormControlLabel value="custom" control={<Radio size="small" />} label="Use customized phrase" />
      </RadioGroup>

      <TextField
        placeholder="Type your custom routine phrase here…"
        disabled={ac.routine.useStandard}
        value={ac.routine.custom}
        onChange={(e) => handleRoutineChange({ custom: e.target.value })}
        fullWidth
        size="small"
        sx={{ bgcolor: inputBg }}
      />
      <FormHelperText sx={{ ml: 0, mt: 0.5 }}>
        Tip: Include your staff name if you want it stated (e.g., “This is Sarah”).
      </FormHelperText>
      <FormHelperText sx={{ ml: 0, mt: 0.5 }}>{(ac.routine.custom || '').length}/300 characters</FormHelperText>
    </Paper>
  );

  const UrgentForm = () => (
    <Paper sx={{ ...card('warning') }}>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>Urgent phrase</Typography>
      <RadioGroup
        value={ac.urgent.useStandard ? 'standard' : 'custom'}
        onChange={(e) => handleUrgentChange({ useStandard: e.target.value === 'standard' })}
      >
        <FormControlLabel
          value="standard"
          control={<Radio size="small" />}
          label={
            <Box>
              <Typography sx={{ fontWeight: 600 }}>Use standard phrase</Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                “{STANDARD_URGENT}”
              </Typography>
            </Box>
          }
        />
        <FormControlLabel value="custom" control={<Radio size="small" />} label="Use customized phrase" />
      </RadioGroup>

      <TextField
        placeholder="Type your custom urgent phrase here…"
        disabled={ac.urgent.useStandard}
        value={ac.urgent.custom}
        onChange={(e) => handleUrgentChange({ custom: e.target.value })}
        fullWidth
        size="small"
        sx={{ bgcolor: inputBg }}
      />
      <FormHelperText sx={{ ml: 0, mt: 0.5 }}>
        Keep it short—urgent callers will be transferred right away.
      </FormHelperText>
      <FormHelperText sx={{ ml: 0, mt: 0.5 }}>{(ac.urgent.custom || '').length}/300 characters</FormHelperText>
    </Paper>
  );

  // === Right column (sticky) ==================================================
  const RightColumnRoutine = () => (
    <Box sx={{ position: { md: 'sticky' }, top: { md: 88 }, display: 'grid', gap: 2 }}>
      <RoutinePreview />
      <Paper sx={{ ...card('primary') }}>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Custom guidelines for routine calls</Typography>
        <TextField
          value={ac.routine.guidelines || ''}
          onChange={(e) => handleRoutineChange({ guidelines: e.target.value })}
          fullWidth
          multiline
          minRows={5}
          placeholder="Any special triage, scripts, or constraints for routine calls"
          sx={{ bgcolor: inputBg }}
        />
      </Paper>
    </Box>
  );

  const RightColumnUrgent = () => (
    <Box sx={{ position: { md: 'sticky' }, top: { md: 88 }, display: 'grid', gap: 2 }}>
      <UrgentPreview />
      <Paper sx={{ ...card('error') }}>
        <Typography sx={{ fontWeight: 700, mb: 1 }}>Custom guidelines for urgent calls</Typography>
        <TextField
          value={ac.urgent.guidelines || ''}
          onChange={(e) => handleUrgentChange({ guidelines: e.target.value })}
          fullWidth
          multiline
          minRows={5}
          placeholder="Escalation rules, time limits, scripts, etc."
          sx={{ bgcolor: inputBg }}
        />
      </Paper>
    </Box>
  );
  */

  return (
    <Box sx={sharedStyles.layout.pageWrapper}>
      <ClientInfoNavbar />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {/* Header Section */}
        <Fade in timeout={600}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 3, md: 4 },
              mb: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
              border: `1px solid ${theme.palette.primary.main}20`,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.primary.main,
                  mb: 1,
                }}
              >
                Call Handling Procedures
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Help us understand how you want your calls categorized and handled
              </Typography>

              {/* Progress Stepper */}
              <Stepper activeStep={2} alternativeLabel sx={{ mb: 3 }}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontSize: '0.875rem',
                          fontWeight: index === 2 ? 600 : 400,
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Progress Bar */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
                      },
                    }}
                  />
                </Box>
                <Chip
                  icon={<CheckCircleOutlined />}
                  label={`${progress}% Complete`}
                  color={progress > 70 ? 'success' : progress > 30 ? 'warning' : 'default'}
                  size="small"
                />
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Main Content Card */}
        <Fade in timeout={800}>
          <Paper variant="outlined" sx={sharedStyles.layout.wizardCard}>

          {/* CALL CLASSIFICATION */}
          <CallClassificationSection />

          {/* WORKFLOW ACCORDIONS */}
          <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
            <Accordion
              expanded={expanded === 'routine'}
              onChange={handleAccordionChange('routine')}
              disableGutters
              sx={accordionStyle('info')}
            >
              <AccordionSummary expandIcon={<ExpandMoreRounded />} sx={accordionSummarySx}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                  Step 1 · Routine Call Workflow
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Outline how we'll deliver routine messages and morning follow-ups.
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={accordionDetailsSx}>
                <RoutineWorkflowSection />
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === 'urgent'}
              onChange={handleAccordionChange('urgent')}
              disableGutters
              sx={accordionStyle('error')}
            >
              <AccordionSummary expandIcon={<ExpandMoreRounded />} sx={accordionSummarySx}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                  Step 2 · Urgent Call Workflow
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Confirm who we contact first and how to escalate overlapping urgent calls.
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={accordionDetailsSx}>
                <UrgentWorkflowSection />
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === 'scripts'}
              onChange={handleAccordionChange('scripts')}
              disableGutters
              sx={accordionStyle('primary')}
            >
              <AccordionSummary expandIcon={<ExpandMoreRounded />} sx={accordionSummarySx}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  Step 3 · Call Scripts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Finalize the phrases we’ll use when answering routine and urgent calls.
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={accordionDetailsSx}>
                <Paper sx={{ ...card('primary'), mb: 0 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: theme.palette.primary.main }}>
                    📞 Call Answering Scripts
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.info.main }}>
                        Routine Call Script
                      </Typography>
                      <RadioGroup
                        value={ac.routine.useStandard ? 'standard' : 'custom'}
                        onChange={(e) => handleRoutineChange({ useStandard: e.target.value === 'standard' })}
                      >
                        <FormControlLabel
                          value="standard"
                          control={<Radio size="small" />}
                          label={
                            <Box>
                              <Typography sx={{ fontWeight: 600 }}>Use standard phrase</Typography>
                              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                "{STANDARD_ROUTINE}"
                              </Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel value="custom" control={<Radio size="small" />} label="Use customized phrase" />
                      </RadioGroup>

                      <TextField
                        placeholder="Type your custom routine phrase here…"
                        disabled={ac.routine.useStandard}
                        value={ac.routine.custom}
                        onChange={(e) => handleRoutineChange({ custom: e.target.value })}
                        fullWidth
                        size="small"
                        sx={{ bgcolor: inputBg, mt: 2 }}
                      />
                      <FormHelperText sx={{ ml: 0, mt: 0.5 }}>
                        Tip: Include your staff name if you want it stated (e.g., "This is Sarah").
                      </FormHelperText>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: theme.palette.error.main }}>
                        Urgent Call Script
                      </Typography>
                      <RadioGroup
                        value={ac.urgent.useStandard ? 'standard' : 'custom'}
                        onChange={(e) => handleUrgentChange({ useStandard: e.target.value === 'standard' })}
                      >
                        <FormControlLabel
                          value="standard"
                          control={<Radio size="small" />}
                          label={
                            <Box>
                              <Typography sx={{ fontWeight: 600 }}>Use standard phrase</Typography>
                              <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                "{STANDARD_URGENT}"
                              </Typography>
                            </Box>
                          }
                        />
                        <FormControlLabel value="custom" control={<Radio size="small" />} label="Use customized phrase" />
                      </RadioGroup>

                      <TextField
                        placeholder="Type your custom urgent phrase here…"
                        disabled={ac.urgent.useStandard}
                        value={ac.urgent.custom}
                        onChange={(e) => handleUrgentChange({ custom: e.target.value })}
                        fullWidth
                        size="small"
                        sx={{ bgcolor: inputBg, mt: 2 }}
                      />
                      <FormHelperText sx={{ ml: 0, mt: 0.5 }}>
                        Keep it short—urgent callers will be transferred right away.
                      </FormHelperText>
                    </Grid>
                  </Grid>
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* CALL TYPES */}
          <Typography variant="subtitle1" sx={{ fontWeight: 800, textAlign: 'center', mt: 3, mb: 1, color: theme.palette.primary.main }}>
            List the call types we’ll receive and the information wanted for each
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: softBg('primary'), borderRadius: 2 }}>
            <CallTypesSection errors={errors.callTypes || {}} />
          </Paper>
          </Paper>
        </Fade>

        {/* Navigation */}
        <Fade in timeout={1400}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: darkMode ? theme.palette.grey[900] : theme.palette.grey[50],
            }}
          >
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeRounded />}
              onClick={() => history.push(WIZARD_ROUTES.OFFICE_REACH)}
              sx={{ minWidth: 120 }}
            >
              Back
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={onSave}
              >
                Save Draft
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
                Next: On Call
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>

      <ClientInfoFooter />

      <Snackbar
        open={snack}
        autoHideDuration={2400}
        onClose={() => setSnack(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={Object.keys(errors).length ? "error" : "success"} sx={{ width: '100%' }}>
          {Object.keys(errors).length ? "Please fix the validation errors before continuing." : "Saved."}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AnswerCalls;
