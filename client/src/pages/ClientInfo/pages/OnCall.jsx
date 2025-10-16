import React from 'react';
import {
  Box,
  Paper,
  Container,
  Snackbar,
  Alert,
  Button,
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Fade,
  Card,
  CardContent,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  NavigateNextRounded,
  NavigateBeforeRounded,
  Schedule,
  AccessTime,
  SettingsApplications,
  ExpandMoreRounded,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

import ClientInfoNavbar from '../shared_layout_routing/ClientInfoNavbar';
import ClientInfoFooter from '../shared_layout_routing/ClientInfoFooter';
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';

import EnhancedOnCallTeamSection from '../sections/EnhancedOnCallTeamSection';
import OnCallRotationSection from '../sections/OnCallRotationSection';
import OnCallContactRulesSection from '../sections/OnCallContactRulesSection';
import OnCallProceduresSection from '../sections/OnCallProceduresSection';
import EscalationMatrixSection from '../sections/EscalationMatrixSection';
import OnCallDepartmentsSection from '../sections/OnCallDepartmentsSection';
import NotificationRulesSection from '../sections/NotificationRulesSection';

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
  const [expanded, setExpanded] = React.useState('coverage');
  const [errors, setErrors] = React.useState({});

  const handleAccordionChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onSave = () => {
    markStepVisited('on-call');
    setSnack({ open: true, msg: 'On-call information saved!', severity: 'success' });
  };

  const onNext = () => {
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

    const notificationRuleErrors = validateSection?.('onCall.notificationRules', onCall.notificationRules || {});
    if (notificationRuleErrors) {
      collectedErrors.notificationRules = notificationRuleErrors;
    }

    if (Object.keys(collectedErrors).length) {
      setErrors(collectedErrors);
      setSnack({ open: true, msg: 'Please review the highlighted on-call fields.', severity: 'error' });
    } else {
      setErrors({});
      setSnack({ open: true, msg: 'On-call details look good. Moving on!', severity: 'success' });
    }

    // Always proceed to next step
    history.push('/ClientInfoReact/NewFormWizard/final-details');
  };

  // Calculate completion percentage across three key steps
  const getCompletionPercentage = () => {
    const hasCoverage = Boolean(
      (onCall.schedules && onCall.schedules.length > 0) ||
      onCall.rotation?.doesNotChange ||
      onCall.rotation?.whenChanges?.trim() ||
      onCall.rotation?.frequency ||
      onCall.rotation?.changeBeginsTime ||
      onCall.rotation?.dayOrDate?.trim() ||
      onCall.rotation?.otherExplain?.trim()
    );

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
    const notificationPrefs = onCall.notificationRules || {};
    const hasNotificationRules = Boolean(
      (typeof notificationPrefs.callTypes === 'string' && notificationPrefs.callTypes.trim()) ||
      Object.entries(notificationPrefs).some(([key, value]) => key !== 'callTypes' && !!value)
    );

    const fields = [
      hasCoverage,
      onCall.team?.length > 0,
  hasEscalationPlan || hasDepartments,
      hasProcedures || hasNotificationRules,
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  const progress = getCompletionPercentage();
  const steps = ['Basic Info', 'What You Need', 'Call Handling', 'On-Call Setup', 'Review'];

  const softBg = (c) =>
    darkMode ? alpha(theme.palette[c].main, 0.12) : alpha(theme.palette[c].main, 0.06);
  const inputBg = darkMode ? alpha('#fff', 0.06) : theme.palette.common.white;
  
  const card = (c = 'primary') => ({
    p: 3,
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette[c].main, 0.25)}`,
    bgcolor: softBg(c),
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: `linear-gradient(90deg, ${theme.palette[c].main}, ${alpha(theme.palette[c].main, 0.7)})`,
    }
  });

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
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 0.5,
  };

  const accordionDetailsSx = {
    px: { xs: 2, md: 3 },
    pb: 3,
    pt: 0,
  };

  // === Enhanced On-Call Schedule Section ===
  const OnCallScheduleSection = ({ errors: scheduleErrorList = [] }) => {
    const schedules = onCall.schedules || [];
    const errorsArray = Array.isArray(scheduleErrorList) ? scheduleErrorList : [];

    const addSchedule = () => {
      const newSchedule = {
        id: Date.now(),
        startTime: '12:00:00 AM',
        endTime: '12:00:00 AM',
        recurrence: 'On Date',
        specificDate: new Date().toISOString().split('T')[0],
        recurrencePattern: 'Every Week',
        selectedDays: [],
        monthDay: 1,
        active: true
      };
      const newSchedules = [...schedules, newSchedule];
      setOnCall({ schedules: newSchedules });
    };

    const updateSchedule = (id, updates) => {
      const newSchedules = schedules.map(schedule => 
        schedule.id === id ? { ...schedule, ...updates } : schedule
      );
      setOnCall({ schedules: newSchedules });
    };

    const removeSchedule = (id) => {
      const newSchedules = schedules.filter(schedule => schedule.id !== id);
      setOnCall({ schedules: newSchedules });
    };

    const formatTime = (time24) => {
      if (!time24) return '12:00:00 AM';
      const [hours, minutes] = time24.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes}:00 ${ampm}`;
    };

    const parseTime = (time12) => {
      if (!time12) return '00:00';
      const [time, ampm] = time12.split(' ');
      const [hours, minutes] = time.split(':');
      let hour = parseInt(hours);
      if (ampm === 'PM' && hour !== 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
      return `${hour.toString().padStart(2, '0')}:${minutes}`;
    };

    return (
      <Paper sx={{ ...card('warning'), mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: alpha(theme.palette.warning.main, 0.15),
            color: theme.palette.warning.main 
          }}>
            <Schedule fontSize="medium" />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
              On-Call Personnel Schedule
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure when your on-call personnel are available for urgent calls
            </Typography>
          </Box>
        </Stack>

        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<Schedule />}
            onClick={addSchedule}
            sx={{ 
              mb: 2,
              background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${alpha(theme.palette.warning.main, 0.8)})`,
              '&:hover': {
                background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.9)}, ${alpha(theme.palette.warning.main, 0.7)})`,
              }
            }}
          >
            Add New Schedule
          </Button>
        </Box>

        {schedules.map((schedule, index) => {
          const scheduleError = errorsArray[index] || {};
          const hasScheduleError = Object.keys(scheduleError).length > 0;
          return (
            <Card 
              key={schedule.id} 
              sx={{ 
                mb: 2,
                border: `1px solid ${hasScheduleError ? alpha(theme.palette.error.main, 0.6) : alpha(theme.palette.warning.main, 0.3)}`,
                bgcolor: hasScheduleError ? alpha(theme.palette.error.main, 0.05) : alpha(theme.palette.warning.main, 0.05),
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: hasScheduleError
                    ? `linear-gradient(90deg, ${theme.palette.error.main}, ${alpha(theme.palette.error.main, 0.6)})`
                    : `linear-gradient(90deg, ${theme.palette.warning.main}, ${alpha(theme.palette.warning.main, 0.6)})`,
                }
              }}
            >
            <CardContent sx={{ pt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AccessTime color={hasScheduleError ? 'error' : 'warning'} fontSize="small" />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: hasScheduleError ? theme.palette.error.main : 'inherit' }}>
                    Schedule {index + 1}
                  </Typography>
                </Stack>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => removeSchedule(schedule.id)}
                  sx={{ borderRadius: 2 }}
                >
                  Remove
                </Button>
              </Box>

              {scheduleError.preview && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  {scheduleError.preview}
                </Typography>
              )}

              <Grid container spacing={2}>
              {/* Time Range */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Time Range
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    label="Start Time"
                    type="time"
                    value={parseTime(schedule.startTime)}
                    onChange={(e) => updateSchedule(schedule.id, { startTime: formatTime(e.target.value) })}
                    size="small"
                    sx={{ flex: 1, bgcolor: inputBg }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={Boolean(scheduleError.startTime)}
                    helperText={scheduleError.startTime || ''}
                  />
                  <Typography>to</Typography>
                  <TextField
                    label="End Time"
                    type="time"
                    value={parseTime(schedule.endTime)}
                    onChange={(e) => updateSchedule(schedule.id, { endTime: formatTime(e.target.value) })}
                    size="small"
                    sx={{ flex: 1, bgcolor: inputBg }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={Boolean(scheduleError.endTime)}
                    helperText={scheduleError.endTime || ''}
                  />
                </Box>
              </Grid>

              {/* Occurrence Pattern */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Occurs
                </Typography>
                <FormControl fullWidth size="small" error={Boolean(scheduleError.recurrence)}>
                  <Select
                    value={schedule.recurrence}
                    onChange={(e) => updateSchedule(schedule.id, { recurrence: e.target.value })}
                    sx={{ bgcolor: inputBg }}
                  >
                    <MenuItem value="On Date">On Date</MenuItem>
                    <MenuItem value="Every Week">Every Week</MenuItem>
                    <MenuItem value="1st Week">1st Week</MenuItem>
                    <MenuItem value="2nd Week">2nd Week</MenuItem>
                    <MenuItem value="3rd Week">3rd Week</MenuItem>
                    <MenuItem value="4th Week">4th Week</MenuItem>
                    <MenuItem value="Last Week">Last Week</MenuItem>
                    <MenuItem value="Every Month">Every Month</MenuItem>
                  </Select>
                  {scheduleError.recurrence && (
                    <FormHelperText>{scheduleError.recurrence}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Specific Date (if On Date is selected) */}
              {schedule.recurrence === 'On Date' && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Date
                  </Typography>
                  <TextField
                    type="date"
                    value={schedule.specificDate}
                    onChange={(e) => updateSchedule(schedule.id, { specificDate: e.target.value })}
                    fullWidth
                    size="small"
                    sx={{ bgcolor: inputBg }}
                    error={Boolean(scheduleError.specificDate)}
                    helperText={scheduleError.specificDate || ''}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              )}

              {/* Day of Week Selection (for weekly patterns) */}
              {schedule.recurrence.includes('Week') && schedule.recurrence !== 'On Date' && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Day of Week
                  </Typography>
                  <FormGroup row>
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                      <FormControlLabel
                        key={day}
                        control={
                          <Checkbox
                            checked={schedule.selectedDays?.includes(day) || false}
                            onChange={(e) => {
                              const selectedDays = schedule.selectedDays || [];
                              const newDays = e.target.checked
                                ? [...selectedDays, day]
                                : selectedDays.filter(d => d !== day);
                              updateSchedule(schedule.id, { selectedDays: newDays });
                            }}
                            size="small"
                          />
                        }
                        label={day.slice(0, 3)}
                      />
                    ))}
                  </FormGroup>
                  {scheduleError.selectedDays && (
                    <Typography variant="caption" color="error">
                      {scheduleError.selectedDays}
                    </Typography>
                  )}
                </Grid>
              )}

              {/* Day of Month (for monthly pattern) */}
              {schedule.recurrence === 'Every Month' && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Day of Month
                  </Typography>
                  <FormControl fullWidth size="small" error={Boolean(scheduleError.monthDay)}>
                    <Select
                      value={schedule.monthDay || 1}
                      onChange={(e) => updateSchedule(schedule.id, { monthDay: e.target.value })}
                      sx={{ bgcolor: inputBg }}
                    >
                      {Array.from({ length: 31 }, (_, i) => (
                        <MenuItem key={i + 1} value={i + 1}>{i + 1}</MenuItem>
                      ))}
                    </Select>
                    {scheduleError.monthDay && (
                      <FormHelperText>{scheduleError.monthDay}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              )}
            </Grid>

            {/* Preview */}
            <Box sx={{ mt: 2, p: 1, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                <strong>Schedule Preview:</strong> {schedule.startTime} - {schedule.endTime}
                {schedule.recurrence === 'On Date' && ` on ${schedule.specificDate}`}
                {schedule.recurrence.includes('Week') && schedule.selectedDays?.length > 0 && 
                  ` every ${schedule.recurrence.toLowerCase()} on ${schedule.selectedDays.join(', ')}`}
                {schedule.recurrence === 'Every Month' && ` on day ${schedule.monthDay} of each month`}
              </Typography>
              {scheduleError.preview && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                  {scheduleError.preview}
                </Typography>
              )}
            </Box>
            </CardContent>
          </Card>
          );
        })}

        {schedules.length === 0 && (
          <Card sx={{ p: 3, textAlign: 'center', bgcolor: alpha(theme.palette.grey[500], 0.1) }}>
            <CardContent>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
                <Schedule color="disabled" fontSize="large" />
                <Typography variant="h6" color="text.secondary">
                  No Schedules Configured
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Click "Add New Schedule" to set up when your personnel are available for urgent calls.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Paper>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: darkMode ? 'background.default' : '#f8fafc' }}>
      <ClientInfoNavbar />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Enhanced Header */}
        <Fade in timeout={800}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
              background: darkMode 
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                On-Call Setup
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Step 4 of 5
              </Typography>
            </Box>
            
            <Stepper activeStep={3} sx={{ mb: 2 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  flex: 1, 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                  }
                }} 
              />
              <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                {progress}%
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Configure when your on-call personnel are available and how they should be contacted for urgent matters.
            </Typography>
          </Paper>
        </Fade>

        {/* Content */}
        <Fade in timeout={1000}>
          <Stack spacing={3}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      color: theme.palette.primary.main,
                      display: 'inline-flex',
                    }}
                  >
                    <SettingsApplications fontSize="large" />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 0.5 }}>
                      Configure your on-call experience
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Work through each step to define coverage, contacts, and notification rules.
                    </Typography>
                  </Box>
                  <Chip
                    label={`${progress}% Complete`}
                    color={progress === 100 ? 'success' : progress >= 50 ? 'warning' : 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    mt: 3,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha(theme.palette.grey[500], 0.2),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      background: progress === 100
                        ? `linear-gradient(90deg, ${theme.palette.success.main}, ${alpha(theme.palette.success.main, 0.8)})`
                        : `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    },
                  }}
                />
              </CardContent>
            </Card>

            <Accordion
              expanded={expanded === 'coverage'}
              onChange={handleAccordionChange('coverage')}
              disableGutters
              sx={accordionStyle('warning')}
            >
              <AccordionSummary expandIcon={<ExpandMoreRounded />} sx={accordionSummarySx}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                  Step 1 · Coverage & Rotation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Describe when your on-call coverage changes and add specific schedule blocks.
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={accordionDetailsSx}>
                <Stack spacing={3}>
                  <OnCallRotationSection
                    data={onCall.rotation || {}}
                    onChange={(next) => setOnCall({ rotation: next })}
                    errors={errors.rotation || {}}
                  />
                  <OnCallScheduleSection errors={errors.schedules || []} />
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === 'team'}
              onChange={handleAccordionChange('team')}
              disableGutters
              sx={accordionStyle('error')}
            >
              <AccordionSummary expandIcon={<ExpandMoreRounded />} sx={accordionSummarySx}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.error.main }}>
                  Step 2 · Team & Escalation Plan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Capture your on-call team and define how escalation should flow when urgent help is needed.
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={accordionDetailsSx}>
                <Stack spacing={3}>
                  <EnhancedOnCallTeamSection
                    onCall={onCall}
                    setOnCall={setOnCall}
                    errors={errors.team || []}
                  />
                  <EscalationMatrixSection
                    steps={escalationPlan}
                    onChange={(next) => setOnCall({ escalation: next })}
                    errors={errors.escalation || []}
                  />
                  <OnCallDepartmentsSection errors={errors.departments || []} />
                </Stack>
              </AccordionDetails>
            </Accordion>

            <Accordion
              expanded={expanded === 'rules'}
              onChange={handleAccordionChange('rules')}
              disableGutters
              sx={accordionStyle('primary')}
            >
              <AccordionSummary expandIcon={<ExpandMoreRounded />} sx={accordionSummarySx}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  Step 3 · Contact Rules & Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tell us when to reach out and how to handle follow-ups during and after hours.
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={accordionDetailsSx}>
                <Stack spacing={3}>
                  <OnCallContactRulesSection
                    data={onCall.contactRules || {}}
                    onChange={(next) => setOnCall({ contactRules: next })}
                    errors={errors.contactRules || {}}
                  />
                  <NotificationRulesSection
                    data={onCall.notificationRules || {}}
                    onChange={(next) => setOnCall({ notificationRules: next })}
                    errors={errors.notificationRules || {}}
                  />
                  <OnCallProceduresSection
                    data={onCall.procedures || {}}
                    onChange={(next) => setOnCall({ procedures: next })}
                    errors={errors.procedures || {}}
                  />
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
              p: 3,
              mt: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: darkMode ? theme.palette.grey[900] : theme.palette.grey[50],
            }}
          >
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeRounded />}
              onClick={() => history.push('/ClientInfoReact/NewFormWizard/answer-calls')}
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
                Next: Final Details
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
      <ClientInfoFooter />
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
