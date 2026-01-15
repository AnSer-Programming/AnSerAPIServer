// 📁 src/pages/ClientInfo/pages/ReviewStep.jsx

import React, { useState, useEffect, useMemo } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useHistory } from 'react-router-dom';

// Navbar handled by WizardLayout
// Footer handled by WizardLayout
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';
import { WIZARD_ROUTES } from '../constants/routes';
import { sendSummaryEmail } from '../context_API/ClientWizardAPI';
import InfoPagePreview from '../components/InfoPagePreview';
import logger from '../utils/logger';

// Mapping for meeting types used in the Final Details / Review step
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

// Mapping for call type labels
const CALL_TYPE_LABELS = {
  newLead: 'New Lead/Inquiry',
  existingClient: 'Existing Client',
  urgentIssue: 'Urgent Issue',
  serviceRequest: 'Service Request',
  billingQuestion: 'Billing Question',
};

// Simple boolean formatter used in the review view
const yn = (b) => (b ? 'Yes' : 'No');

// Helper to summarize member contact info
const summarizeMemberContacts = (member) => {
  if (!member) return '';
  const parts = [];

  // Get first non-empty value from arrays or single values
  const getFirst = (val) => {
    if (Array.isArray(val)) {
      const first = val.find(v => v && String(v).trim());
      return first ? String(first).trim() : '';
    }
    return val && String(val).trim() ? String(val).trim() : '';
  };

  const cell = getFirst(member.cellPhone);
  const email = getFirst(member.email);

  if (cell) parts.push(cell);
  if (email) parts.push(email);

  return parts.join(', ');
};

// Small Card wrapper used in the review view (title + optional Edit action)
const Card = ({ title, onEdit, children, sx = {} }) => (
  <Paper variant="outlined" sx={{ p: 2, ...sx }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
      {onEdit && <Button size="small" onClick={onEdit}>Edit</Button>}
    </Box>
    <Divider sx={{ my: 1.5 }} />
    <Box>{children}</Box>
  </Paper>
);


const Row = ({ label, value }) => (
  <Box sx={{ mb: 1.2 }}>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="body2">{value || '-'}</Typography>
  </Box>
);

const ReviewStep = () => {
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const { formData, validateAll, markStepVisited, exportFormData } = useWizard();

  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summaryDialog, setSummaryDialog] = useState({ open: false, text: '', accountName: '' });
  const [, setErrors] = useState(null);
  const [mounted, setMounted] = useState(false);

  const showToast = (message, severity = 'info') => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const openSummaryDialog = (text, accountName) => {
    setSummaryDialog({ open: true, text, accountName });
  };

  const closeSummaryDialog = () => {
    setSummaryDialog((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    // Small delay to ensure DOM is ready before animations
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Review & submit — AnSer Communications';
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; created = true; }
    meta.content = 'Review your AnSer setup details and submit the intake form to start the onboarding process.';
    if (created) document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      if (created && meta && meta.parentNode) meta.parentNode.removeChild(meta);
    };
  }, []);

  // Memoize form data sections to prevent unnecessary recalculations
  const { ci, ac, oc, escalationPlan, attachments, notificationRules, departments, consultation, fastTrack, fastTrackEnabled } = useMemo(() => {
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
    return {
      ci,
      ac,
      oc,
      escalationPlan: Array.isArray(oc.escalation) ? oc.escalation : [],
      attachments: Array.isArray(formData.attachments) ? formData.attachments : [],
      notificationRules: oc.notificationRules || {},
      departments: oc.departments || [],
      consultation: ci.consultationMeeting || {},
      fastTrack: formData.fastTrack || {},
      fastTrackEnabled: formData.fastTrack?.enabled === true,
    };
  }, [formData]);

  const featureFastTrackEnabled = process.env.REACT_APP_FASTTRACK_ENABLED === 'true';

  // Memoize consultation slots processing
  const { sortedConsultationSlots, formattedConsultationSlots, meetingTypeSummary } = useMemo(() => {
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
    
    return { sortedConsultationSlots, formattedConsultationSlots, meetingTypeSummary };
  }, [consultation]);

  const eh = ci.officeHours || {};
  const lunch = ci.lunchHours || {};
  const summaryPreferences = ci.summaryPreferences || {};

  // Memoize holiday formatting
  const formattedObservedHolidays = useMemo(() => {
    const observedHolidayDates = Array.isArray(ci.holidays) ? ci.holidays : [];
    return observedHolidayDates
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
  }, [ci.holidays]);

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

  const handleSubmit = async () => {
    if (isSubmitting) return;

    markStepVisited('review');
    const errs = validateAll(formData);
    if (errs) {
      setErrors(errs);
      showToast('Please fix all required fields before submitting.', 'error');
      return;
    }

    setIsSubmitting(true);

    const parseDelimitedList = (value) => {
      if (!value || typeof value !== 'string') return [];
      return value
        .split(/[\n,;]+/)
        .map((entry) => entry.trim())
        .filter(Boolean);
    };

    const sanitizeFax = (value) => value.replace(/[^0-9+()\-\s]/g, '');

    const emailRecipients = parseDelimitedList(summaryPreferences.email);
    const faxRecipients = parseDelimitedList(summaryPreferences.faxNumber).map(sanitizeFax);
    const summaryText = typeof exportFormData === 'function' ? exportFormData('summary') : '';

    const sendInternallyOnly = emailRecipients.length === 0 && faxRecipients.length === 0;

    const summaryPayload = {
      accountName:
        ci.businessName || ci.companyName || ci.company || ci.physicalLocation || 'New AnSer Account',
      submittedAt: new Date().toISOString(),
      recipients: {
        emails: emailRecipients,
        faxNumbers: faxRecipients,
        realTimeChannels: Array.isArray(summaryPreferences.realTimeChannels)
          ? summaryPreferences.realTimeChannels
          : [],
      },
      preferences: {
        dailyRecapEnabled: summaryPreferences.dailyRecapEnabled,
        recapSchedule: summaryPreferences.recapSchedule || {},
        recapDelivery: summaryPreferences.recap?.delivery || {},
        sendEvenIfQuiet: summaryPreferences.alwaysSendEvenIfNoMessages,
        reportSpamHangups: summaryPreferences.reportSpamHangups,
      },
      fastTrackEnabled,
      sendInternallyOnly,
      summaryText,
      formData,
    };

    try {
      const response = await sendSummaryEmail(summaryPayload);
      if (!response || !response.ok) {
        throw new Error('Summary API returned an error response.');
      }

      const successMessage = sendInternallyOnly
        ? 'Application submitted. No external summary recipients were configured, so an internal copy was sent to the AnSer launch team.'
        : 'Application submitted and summary email sent!';
      showToast(successMessage, 'success');
      if (typeof summaryText === 'string' && summaryText.trim().length) {
        openSummaryDialog(summaryText, summaryPayload.accountName);
      }
    } catch (error) {
      logger.error('Failed to send automated summary email:', error);
      showToast(
        'Application saved, but the summary email did not send. Please retry or contact support.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySummary = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(summaryDialog.text || '');
        showToast('Summary copied to clipboard.', 'success');
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch (error) {
      logger.error('Failed to copy summary text:', error);
      showToast('Unable to copy automatically. Please select the text and copy manually.', 'warning');
    }
  };

  const handleDownloadSummary = () => {
    try {
      const text = summaryDialog.text || '';
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStamp = new Date().toISOString().slice(0, 10);
      const safeName = (summaryDialog.accountName || 'anser-summary')
        .replace(/[^a-z0-9\-]+/gi, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase();
      link.href = url;
      link.download = `${safeName || 'anser-summary'}-${dateStamp}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('Summary downloaded.', 'success');
    } catch (error) {
      logger.error('Failed to download summary text:', error);
      showToast('Unable to download summary. Please try again.', 'error');
    }
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

  // Memoize call types processing
  const { structuredCallTypes, legacyCallTypes, otherCallTypeNotes } = useMemo(() => {
    const raw = ac.callTypes;
    let structuredCallTypes = [];
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      structuredCallTypes = Object.entries(raw)
        .filter(([key, value]) => key !== 'otherText' && value?.enabled)
        .map(([key, value]) => ({
          key,
          label: CALL_TYPE_LABELS[key] || key,
          instructions: value?.instructions || '',
          differsAfterHours: value?.differsAfterHours,
          afterHoursInstructions: value?.afterHoursInstructions || '',
        }));
    }
    
    const legacyCallTypes = Array.isArray(ac.callTypes) ? ac.callTypes : [];
    
    let otherCallTypeNotes = '';
    if (ac.callTypes && typeof ac.callTypes === 'object' && !Array.isArray(ac.callTypes)) {
      otherCallTypeNotes = ac.callTypes.otherText?.toString().trim() || '';
    }
    
    return { structuredCallTypes, legacyCallTypes, otherCallTypeNotes };
  }, [ac.callTypes]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: darkMode ? 'background.default' : '#f5f6f8' }}>

      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* Modern Header Section */}
        {mounted && (
          <Box sx={{ 
            textAlign: 'center', 
            mb: 4,
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            borderRadius: 3,
            p: { xs: 2, md: 3 },
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
          {mounted && (
            <Card
              title="Company Information"
              onEdit={() => history.push(WIZARD_ROUTES.COMPANY_INFO)}
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
              onEdit={() => history.push(WIZARD_ROUTES.OFFICE_REACH)}
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
              onEdit={() => history.push(WIZARD_ROUTES.ANSWER_CALLS)}
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
              onEdit={() => history.push(WIZARD_ROUTES.ON_CALL)}
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
              onEdit={() => history.push(WIZARD_ROUTES.FINAL_DETAILS)}
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
              onEdit={() => history.push(WIZARD_ROUTES.OFFICE_REACH)}
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
              onEdit={() => history.push(WIZARD_ROUTES.COMPANY_INFO)}
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
              onEdit={() => history.push(WIZARD_ROUTES.FINAL_DETAILS)}
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
              onEdit={() => history.push(WIZARD_ROUTES.ON_CALL)}
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
              onEdit={() => history.push(WIZARD_ROUTES.FINAL_DETAILS)}
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

          {/* Info Page Preview */}
          {mounted && (
            <Box sx={{ mt: 4 }}>
              <InfoPagePreview formData={formData} />
            </Box>
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
                onClick={() => history.push(WIZARD_ROUTES.FINAL_DETAILS)}
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
                disabled={isSubmitting}
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
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #a5d6a7 0%, #c8e6c9 100%)',
                    boxShadow: 'none',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }
                }}
              >
                {isSubmitting ? 'Sending summary…' : 'Submit Application →'}
              </Button>
            </Box>
          )}
        </Stack>
      </Container>


      <Dialog
        open={summaryDialog.open}
        onClose={closeSummaryDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          Summary ready{summaryDialog.accountName ? ` — ${summaryDialog.accountName}` : ''}
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ mb: 2 }}>
            A copy of your onboarding summary was sent automatically. You can download or copy the
            same content below for your records.
          </DialogContentText>
          <Box
            component="pre"
            sx={{
              bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f7f9fc',
              borderRadius: 2,
              p: 2,
              maxHeight: 360,
              overflow: 'auto',
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {summaryDialog.text || 'Summary content unavailable.'}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCopySummary} variant="outlined">
            Copy to Clipboard
          </Button>
          <Button onClick={handleDownloadSummary} variant="contained" color="primary">
            Download .txt
          </Button>
          <Button onClick={closeSummaryDialog} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={closeToast}>
        <Alert severity={toast.severity} sx={{ width: '100%' }} onClose={closeToast}>
          {toast.message || 'Status updated.'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewStep;
