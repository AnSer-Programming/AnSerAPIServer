import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Container,
  Snackbar,
  Alert,
  Button,
  Typography,
  Fade,
  Chip,
  Stack,
} from '@mui/material';
import {
  NavigateNextRounded,
  NavigateBeforeRounded,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useHistory, useLocation } from 'react-router-dom';

// Navbar handled globally by WizardLayout
// Footer handled by WizardLayout
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';
import { WIZARD_ROUTES } from '../constants/routes';

import EnhancedOnCallTeamSection from '../sections/EnhancedOnCallTeamSection';
import EscalationMatrixSection from '../sections/EscalationMatrixSection';
import OnCallDepartmentsSection from '../sections/OnCallDepartmentsSection';
import OnCallRotationSection from '../sections/OnCallRotationSection';
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
  const location = useLocation();
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
  const [errors, setErrors] = React.useState({});
  const pathName = location.pathname;
  const currentStepKey = pathName.includes('/team-setup') || pathName.includes('/on-call/teams')
    ? 'teams'
    : (pathName.includes('/escalation-details') || pathName.includes('/on-call/escalation') || pathName.includes('/on-call-rotation'))
      ? 'escalation'
      : 'members';
  const currentStepSlug = currentStepKey === 'teams'
    ? 'team-setup'
    : currentStepKey === 'escalation'
      ? 'escalation-details'
      : 'on-call';

  const onSave = React.useCallback(() => {
    markStepVisited(currentStepSlug);
    setSnack({ open: true, msg: 'On-call information saved!', severity: 'success' });
  }, [currentStepSlug, markStepVisited]);

  const onNext = React.useCallback((nextRoute, errorKey, validateFn) => {
    markStepVisited(currentStepSlug);
    const collectedErrors = {};

    const stepErrors = validateFn ? validateFn() : null;
    if (stepErrors) {
      if (errorKey) {
        collectedErrors[errorKey] = stepErrors;
      } else {
        Object.assign(collectedErrors, stepErrors);
      }
    }

    if (Object.keys(collectedErrors).length) {
      setErrors(collectedErrors);
      setSnack({ open: true, msg: 'Some fields need attention. You can continue and fix them later.', severity: 'warning' });
    } else {
      setErrors({});
      setSnack({ open: true, msg: 'On-call details look good. Moving on!', severity: 'success' });
    }

    history.push(nextRoute);
  }, [currentStepSlug, markStepVisited, history]);

  useEffect(() => {
    setErrors({});
  }, [currentStepKey]);
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

  const teamCount = onCall.team?.length || 0;
  const departmentCount = onCall.departments?.length || 0;
  const escalationCount = escalationPlan.length;

  const stepConfig = {
    members: {
      title: 'Step 1 - On Call Setup',
      description: 'Add the on-call people we can contact and their preferred methods.',
      complete: teamCount > 0,
      chipLabel: teamCount > 0 ? 'Complete' : `${teamCount} members`,
      content: (
        <EnhancedOnCallTeamSection
          onCall={onCall}
          setOnCall={setOnCall}
          errors={errors.team || []}
        />
      ),
      backRoute: WIZARD_ROUTES.ANSWER_CALLS,
      nextRoute: WIZARD_ROUTES.ON_CALL_TEAMS,
      nextLabel: 'Next: Team Setup',
      errorKey: 'team',
      validateFn: () => validateSection?.('onCall.team', onCall.team || []),
    },
    teams: {
      title: 'Step 2 - Team Setup',
      description: 'Group on-call personnel into teams or departments for routing.',
      complete: departmentCount > 0,
      chipLabel: departmentCount > 0 ? 'Complete' : `${departmentCount} teams`,
      content: (
        <OnCallDepartmentsSection
          errors={errors.departments || []}
          onCall={onCall}
          setOnCall={setOnCall}
        />
      ),
      backRoute: WIZARD_ROUTES.ON_CALL,
      nextRoute: WIZARD_ROUTES.ON_CALL_ESCALATION,
      nextLabel: 'Next: Escalation & Rotation Details',
      errorKey: 'departments',
      validateFn: () => validateSection?.('onCall.departments', onCall.departments || []),
    },
    escalation: {
      title: 'Step 3 - Escalation & Rotation Details',
      description: 'Define escalation contacts, rotation schedule, and timing when primary contacts are unavailable.',
      complete: escalationCount > 0,
      chipLabel: escalationCount > 0 ? 'Complete' : `${escalationCount} steps`,
      content: (
        <Stack spacing={3}>
          <EscalationMatrixSection
            steps={escalationPlan}
            onChange={(next) => setOnCall({ escalation: next })}
            errors={errors.escalation || []}
          />
          <OnCallScheduleSection
            onCall={onCall}
            setOnCall={setOnCall}
            errors={errors.scheduleType || {}}
          />
          <OnCallRotationSection
            data={onCall.rotation || {}}
            onChange={(next) => setOnCall({ rotation: next })}
            errors={errors.rotation || {}}
          />
        </Stack>
      ),
      backRoute: WIZARD_ROUTES.ON_CALL_TEAMS,
      nextRoute: WIZARD_ROUTES.CALL_ROUTING,
      nextLabel: 'Next: Call Routing',
      errorKey: null,
      validateFn: () => {
        const escalationErrors = validateSection?.('onCall.escalation', escalationPlan);
        const rotationErrors = validateSection?.('onCall.rotation', onCall.rotation || {});
        const scheduleTypeErrors = validateSection?.('onCall.scheduleType', onCall);
        const collected = {};
        if (escalationErrors) collected.escalation = escalationErrors;
        if (rotationErrors) collected.rotation = rotationErrors;
        if (scheduleTypeErrors) collected.scheduleType = scheduleTypeErrors;
        return Object.keys(collected).length ? collected : null;
      },
    },
  };

  const currentStep = stepConfig[currentStepKey];

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + Right Arrow = Next step
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        onSave();
        onNext(currentStep.nextRoute, currentStep.errorKey, currentStep.validateFn);
      }
      // Alt + Left Arrow = Previous step
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        history.push(currentStep.backRoute);
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
  }, [currentStep, history, onSave, onNext]);

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
            <Box>
              <Typography id="oncall-title" component="h1" variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                On-Call Setup
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Configure when your on-call personnel are available and how they should be contacted for urgent matters.
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* Content */}
        <Fade in timeout={1000}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                backgroundColor: darkMode ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.06),
                overflow: 'hidden',
              }}
            >
              <Box sx={{ px: { xs: 2, md: 3 }, py: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 1 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    {currentStep.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentStep.description}
                  </Typography>
                </Box>
                <Chip
                  label={currentStep.chipLabel}
                  color={currentStep.complete ? "success" : "default"}
                  size="small"
                  sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                />
              </Box>
              <Box sx={{ px: { xs: 2, md: 3 }, pb: 3, pt: 0 }}>
                <Stack spacing={3}>
                  <Paper variant="outlined" sx={{ borderRadius: 2 }}>
  <Box sx={{ p: { xs: 2, md: 3 } }}>
    {currentStep.content}
  </Box>
</Paper>
                </Stack>
              </Box>
            </Paper>
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
              onClick={() => history.push(currentStep.backRoute)}
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
                onClick={() => {
                  onSave();
                  onNext(currentStep.nextRoute, currentStep.errorKey, currentStep.validateFn);
                }}
                aria-label={currentStep.nextLabel}
                aria-live="polite"
                sx={{
                  minWidth: { xs: '100%', sm: 160 },
                  py: 1.5,
                  fontWeight: 600,
                  flex: { xs: 1, sm: 'initial' },
                }}
              >
                {currentStep.nextLabel}
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



