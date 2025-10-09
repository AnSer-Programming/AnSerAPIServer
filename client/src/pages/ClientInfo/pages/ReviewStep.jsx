// 📁 src/pages/ClientInfo/pages/ReviewStep.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Container,
  Button,
  Divider,
  Typography,
  Snackbar,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import { useHistory } from 'react-router-dom';

import ClientInfoNavbar from '../shared_layout_routing/ClientInfoNavbar';
import ClientInfoFooter from '../shared_layout_routing/ClientInfoFooter';
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';
import { WIZARD_ROUTES } from '../constants/routes';

const Row = ({ label, value }) => (
  <Box sx={{ mb: 1.2 }}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="body2">{value || '-'}</Typography>
  </Box>
);

const Card = ({ title, onEdit, children, sx }) => (
  <Paper variant="outlined" sx={{ p: 2, ...sx }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
      {onEdit && <Button size="small" onClick={onEdit}>Edit</Button>}
    </Box>
    <Divider sx={{ my: 1.5 }} />
    <Box>{children}</Box>
  </Paper>
);

// helpers
const yn = (b) => (b ? 'Yes' : 'No');

const formatAttachmentSize = (bytes = 0) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 KB';
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

const formatContactValues = (value, fallback) => {
  const source = value ?? fallback;
  if (Array.isArray(source)) {
    return source
      .map((entry) => (entry == null ? '' : String(entry).trim()))
      .filter((entry) => entry.length > 0)
      .join(', ');
  }

  if (source == null) return '';
  const trimmed = String(source).trim();
  return trimmed;
};

const summarizeMemberContacts = (member = {}) => {
  const parts = [];
  const cell = formatContactValues(member.cellPhone, member.cell);
  const text = formatContactValues(member.textCell, member.text);
  const home = formatContactValues(member.homePhone, member.home);
  const pager = formatContactValues(member.pager, member.other);
  const email = formatContactValues(member.email, member.emails);

  if (cell) parts.push(`Cell: ${cell}`);
  if (text) parts.push(`Text: ${text}`);
  if (home) parts.push(`Home: ${home}`);
  if (pager) parts.push(`Pager: ${pager}`);
  if (email) parts.push(`Email: ${email}`);

  return parts.join(' • ');
};

const parseScheduleTime = (value) => {
  if (!value) return null;
  const str = String(value).trim();

  const meridiemMatch = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (meridiemMatch) {
    const rawHour = Number(meridiemMatch[1]);
    const minutes = Number(meridiemMatch[2]);
    if (Number.isNaN(rawHour) || Number.isNaN(minutes)) return null;
    const displayHour = rawHour % 12 || 12;
    const meridiem = meridiemMatch[4].toUpperCase();
    return { displayHour, minutes, meridiem };
  }

  const militaryMatch = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (militaryMatch) {
    const hour24 = Number(militaryMatch[1]);
    const minutes = Number(militaryMatch[2]);
    if (Number.isNaN(hour24) || Number.isNaN(minutes)) return null;
    const meridiem = hour24 >= 12 ? 'PM' : 'AM';
    const displayHour = hour24 % 12 || 12;
    return { displayHour, minutes, meridiem };
  }

  return null;
};

const formatScheduleTime = (value) => {
  const parsed = parseScheduleTime(value);
  if (!parsed) return value || '-';
  const minutes = parsed.minutes.toString().padStart(2, '0');
  return `${parsed.displayHour}:${minutes} ${parsed.meridiem}`;
};

const formatScheduleDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const ordinalSuffix = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return value;
  const abs = Math.abs(num);
  const mod100 = abs % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${num}th`;
  switch (abs % 10) {
    case 1:
      return `${num}st`;
    case 2:
      return `${num}nd`;
    case 3:
      return `${num}rd`;
    default:
      return `${num}th`;
  }
};

const formatSelectedDays = (days) => {
  if (!Array.isArray(days) || days.length === 0) return '';
  return days
    .map((day) => (day ? String(day).slice(0, 3) : ''))
    .filter(Boolean)
    .join(', ');
};

const MEETING_TYPE_MAP = {
  video: {
    label: 'Video Call',
    details: 'Microsoft Teams or Zoom',
  },
  phone: {
    label: 'Phone Call',
    details: 'Traditional phone consultation',
  },
  'in-person': {
    label: 'In-Person Meeting',
    details: 'Meet at our office',
  },
};

const CALL_TYPE_LABELS = {
  newLead: 'New customer or sales inquiry',
  existingClient: 'Existing client needs assistance',
  urgentIssue: 'Urgent or emergency issue',
  serviceRequest: 'Service or maintenance request',
  billingQuestion: 'Billing or account question',
};

const FAST_TRACK_PLATFORM_LABELS = {
  teams: 'Microsoft Teams',
  zoom: 'Zoom',
  phone: 'Phone Call',
  'google-meet': 'Google Meet',
  other: 'Other',
};

const meetingTimeToMinutes = (time) => {
  if (!time) return 0;
  const match = String(time).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return 0;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;
  const minutes = Number(match[2]);
  return hours * 60 + minutes;
};

const formatConsultationSlot = (slot) => {
  if (!slot?.date || !slot?.time) return null;
  const date = new Date(slot.date);
  if (!Number.isNaN(date.getTime())) {
    const label = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    return `${label} • ${slot.time}`;
  }
  return `${slot.date} • ${slot.time}`;
};

const describeSchedule = (schedule = {}) => {
  const hasTime = schedule.startTime || schedule.endTime;
  const range = hasTime
    ? `${formatScheduleTime(schedule.startTime)} – ${formatScheduleTime(schedule.endTime)}`
    : 'Time TBD';

  const recurrence = schedule.recurrence || '';

  if (!recurrence) {
    return range;
  }

  if (recurrence === 'On Date') {
    const dateLabel = formatScheduleDate(schedule.specificDate);
    return dateLabel ? `${range} • On ${dateLabel}` : `${range} • One-time schedule`;
  }

  if (recurrence === 'Every Month') {
    const dayLabel = ordinalSuffix(schedule.monthDay);
    return dayLabel ? `${range} • Monthly on the ${dayLabel}` : `${range} • Monthly`;
  }

  const daysLabel = formatSelectedDays(schedule.selectedDays);
  return daysLabel ? `${range} • ${recurrence} on ${daysLabel}` : `${range} • ${recurrence}`;
};

const ReviewStep = () => {
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const { formData, validateAll, markStepVisited } = useWizard();

  const [snack, setSnack] = useState(false);
  const [, setErrors] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay to ensure DOM is ready before animations
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const ci = formData.companyInfo || {};
  const ac = formData.answerCalls || { routine: {}, urgent: {}, callTypes: [] };
  const oc = formData.onCall || {
    rotation: {},
    contactRules: {},
    procedures: {},
    team: [],
    schedules: [],
    departments: [],
    escalation: [],
    notificationRules: {},
  };
  const escalationPlan = Array.isArray(oc.escalation) ? oc.escalation : [];
  const attachments = Array.isArray(formData.attachments) ? formData.attachments : [];
  const notificationRules = oc.notificationRules || {};
  const departments = oc.departments || [];
  const consultation = ci.consultationMeeting || {};
  const fastTrack = formData.fastTrack || {};
  const fastTrackEnabled = fastTrack.enabled === true;
  const fastTrackPayment = fastTrack.payment || {};
  const fastTrackContacts = Array.isArray(fastTrack.onCallContacts)
    ? fastTrack.onCallContacts.filter((contact) => contact && (
        contact.name || contact.phone || contact.email || contact.role || contact.availability
      ))
    : [];
  const fastTrackSlots = Array.isArray(fastTrack.callTypeSlots) ? fastTrack.callTypeSlots : [];
  const fastTrackMeeting = fastTrack.meeting || {};
  const fastTrackMeetingDate = fastTrackMeeting.date ? (formatScheduleDate(fastTrackMeeting.date) || fastTrackMeeting.date) : '-';
  const fastTrackMeetingTime = fastTrackMeeting.time ? (formatScheduleTime(fastTrackMeeting.time) || fastTrackMeeting.time) : '-';
  const fastTrackPlatformLabel = fastTrackMeeting.platform
    ? (FAST_TRACK_PLATFORM_LABELS[fastTrackMeeting.platform] || fastTrackMeeting.platform)
    : '-';
  const fastTrackPaymentSummary = (() => {
    const parts = [];
    if (fastTrackPayment.cardholderName) parts.push(fastTrackPayment.cardholderName);
    if (fastTrackPayment.cardBrand) parts.push(fastTrackPayment.cardBrand);
    if (fastTrackPayment.cardLast4) parts.push(`**** ${fastTrackPayment.cardLast4}`);
    return parts.length ? parts.join(' • ') : 'Details pending';
  })();
  const consultationSlots = Array.isArray(consultation.selectedDateTimes)
    ? consultation.selectedDateTimes.filter((slot) => slot && (slot.date || slot.time))
    : [];
  const sortedConsultationSlots = consultationSlots.slice().sort((a, b) => {
    const dateA = a?.date ? new Date(a.date) : null;
    const dateB = b?.date ? new Date(b.date) : null;
    const validA = dateA && !Number.isNaN(dateA.getTime());
    const validB = dateB && !Number.isNaN(dateB.getTime());

    if (validA && validB && dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }

    if (validA !== validB) {
      return validA ? -1 : 1;
    }

    return meetingTimeToMinutes(a?.time) - meetingTimeToMinutes(b?.time);
  });
  const formattedConsultationSlots = sortedConsultationSlots
    .map((slot) => formatConsultationSlot(slot))
    .filter(Boolean);
  const meetingTypeMeta = consultation.meetingType ? MEETING_TYPE_MAP[consultation.meetingType] : null;
  const meetingTypeSummary = meetingTypeMeta
    ? `${meetingTypeMeta.label}${meetingTypeMeta.details ? ` — ${meetingTypeMeta.details}` : ''}`
    : (consultation.meetingType ? consultation.meetingType : '-');

  const eh = ci.officeHours || {};
  const lunch = ci.lunchHours || {};
  const observedHolidayDates = Array.isArray(ci.holidays) ? ci.holidays : [];
  const formattedObservedHolidays = observedHolidayDates
    .map((date) => {
      const parsed = new Date(`${date}T00:00:00Z`);
      if (Number.isNaN(parsed.getTime())) return String(date);
      return parsed.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    })
    .filter(Boolean);

  const websiteAccess = ci.websiteAccess || {};
  const websiteRequiredLabel = websiteAccess.required ? 'Yes' : 'No';
  const loginRequired = websiteAccess.requiresLogin;
  const loginRequiredLabel = loginRequired === true
    ? 'Yes'
    : loginRequired === false
      ? 'No'
      : 'Not specified';
  const mfaLabel = loginRequired === true
    ? (websiteAccess.requiresMFA === true
      ? 'Yes'
      : websiteAccess.requiresMFA === false
        ? 'No'
        : 'Not specified')
    : loginRequired === false
      ? 'Not applicable'
      : 'Not specified';
  const handlingLabel = loginRequired === true
    ? (websiteAccess.difficulty && websiteAccess.difficulty !== 'unknown'
      ? websiteAccess.difficulty === 'easy'
        ? 'Web Easy'
        : websiteAccess.difficulty === 'hard'
          ? 'Web Hard'
          : websiteAccess.difficulty
      : 'Not specified')
    : loginRequired === false
      ? 'Not applicable'
      : 'Not specified';
  const websiteFlags = [
    websiteAccess.hasCAPTCHA && 'CAPTCHA present',
    websiteAccess.autoLogoutAggressive && 'Aggressive auto-logout',
    websiteAccess.testComplete && 'Login test completed',
    websiteAccess.missingInfo && 'Info still missing',
  ].filter(Boolean);
  const websiteList = Array.isArray(websiteAccess.sites)
    ? websiteAccess.sites.filter((site) => site && site.url)
    : [];

  const handleSubmit = () => {
    markStepVisited('review');
    const errs = validateAll(formData);
    if (errs) {
      setErrors(errs);
      setSnack(true);
      return;
    }
    alert('🎉 Submitted successfully!');
  };

  // derive readable rotation string
  const rot = oc.rotation || {};
  const rotationSummary = rot.doesNotChange
    ? 'On-call does not change'
    : [
        rot.frequency ? `Frequency: ${rot.frequency}` : null,
        rot.whenChanges ? `When: ${rot.whenChanges}` : null,
        rot.changeBeginsTime ? `Begins: ${rot.changeBeginsTime}` : null,
        rot.dayOrDate ? `Day/Date: ${rot.dayOrDate}` : null,
        rot.otherExplain ? `Other: ${rot.otherExplain}` : null,
      ].filter(Boolean).join(' • ');

  // contact rules summary
  const cr = oc.contactRules || {};
  const rulesList = [
    cr.allCalls && 'All calls',
    cr.callerCannotWait && 'Caller says it cannot wait',
    cr.holdAllCalls && 'Hold all calls',
    cr.emergencyOnly && 'Emergency only',
    cr.specificCallTypes && 'Specific call types',
  ].filter(Boolean);
  const rulesSummary = rulesList.length ? rulesList.join(' • ') : '-';

  // procedures quick params
  const pr = oc.procedures || {};
  const qp = [
    pr.attempts != null && pr.attempts !== '' ? `Attempts: ${pr.attempts}` : null,
    pr.minutesBetweenAttempts != null && pr.minutesBetweenAttempts !== '' ? `Gap: ${pr.minutesBetweenAttempts} min` : null,
    pr.escalateAfterMinutes != null && pr.escalateAfterMinutes !== '' ? `Escalate after: ${pr.escalateAfterMinutes} min` : null,
    pr.escalateTo ? `Escalate to: ${pr.escalateTo}` : null,
    `Stop after contact: ${yn(!!pr.stopAfterSuccessfulContact)}`,
    `Leave VM: ${yn(!!pr.leaveVoicemail)}`,
    `SMS ok: ${yn(!!pr.smsOk)}`,
    `Email ok: ${yn(!!pr.emailOk)}`,
  ].filter(Boolean).join(' • ');

  const notificationSummary = (() => {
    const flags = [];
    if (notificationRules.allCalls) flags.push('All messages');
    if (notificationRules.holdAll) flags.push('Hold all dispatches');
    if (notificationRules.cannotWait) flags.push('Caller cannot wait');
    if (notificationRules.emergencyOnly) flags.push('Emergency only');
    if (notificationRules.callTypes) flags.push(`Specific: ${notificationRules.callTypes}`);
    return flags.length ? flags.join(' • ') : '-';
  })();

  const structuredCallTypes = (() => {
    const raw = ac.callTypes;
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      return Object.entries(raw)
        .filter(([key, value]) => key !== 'otherText' && value?.enabled)
        .map(([key, value]) => ({
          key,
          label: CALL_TYPE_LABELS[key] || key,
          instructions: value?.instructions || '',
          differsAfterHours: value?.differsAfterHours,
          afterHoursInstructions: value?.afterHoursInstructions || '',
        }));
    }
    return [];
  })();

  const legacyCallTypes = Array.isArray(ac.callTypes) ? ac.callTypes : [];

  const otherCallTypeNotes = (() => {
    if (ac.callTypes && typeof ac.callTypes === 'object' && !Array.isArray(ac.callTypes)) {
      return ac.callTypes.otherText?.toString().trim() || '';
    }
    return '';
  })();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: darkMode ? 'background.default' : '#f5f6f8' }}>
      <ClientInfoNavbar />

      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* Modern Header Section */}
        {mounted && (
          <Box sx={{ 
            textAlign: 'center', 
            mb: 4,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            borderRadius: 3,
            p: 4,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3Ccircle cx="13" cy="13" r="3"/%3E%3C/g%3E%3C/svg%3E")',
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                Review & Submit
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                Please review all information before submitting
              </Typography>
              <Chip 
                label="Final Review" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: 2
                }} 
              />
            </Box>
          </Box>
        )}

        <Stack spacing={3}>
          {mounted && fastTrackEnabled && (
            <Card
              title="Fast Track Launch"
              onEdit={() => history.push(WIZARD_ROUTES.FAST_TRACK)}
              sx={{ backgroundColor: 'rgba(25, 118, 210, 0.035)' }}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Payment Authorization</Typography>
                  <Typography variant="body2">{fastTrackPaymentSummary}</Typography>
                  <Typography variant="body2">Billing ZIP: {fastTrackPayment.billingZip || '-'}</Typography>
                  <Typography variant="body2">Rush Fee Accepted: {yn(!!fastTrackPayment.rushFeeAccepted)}</Typography>
                  <Typography variant="body2">Authorization: {fastTrackPayment.authorization ? 'Approved' : 'Pending'}</Typography>
                  {fastTrackPayment.notes && (
                    <Typography variant="body2" color="text.secondary">Notes: {fastTrackPayment.notes}</Typography>
                  )}
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Launch Week Contacts</Typography>
                  {fastTrackContacts.length ? (
                    <Stack spacing={1}>
                      {fastTrackContacts.map((contact, idx) => (
                        <Box key={contact.id || idx}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {contact.name || `Contact ${idx + 1}`}
                            {contact.role ? ` — ${contact.role}` : ''}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {contact.phone ? `Phone: ${contact.phone}` : 'Phone: -'}
                            {contact.email ? ` • Email: ${contact.email}` : ''}
                            {contact.availability ? ` • ${contact.availability}` : ''}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">Fast Track contacts pending.</Typography>
                  )}
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Rapid Call Types</Typography>
                  {fastTrackSlots.length ? (
                    <Stack spacing={1}>
                      {fastTrackSlots.map((slot, idx) => (
                        <Box key={slot.id || idx}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{slot.label || slot.id || `Scenario ${idx + 1}`}</Typography>
                          <Typography variant="body2" color={slot.instructions ? 'text.primary' : 'text.secondary'}>
                            {slot.instructions || 'Instructions pending.'}
                          </Typography>
                          {slot.afterHoursNotes && (
                            <Typography variant="caption" color="text.secondary">
                              After-hours: {slot.afterHoursNotes}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">No rapid call type guidance provided.</Typography>
                  )}
                </Box>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Kickoff Meeting</Typography>
                  <Typography variant="body2">Platform: {fastTrackPlatformLabel}</Typography>
                  <Typography variant="body2">Preferred: {fastTrackMeetingDate} at {fastTrackMeetingTime}</Typography>
                  {fastTrackMeeting.timezone && (
                    <Typography variant="body2">Timezone: {fastTrackMeeting.timezone}</Typography>
                  )}
                  {fastTrackMeeting.notes && (
                    <Typography variant="body2" color="text.secondary">Notes: {fastTrackMeeting.notes}</Typography>
                  )}
                </Box>
              </Stack>
            </Card>
          )}

          {mounted && (
            <Card
              title="Company Information"
              onEdit={() => history.push('/ClientInfoReact/NewFormWizard/company-info')}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Row label="Company Name" value={ci.companyName || ci.company} />
                <Row label="Address" value={ci.address || ci.physicalAddress} />
                <Row label="Time Zone" value={ci.timeZone} />
              </Box>
            </Card>
          )}

          {mounted && (
            <Card
              title="Office Hours"
              onEdit={() => history.push('/ClientInfoReact/NewFormWizard/office-reach')}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                {Object.entries(eh).map(([day, v]) => (
                  <Typography key={day} variant="body2">
                    <strong style={{ textTransform: 'capitalize' }}>{day}:</strong>{' '}
                    {v?.closed ? 'Closed' : `${v?.open} – ${v?.close}`}
                  </Typography>
                ))}
                <Typography variant="body2">
                  <strong>Lunch:</strong>{' '}
                  {lunch?.enabled ? `${lunch.open} – ${lunch.close}` : 'None'}
                </Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Observed Holiday Dates
              </Typography>
              {formattedObservedHolidays.length > 0 ? (
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {formattedObservedHolidays.map((date) => (
                    <Chip key={date} label={date} variant="outlined" />
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No specific holiday dates provided yet.
                </Typography>
              )}
            </Card>
          )}

          {/* Updated Answer Calls summary (Routine/Urgent + Call Types) */}
          {mounted && (
            <Card
              title="Answer Calls"
              onEdit={() => history.push('/ClientInfoReact/NewFormWizard/answer-calls')}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Row
                  label="Routine Greeting"
                  value={
                    ac.routine?.useStandard
                      ? 'Standard phrase'
                      : ac.routine?.custom
                  }
                />
                <Row
                  label="Urgent Greeting"
                  value={
                    ac.urgent?.useStandard
                      ? 'Standard phrase'
                      : ac.urgent?.custom
                  }
                />
                <Row label="Routine Guidelines" value={ac.routine?.guidelines} />
                <Row label="Urgent Guidelines" value={ac.urgent?.guidelines} />
              </Box>

              {(structuredCallTypes.length > 0 || legacyCallTypes.length > 0 || otherCallTypeNotes) && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Call Types
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 0.5 }}>
                    {structuredCallTypes.map((entry) => (
                      <Typography key={entry.key} variant="body2">
                        • {entry.label}
                        {entry.instructions ? ` — ${entry.instructions}` : ''}
                        {entry.differsAfterHours === true
                          ? ` (After-hours: ${entry.afterHoursInstructions || 'Process differs'})`
                          : entry.differsAfterHours === false
                            ? ' (Same after hours)'
                            : ''}
                      </Typography>
                    ))}

                    {legacyCallTypes.map((ct, idx) => (
                      <Typography key={`legacy-${idx}`} variant="body2">
                        • {ct?.name || `Type ${idx + 1}`} {ct?.instructions ? `— ${ct.instructions}` : ''}
                      </Typography>
                    ))}

                    {otherCallTypeNotes && (
                      <Typography variant="body2">
                        • Other notes: {otherCallTypeNotes.replace(/\s*\n\s*/g, '; ')}
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </Card>
          )}

          {/* NEW: On Call summary */}
          {mounted && (
            <Card
              title="On Call"
              onEdit={() => history.push('/ClientInfoReact/NewFormWizard/on-call')}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Row label="Rotation" value={rotationSummary} />
                <Row label="Contact Rules" value={rulesSummary} />
                {cr?.emergencyOnly && (
                  <Row label="Emergency Definition" value={cr?.emergencyDefinition} />
                )}
                {cr?.specificCallTypes && (
                  <Row label="Specific Call Types" value={cr?.specificTypes} />
                )}
                <Row label="On Call Procedures" value={pr?.onCallProcedures} />
                <Row
                  label="Business Hours Procedure"
                  value={
                    pr?.businessHoursSameAsOnCall
                      ? 'Same as on-call procedures'
                      : pr?.businessHoursNotification
                  }
                />
                <Row label="Notification Parameters" value={qp} />
                <Row label="Notification Rules" value={notificationSummary} />
              </Box>

              {Array.isArray(oc.team) && oc.team.length > 0 && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    On Call Team
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 0.5 }}>
                    {oc.team.map((m, idx) => (
                      <Typography key={idx} variant="body2">
                        {(() => {
                          const name = m?.name || `Member ${idx + 1}`;
                          const title = m?.title ? `, ${m.title}` : '';
                          const contacts = summarizeMemberContacts(m);
                          return `• ${name}${title}${contacts ? ` — ${contacts}` : ''}`;
                        })()}
                      </Typography>
                    ))}
                  </Box>
                </>
              )}

              {Array.isArray(oc.schedules) && oc.schedules.length > 0 && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    On Call Schedules
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 1 }}>
                    {oc.schedules.map((schedule, idx) => (
                      <Box key={schedule?.id ?? idx}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {`Schedule ${idx + 1}`} {schedule?.active === false && (
                            <Typography component="span" variant="caption" color="error" sx={{ ml: 1 }}>
                              Inactive
                            </Typography>
                          )}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {describeSchedule(schedule)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}

              {Array.isArray(departments) && departments.length > 0 && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    On-Call Departments
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 0.5 }}>
                    {departments.map((dept, idx) => (
                      <Typography key={idx} variant="body2">
                        • {dept?.department || `Department ${idx + 1}`}
                        {dept?.contact ? ` — ${dept.contact}` : ''}
                      </Typography>
                    ))}
                  </Box>
                </>
              )}
            </Card>
          )}

          {mounted && (
            <Card
              title="Consultation Preferences"
              onEdit={() => history.push('/ClientInfoReact/NewFormWizard/final-details')}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Row label="Preferred Meeting Type" value={meetingTypeSummary} />
                <Row label="Primary Contact" value={consultation.contactPerson} />
                <Row label="Contact Email" value={consultation.contactEmail} />
                <Row label="Contact Phone" value={consultation.contactPhone} />
                <Row label="Notes" value={consultation.notes} />
              </Box>

              {formattedConsultationSlots.length > 0 && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Available Meeting Times
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 0.5 }}>
                    {formattedConsultationSlots.map((slotLabel, idx) => (
                      <Typography key={sortedConsultationSlots[idx]?.id ?? idx} variant="body2">
                        • {slotLabel}
                      </Typography>
                    ))}
                  </Box>
                </>
              )}
            </Card>
          )}

          {mounted && (
            <Card
              title="Daily Summary Preferences"
              onEdit={() => history.push('/ClientInfoReact/NewFormWizard/office-reach')}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Row
                  label="Daily recap of all messages"
                  value={
                    ci.summaryPreferences?.dailyRecapEnabled === true
                      ? 'Yes'
                      : ci.summaryPreferences?.dailyRecapEnabled === false
                        ? 'No'
                        : 'Not specified'
                  }
                />
                <Row
                  label="Real-time message delivery"
                  value={
                    Array.isArray(ci.summaryPreferences?.realTimeChannels) && ci.summaryPreferences.realTimeChannels.length
                      ? ci.summaryPreferences.realTimeChannels
                          .map((channel) => {
                            switch (channel) {
                              case 'email':
                                return 'Email';
                              case 'text':
                                return 'Text';
                              case 'fax':
                                return 'Fax';
                              default:
                                return channel;
                            }
                          })
                          .join(', ')
                      : 'Not specified'
                  }
                />
              </Box>
            </Card>
          )}

          {mounted && (
            <Card
              title="Website Access"
              onEdit={() => history.push('/ClientInfoReact/NewFormWizard/company-info')}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Row label="Use a website during calls" value={websiteRequiredLabel} />
                <Row label="Login required" value={loginRequiredLabel} />
                <Row label="Multi-factor authentication" value={mfaLabel} />
                <Row label="Handling complexity" value={handlingLabel} />
                <Row
                  label="CAPTCHA present"
                  value={loginRequired === true ? yn(!!websiteAccess.hasCAPTCHA) : loginRequired === false ? 'Not applicable' : 'Not specified'}
                />
                <Row
                  label="Aggressive auto-logout"
                  value={loginRequired === true ? yn(!!websiteAccess.autoLogoutAggressive) : loginRequired === false ? 'Not applicable' : 'Not specified'}
                />
                <Row
                  label="Login test completed"
                  value={loginRequired === true ? yn(!!websiteAccess.testComplete) : loginRequired === false ? 'Not applicable' : 'Not specified'}
                />
                <Row label="Info still missing" value={yn(!!websiteAccess.missingInfo)} />
              </Box>

              {websiteAccess.requiresLogin && websiteList.length > 0 && (
                <>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Websites & Credentials
                  </Typography>
                  <Box sx={{ display: 'grid', gap: 0.5 }}>
                    {websiteList.map((site, idx) => (
                      <Typography key={idx} variant="body2">
                        • {site.url}
                        {site.username ? ` — user: ${site.username}` : ''}
                        {site.notes ? ` — ${site.notes}` : ''}
                      </Typography>
                    ))}
                  </Box>
                </>
              )}

              {websiteAccess.requiresLogin && websiteFlags.length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                  Notes: {websiteFlags.join(', ')}
                </Typography>
              )}
            </Card>
          )}

          {mounted && (
            <Card
              title="Billing Contact"
              onEdit={() => history.push('/ClientInfoReact/NewFormWizard/final-details')}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                <Row label="Name" value={ci.billingContact?.name} />
                <Row label="Email" value={ci.billingContact?.email} />
                <Row label="Phone" value={ci.billingContact?.phone} />
                <Row label="PO" value={ci.billingContact?.purchaseOrder} />
                <Row label="Title" value={ci.billingContact?.title} />
                <Row label="Notes" value={ci.billingContact?.notes} />
              </Box>
            </Card>
          )}

          {mounted && (
            <Card
              title="Escalation Plan"
              onEdit={() => history.push('/ClientInfoReact/NewFormWizard/on-call')}
            >
              {escalationPlan.length ? (
                <Box sx={{ display: 'grid', gap: 1.5 }}>
                  {escalationPlan.map((step = {}, idx) => {
                    const headline = step.name?.toString().trim() || `Escalation Step ${idx + 1}`;
                    const details = [
                      step.role?.toString().trim() ? `Role: ${step.role}` : null,
                      step.contact?.toString().trim() ? `Contact: ${step.contact}` : null,
                      step.window?.toString().trim() ? `Window: ${step.window}` : null,
                    ].filter(Boolean);

                    return (
                      <Box key={step.id || idx}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Step {idx + 1}: {headline}
                        </Typography>
                        {details.length > 0 && (
                          <Typography variant="body2" color="text.secondary">
                            {details.join(' • ')}
                          </Typography>
                        )}
                        {step.notes?.toString().trim() && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Notes: {step.notes}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No escalation contacts have been provided yet.
                </Typography>
              )}
            </Card>
          )}

          {/* Enhanced Navigation */}
          {mounted && (
            <Card
              title="Attachments"
              onEdit={() => history.push('/ClientInfoReact/NewFormWizard/final-details')}
            >
              {attachments.length ? (
                <Box sx={{ display: 'grid', gap: 1 }}>
                  {attachments.map((file, idx) => (
                    <Box key={file.id || idx}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {file.name || `Attachment ${idx + 1}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(file.type || 'Unknown type')} • {formatAttachmentSize(file.size)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No supporting documents provided.
                </Typography>
              )}
            </Card>
          )}

          {mounted && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 4,
              gap: 2
            }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => history.push('/ClientInfoReact/NewFormWizard/final-details')}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                ← Back to Final Details
              </Button>
              <Button 
                variant="contained" 
                size="large"
                onClick={handleSubmit}
                sx={{
                  background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1b5e20 0%, #388e3c 100%)',
                    boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)',
                  }
                }}
              >
                Submit Application →
              </Button>
            </Box>
          )}
        </Stack>
      </Container>

      <ClientInfoFooter />

      <Snackbar open={snack} autoHideDuration={3000} onClose={() => setSnack(false)}>
        <Alert severity="error" sx={{ width: '100%' }}>
          Please fix all required fields before submitting.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewStep;
