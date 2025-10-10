import {
  companyInfoSchema,
  billingContactSchema,
  officeReachSchema,
  answerCallsSchema,
  escalationMatrixSchema,
  attachmentsSchema,
  personnelSchema,
  summaryPreferencesSchema,
  callVolumeSchema,
  websiteAccessSchema,
  callTypesSchema,
  fastTrackSchema,

  // Legacy on-call schemas (kept for compatibility if still used anywhere)
  onCallDepartmentsSchema,
  notificationRulesSchema,

  accountPreferencesSchema,
  consultationMeetingSchema,

  // ⬇️ New on-call section schemas
  onCallRotationSchema,
  onCallContactRulesSchema,
  onCallProceduresSchema,
  onCallTeamSchema,
  onCallSchedulesSchema,
  onCallEscalationSchema,

  // Final Details schema
  finalDetailsSchema,
} from './validationSchema';

// Aggregate validator so validateSection('onCall', onCall) works.
const onCallAggregate = (onCall = {}) => {
  const rotationErr   = onCallRotationSchema(onCall.rotation || {});
  const rulesErr      = onCallContactRulesSchema(onCall.contactRules || {});
  const proceduresErr = onCallProceduresSchema(onCall.procedures || {});
  const teamErr       = onCallTeamSchema(onCall.team || []);
  const schedulesErr  = onCallSchedulesSchema(onCall.schedules || []);
  const escalationErr = onCallEscalationSchema(onCall.escalation || []);

  const out = {};
  if (rotationErr)   out.rotation = rotationErr;
  if (rulesErr)      out.contactRules = rulesErr;
  if (proceduresErr) out.procedures = proceduresErr;
  if (teamErr)       out.team = teamErr;
  if (schedulesErr)  out.schedules = schedulesErr;
  if (escalationErr) out.escalation = escalationErr;

  return Object.keys(out).length ? out : null;
};

export const validators = {
  // --- Company & Office ---
  companyInfo: companyInfoSchema,
  'companyInfo.billingContact': billingContactSchema,
  officeReach: officeReachSchema,

  // --- Answer Calls ---
  answerCalls: answerCallsSchema,
  'answerCalls.callTypes': callTypesSchema,

  // --- Escalation / Personnel / Preferences ---
  escalationMatrix: escalationMatrixSchema,
  'companyInfo.personnel': personnelSchema,
  'companyInfo.summaryPreferences': summaryPreferencesSchema,
  'companyInfo.websiteAccess': websiteAccessSchema,
  accountPreferences: accountPreferencesSchema,
  'companyInfo.consultationMeeting': consultationMeetingSchema,
  attachments: attachmentsSchema,
  'metrics.callVolume': callVolumeSchema,
  fastTrack: fastTrackSchema,

  // --- NEW: On Call (aggregate + sub-keys) ---
  onCall: onCallAggregate,
  'onCall.rotation': onCallRotationSchema,
  'onCall.contactRules': onCallContactRulesSchema,
  'onCall.procedures': onCallProceduresSchema,
  'onCall.team': onCallTeamSchema,
  'onCall.schedules': onCallSchedulesSchema,
  'onCall.escalation': onCallEscalationSchema,

  // --- Final Details ---
  finalDetails: finalDetailsSchema,

  // --- Legacy: On Call (compat) ---
  'onCall.departments': onCallDepartmentsSchema,
  'onCall.notificationRules': notificationRulesSchema,
};

export const validateSection = (section, data) => {
  const fn = validators[section];
  return fn ? fn(data) : null;
};

export const validateAll = (formData) => {
  const errors = {};

  for (const [key, fn] of Object.entries(validators)) {
    // Avoid duplicating on-call errors: skip the aggregate in validateAll
    if (key === 'onCall') continue;

    const parts = key.split('.');
    const value = parts.reduce((obj, part) => obj?.[part], formData);
    const err = fn(value);

    if (err) {
      if (parts.length > 1) {
        const [parent, child] = parts; // supports single nesting, e.g. "onCall.rotation"
        errors[parent] = errors[parent] || {};
        errors[parent][child] = err;
      } else {
        errors[key] = err;
      }
    }
  }

  return Object.keys(errors).length ? errors : null;
};
