import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Container,
  Snackbar,
  Alert,
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Fade,
  Card,
  CardContent,
  Chip,
  Stack,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
} from '@mui/material';
import {
  NavigateNextRounded,
  NavigateBeforeRounded,
  SettingsApplications,
  ExpandMoreRounded,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

// Navbar handled globally by WizardLayout
// Footer handled by WizardLayout
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';
import { WIZARD_ROUTES } from '../constants/routes';

import EnhancedOnCallTeamSection from '../sections/EnhancedOnCallTeamSection';
import OnCallRotationSection from '../sections/OnCallRotationSection';
import OnCallContactRulesSection from '../sections/OnCallContactRulesSection';
import OnCallProceduresSection from '../sections/OnCallProceduresSection';
import EscalationMatrixSection from '../sections/EscalationMatrixSection';
import OnCallDepartmentsSection from '../sections/OnCallDepartmentsSection';
import OnCallScheduleSection from '../sections/OnCallScheduleSection';

const createEscalationStep = (overrides = {}) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  role: '',
  contact: '',
  window: '',
  notes: '',
  ...overrides,
});

const DEFAULT_ONCALL = {
  rotation: {
    doesNotChange: false,
    otherExplain: '',
    whenChanges: '',
    frequency: '',        // 'daily' | 'weekly' | 'monthly' | ''
    changeBeginsTime: '', // 'HH:MM'
    dayOrDate: '',
  },
  contactRules: {
    allCalls: false,
    callerCannotWait: false,
    holdAllCalls: false,
    emergencyOnly: false,
    specificCallTypes: false,
    notes: '',
    emergencyDefinition: '',
    specificTypes: '',
  },
  procedures: {
    onCallProcedures: '',
    businessHoursNotification: '',
    businessHoursSameAsOnCall: false,
    attempts: '',
    minutesBetweenAttempts: '',
    escalateAfterMinutes: '',
    escalateTo: '',
    stopAfterSuccessfulContact: false,
    leaveVoicemail: false,
    smsOk: false,
    emailOk: false,
  },
  scheduleType: 'no-schedule',
  fixedOrder: [],
  schedules: [],
  team: [], // [{ name,title,email,cell,home,other }]
  departments: [],
  escalation: [],
  notificationRules: {
    allCalls: false,
    holdAll: false,
    cannotWait: false,
    emergencyOnly: false,
    callTypes: '',
  },
};

const OnCall = () => {
  const theme = useTheme();
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const { updateSection, validateSection, markStepVisited, getSection } = useWizard();

  const onCall = getSection('onCall') || DEFAULT_ONCALL;
  const legacyEscalationMatrix = getSection('escalationMatrix') || [];
  const escalationPlan = Array.isArray(onCall.escalation) ? onCall.escalation : [];
  const setOnCall = (patch) => updateSection('onCall', { ...onCall, ...patch });

  const legacyEscalationImported = React.useRef(false);

  React.useEffect(() => {
    if (legacyEscalationImported.current) return;

    if (escalationPlan.length > 0) {
      legacyEscalationImported.current = true;
      return;
    }

    if (!Array.isArray(legacyEscalationMatrix) || legacyEscalationMatrix.length === 0) {
      return;
    }

    const converted = legacyEscalationMatrix.map((row = {}, index) => {
      const fallbackName = row.contactInfo?.toString().trim() || `Level ${row.level || index + 1}`;
      const windowLabel = row.minutes ? `Escalate after ${row.minutes} minute${row.minutes === 1 ? '' : 's'}` : '';
      const roleLabel = row.contactMethod ? row.contactMethod.toString().toUpperCase() : '';
      return createEscalationStep({
        name: fallbackName,
        role: roleLabel,
        contact: row.contactInfo?.toString() || '',
        window: windowLabel,
        notes: '',
      });
    });

    updateSection('onCall', { ...onCall, escalation: converted });
    updateSection('escalationMatrix', []);
    legacyEscalationImported.current = true;
  }, [escalationPlan.length, legacyEscalationMatrix, onCall, updateSection]);

  const [snack, setSnack] = React.useState({ open: false, msg: '', severity: 'success' });
  const [expanded, setExpanded] = React.useState({
    team: true,
    coverage: false,
    procedures: false,
  });
  const [activeTeamTab, setActiveTeamTab] = React.useState(0);
  const [errors, setErrors] = React.useState({});

  // Define functions before useEffect hooks that reference them
  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpanded((prev) => ({ ...prev, [panel]: isExpanded }));
  };

  const onSave = React.useCallback(() => {
    markStepVisited('on-call');
    setSnack({ open: true, msg: 'On-call information saved!', severity: 'success' });
  }, [markStepVisited]);

  const onNext = React.useCallback(() => {
    markStepVisited('on-call');
    const collectedErrors = {};

    const baseErrors = validateSection?.('onCall', onCall);
    if (baseErrors) {
      Object.assign(collectedErrors, baseErrors);
    }

    const departmentErrors = validateSection?.('onCall.departments', onCall.departments || []);
    if (departmentErrors) {
      collectedErrors.departments = departmentErrors;
    }

    if (Object.keys(collectedErrors).length) {
      setErrors(collectedErrors);
      setSnack({ open: true, msg: 'Some fields need attention. You can continue and fix them later.', severity: 'warning' });
    } else {
      setErrors({});
      setSnack({ open: true, msg: 'On-call details look good. Moving on!', severity: 'success' });
    }

    // Always proceed to next step — new order: go to Call Routing
    history.push(WIZARD_ROUTES.CALL_ROUTING);
  }, [markStepVisited, validateSection, onCall, history]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'On-call setup — AnSer Communications';
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; created = true; }
    meta.content = 'Configure on-call rotations, escalation rules, and notifications for your team.';
    if (created) document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      if (created && meta && meta.parentNode) meta.parentNode.removeChild(meta);
    };
  }, []);

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + Right Arrow = Next step
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        onSave();
        onNext();
      }
      // Alt + Left Arrow = Previous step
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        history.push(WIZARD_ROUTES.ANSWER_CALLS);
      }
      // Ctrl + S or Cmd + S = Save draft
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave();
        setSnack({ open: true, msg: '💾 Progress saved!', severity: 'success' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, onSave, onNext]);

  // Calculate completion percentage across three key steps
  const getCompletionPercentage = () => {
    const hasFixedOrder = Array.isArray(onCall.fixedOrder) && onCall.fixedOrder.length > 0;
    const hasScheduleSelection = Boolean(
      onCall.scheduleType && onCall.scheduleType !== 'no-schedule'
    );
    const hasRotationDetails = Boolean(
      onCall.rotation?.doesNotChange ||
      onCall.rotation?.whenChanges?.trim() ||
      onCall.rotation?.frequency ||
      onCall.rotation?.changeBeginsTime ||
      onCall.rotation?.dayOrDate?.trim() ||
      onCall.rotation?.otherExplain?.trim()
    );

    const hasCoverage = hasFixedOrder || hasScheduleSelection || hasRotationDetails;

    const hasProcedures = Boolean(
      onCall.contactRules?.notes?.trim() ||
      onCall.contactRules?.allCalls ||
      onCall.contactRules?.callerCannotWait ||
      onCall.contactRules?.holdAllCalls ||
      onCall.contactRules?.emergencyOnly ||
      onCall.contactRules?.specificCallTypes ||
      onCall.procedures?.onCallProcedures?.trim() ||
      onCall.procedures?.businessHoursNotification?.trim()
    );

    const hasEscalationPlan = escalationPlan.length > 0;
    const hasDepartments = Array.isArray(onCall.departments) && onCall.departments.length > 0;

    const fields = [
      hasCoverage,
      onCall.team?.length > 0,
      hasEscalationPlan || hasDepartments,
      hasProcedures,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const progress = getCompletionPercentage();
  const steps = ['Basic Info', 'What You Need', 'Call Handling', 'On-Call Setup', 'Review'];

  // Calculate completion status for each accordion section
  const teamSectionComplete = onCall.team?.length > 0;
  const scheduleSectionComplete = Boolean(
    onCall.scheduleType &&
    (onCall.scheduleType === 'no-schedule' ||
     onCall.scheduleType === 'rotating' ||
     (onCall.scheduleType === 'fixed' && onCall.fixedOrder?.length > 0))
  );
  const proceduresSectionComplete = Boolean(
    (onCall.contactRules?.allCalls ||
     onCall.contactRules?.emergencyOnly ||
     onCall.contactRules?.callerCannotWait) &&
    onCall.procedures?.attempts
  );

  const softBg = (c) =>
    darkMode ? alpha(theme.palette[c].main, 0.12) : alpha(theme.palette[c].main, 0.06);

  const accordionStyle = (color = 'primary') => ({
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
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: { xs: 1, sm: 0.5 },
  };

  const accordionDetailsSx = {
    px: { xs: 2, md: 3 },
    pb: 3,
    pt: 0,
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: darkMode ? 'background.default' : '#f8fafc' }}>
  <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Enhanced Header */}
        <Fade in timeout={800}>
          <Paper role="region" aria-labelledby="oncall-title"
            elevation={2}
            sx={{
              p: { xs: 2, md: 3 },
              mb: 2,
              background: darkMode 
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box>
                <Typography id="oncall-title" component="h1" variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  On-Call Setup
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Configure when your on-call personnel are available and how they should be contacted for urgent matters.
                </Typography>
              </Box>
              <Stack alignItems="flex-end" spacing={0.5}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 13 }}>
                  Step 4 of 8
                </Typography>
                <Chip
                  label="⏱️ 10-15 min"
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: 11, height: 22 }}
                />
              </Stack>
            </Box>

            {/* Compact progress for THIS PAGE only */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                On-Call Page Completion:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  aria-label={`On-call page completion ${progress} percent`}
                  sx={{
                    flex: 1,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(theme.palette.primary.main, 0.06),
                    '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: progress === 100 ? theme.palette.success.main : theme.palette.info.main },
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                  {progress}%
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Overall Progress Summary */}
        <Fade in timeout={900}>
          <Alert
            severity="info"
            sx={{
              mb: 2,
              border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
              bgcolor: alpha(theme.palette.info.main, 0.05)
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Wizard Progress: {Math.round((4 / 8) * 100)}% complete
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.round((4 / 8) * 100)}
                sx={{ flex: 1, height: 6, borderRadius: 3 }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              ✓ Step 4 of 8 • Company Setup, Answer Calls, and Call Routing steps remain
            </Typography>
          </Alert>
        </Fade>

        {/* Content */}
        <Fade in timeout={1000}>
          <Stack spacing={3}>
            <Card
              sx={{
                background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.info.main, 0.08)})`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.18),
                          color: theme.palette.primary.main,
                          display: 'inline-flex',
                        }}
                      >
                        <SettingsApplications fontSize="large" />
                      </Box>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                          Shape your after-hours playbook
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          Follow the guided steps below to introduce your team, explain how coverage rotates, and spell out the rules for contacting them.
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                        <Chip
                          label={`${progress}%`}
                          color={progress === 100 ? 'success' : progress >= 50 ? 'warning' : 'default'}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Coverage, contacts, and notification steps
                        </Typography>
                      </Stack>
                      {/* Compact in-card progress to visually align with header */}
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        aria-label={`On-call card progress ${progress} percent`}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: alpha(theme.palette.grey[500], 0.12),
                          '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: progress === 100 ? theme.palette.success.main : theme.palette.primary.main },
                        }}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Accordion
              expanded={Boolean(expanded.team)}
              onChange={handleAccordionChange('team')}
              disableGutters
              sx={accordionStyle('primary')}
            >
              <AccordionSummary expandIcon={<ExpandMoreRounded />} sx={accordionSummarySx}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', width: '100%', pr: 2, gap: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      Step 1 · People & Escalation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Introduce the on-call crew, define escalation timing, and note any specialty departments we should know.
                    </Typography>
                  </Box>
                  <Chip
                    label={teamSectionComplete ? "✓ Complete" : `${onCall.team?.length || 0} members`}
                    color={teamSectionComplete ? "success" : "default"}
                    size="small"
                    sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={accordionDetailsSx}>
                <Stack spacing={3}>
                  <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                    <Tabs
                      value={activeTeamTab}
                      onChange={(_, value) => setActiveTeamTab(value)}
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                      <Tab label="Team Members" value={0} sx={{ textTransform: 'none', fontWeight: 600 }} />
                      <Tab label="Teams" value={1} sx={{ textTransform: 'none', fontWeight: 600 }} />
                      <Tab label="Escalation Plan" value={2} sx={{ textTransform: 'none', fontWeight: 600 }} />
                    </Tabs>
                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                      {activeTeamTab === 0 && (
                        <Box>
                          <EnhancedOnCallTeamSection
                            onCall={onCall}
                            setOnCall={setOnCall}
                            errors={errors.team || []}
                          />
                        </Box>
                      )}

                      {activeTeamTab === 1 && (
                        <Box>
                          <OnCallDepartmentsSection errors={errors.departments || []} onCall={onCall} setOnCall={setOnCall} />
                        </Box>
                      )}

                      {activeTeamTab === 2 && (
                        <Box>
                          <EscalationMatrixSection
                            steps={escalationPlan}
                            onChange={(next) => setOnCall({ escalation: next })}
                            errors={errors.escalation || []}
                          />
                        </Box>
                      )}
                    </Box>
                  </Paper>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={Boolean(expanded.coverage)}
              onChange={handleAccordionChange('coverage')}
              disableGutters
              sx={accordionStyle('warning')}
            >
              <AccordionSummary expandIcon={<ExpandMoreRounded />} sx={accordionSummarySx}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', width: '100%', pr: 2, gap: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                      Step 2 · Coverage & Schedule
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Explain when coverage switches hands and choose the schedule option that matches how your team rotates.
                    </Typography>
                  </Box>
                  <Chip
                    label={scheduleSectionComplete ? "✓ Complete" : "Action Required"}
                    color={scheduleSectionComplete ? "success" : "warning"}
                    size="small"
                    sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={accordionDetailsSx}>
                <Stack spacing={3}>
                  <OnCallScheduleSection
                    onCall={onCall}
                    setOnCall={setOnCall}
                    errors={errors.scheduleType || {}}
                  />

                  <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Rotation Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Tell us how often coverage changes, what triggers it, and when the rotation switches.
                    </Typography>
                    <OnCallRotationSection
                      data={onCall.rotation || {}}
                      onChange={(next) => setOnCall({ rotation: next })}
                      errors={errors.rotation || {}}
                    />
                  </Paper>
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={Boolean(expanded.procedures)}
              onChange={handleAccordionChange('procedures')}
              disableGutters
              sx={accordionStyle('success')}
            >
              <AccordionSummary expandIcon={<ExpandMoreRounded />} sx={accordionSummarySx}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', width: '100%', pr: 2, gap: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                      Step 3 · Contact Rules & Procedures
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Clarify when we should contact on-call staff, how many attempts to make, and communication preferences.
                    </Typography>
                  </Box>
                  <Chip
                    label={proceduresSectionComplete ? "✓ Complete" : "Optional"}
                    color={proceduresSectionComplete ? "success" : "default"}
                    size="small"
                    sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={accordionDetailsSx}>
                <Stack spacing={3}>
                  <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      When to Contact On-Call
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Define which situations warrant contacting your on-call personnel.
                    </Typography>
                    <OnCallContactRulesSection
                      data={onCall.contactRules || {}}
                      onChange={(next) => setOnCall({ contactRules: next })}
                      errors={errors.contactRules || {}}
                    />
                  </Paper>

                  <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Contact Procedures
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Specify how many contact attempts, escalation timing, and communication methods (voicemail, SMS, email).
                    </Typography>
                    <OnCallProceduresSection
                      data={onCall.procedures || {}}
                      onChange={(next) => setOnCall({ procedures: next })}
                      errors={errors.procedures || {}}
                    />
                  </Paper>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Fade>

        {/* Navigation */}
        <Fade in timeout={1400}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 2, md: 3 },
              mt: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: { xs: 2, sm: 0 },
              background: darkMode ? theme.palette.grey[900] : theme.palette.grey[50],
            }}
          >
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeRounded />}
              onClick={() => history.push(WIZARD_ROUTES.ANSWER_CALLS)}
              sx={{ minWidth: { xs: '100%', sm: 120 }, order: { xs: 3, sm: 1 } }}
            >
              Back
            </Button>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ order: { xs: 1, sm: 2 }, width: { xs: '100%', sm: 'auto' } }}>
              <Button
                variant="outlined"
                onClick={() => {
                  onSave();
                  setSnack({ open: true, msg: '💾 Progress saved! You can return anytime.', severity: 'success' });
                  setTimeout(() => {
                    history.push('/ClientInfoReact');
                  }, 1500);
                }}
                sx={{ fontWeight: 600, flex: { xs: 1, sm: 'initial' } }}
              >
                💾 Save & Exit
              </Button>
              <Button
                variant="contained"
                endIcon={<NavigateNextRounded />}
                onClick={() => { onSave(); onNext(); }}
                aria-label="Next: Call Routing"
                aria-live="polite"
                sx={{
                  minWidth: { xs: '100%', sm: 160 },
                  py: 1.5,
                  fontWeight: 600,
                  flex: { xs: 1, sm: 'initial' },
                }}
              >
                Next: Call Routing
              </Button>
            </Stack>
          </Paper>
        </Fade>

        {/* Keyboard Shortcuts Hint */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            💡 Tip: Use <kbd>Alt + →</kbd> for Next, <kbd>Alt + ←</kbd> for Back, <kbd>Ctrl + S</kbd> to Save
          </Typography>
        </Box>
      </Container>
      <Snackbar
        open={snack.open}
        autoHideDuration={2500}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity || 'success'} sx={{ width: '100%' }}>
          {snack.msg || 'Saved!'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OnCall;
