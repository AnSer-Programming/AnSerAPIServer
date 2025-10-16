// 📁 src/pages/ClientInfo/utils/validationSchema.js

const CALL_TYPE_KEYS = ['newLead', 'existingClient', 'urgentIssue', 'serviceRequest', 'billingQuestion'];

const validateCallTypesObject = (callTypes) => {
  if (!callTypes || typeof callTypes !== 'object' || Array.isArray(callTypes)) {
    return null;
  }

  const errors = {};

  CALL_TYPE_KEYS.forEach((key) => {
    const entry = callTypes[key];
    if (!entry || typeof entry !== 'object') {
      return;
    }

    const entryErrors = {};

    if (entry.enabled) {
      if (!entry.customLabel || !entry.customLabel.toString().trim()) {
        entryErrors.customLabel = 'Add a name for this call type.';
      }

      if (!entry.reachPrimary || !entry.reachPrimary.toString().trim()) {
        entryErrors.reachPrimary = 'Tell us who to reach first.';
      }

      if (!entry.instructions || !entry.instructions.toString().trim()) {
        entryErrors.instructions = 'Add quick instructions for this call type.';
      }

      if (!entry.notes || !entry.notes.toString().trim()) {
        entryErrors.notes = 'Provide a detailed script for this call type.';
      }
    }

    if (Object.keys(entryErrors).length) {
      errors[key] = entryErrors;
    }
  });

  if (typeof callTypes.otherText === 'string' && callTypes.otherText.length > 2000) {
    errors.otherText = 'Keep additional notes under 2000 characters.';
  }

  return Object.keys(errors).length ? errors : null;
};

// ==============================
//   COMPANY INFORMATION SCHEMA
// ==============================
export const companyInfoSchema = (data = {}) => {
  const errors = {};

  // ===== REQUIRED FIELDS =====
  const businessName = data.businessName || data.company || '';
  if (!businessName.trim()) {
    errors.businessName = 'Business name is required.';
    errors.company = 'Business name is required.';
  }
  
  if (!data.physicalLocation?.trim()) {
    errors.physicalLocation = 'Physical location is required.';
  }

  if (!data.physicalCity?.trim()) {
    errors.physicalCity = 'City is required for your physical location.';
  }

  if (!data.physicalState?.trim()) {
    errors.physicalState = 'State or province is required for your physical location.';
  }

  // ===== CONTACT NUMBERS VALIDATION =====
  if (data.contactNumbers) {
    const contactErrors = {};
    if (!data.contactNumbers.primaryOfficeLine?.trim()) {
      contactErrors.primaryOfficeLine = 'Primary office line is required.';
    }
    if (data.contactNumbers.officeEmail && !/\S+@\S+\.\S+/.test(data.contactNumbers.officeEmail)) {
      contactErrors.officeEmail = 'Invalid email format.';
    }
    if (Object.keys(contactErrors).length) {
      errors.contactNumbers = contactErrors;
    }
  }

  if (Array.isArray(data.contactChannels)) {
    const allowedTypes = new Set(['main', 'toll-free', 'fax', 'other', 'website']);
    const channelErrors = [];
    let hasValue = false;

    data.contactChannels.forEach((channel = {}, index) => {
      const entryErrors = {};
      const type = channel.type;
      const value = typeof channel.value === 'string' ? channel.value.trim() : channel.value;

      if (!type || !allowedTypes.has(type)) {
        entryErrors.type = 'Select a valid contact type.';
      }

      if (!value) {
        entryErrors.value = 'Add a number or link for this contact method.';
      } else {
        hasValue = true;
        if (type === 'website' && !/^https?:\/\//i.test(value)) {
          entryErrors.value = 'Start website links with http:// or https://.';
        }
      }

      if (Object.keys(entryErrors).length) {
        channelErrors[index] = entryErrors;
      }
    });

    if (!hasValue) {
      channelErrors[0] = { ...(channelErrors[0] || {}), value: 'Add at least one contact method.' };
    }

    if (channelErrors.length) {
      errors.contactChannels = channelErrors;
    }
  }

  if (Array.isArray(data.additionalLocations)) {
    const locationErrors = [];
    data.additionalLocations.forEach((location = {}, index) => {
      const hasAnyValue = ['label', 'address', 'suite', 'city', 'state', 'postalCode'].some((key) => {
        const value = location[key];
        if (typeof value === 'string') {
          return value.trim().length > 0;
        }
        return value != null;
      });

      if (!hasAnyValue) {
        return;
      }

      const locErrors = {};
      if (!location.address?.toString().trim()) {
        locErrors.address = 'Address is required when adding a location.';
      }
      if (!location.label?.toString().trim()) {
        locErrors.label = 'Give each additional location a label (e.g., Warehouse).';
      }
      if (location.postalCode && !location.postalCode.toString().trim()) {
        locErrors.postalCode = 'Postal code cannot be only whitespace.';
      }
      if (Object.keys(locErrors).length) {
        locationErrors[index] = locErrors;
      }
    });
    if (locationErrors.length) {
      errors.additionalLocations = locationErrors;
    }
  }

  if (data.holidays != null) {
    if (!Array.isArray(data.holidays)) {
      errors.holidays = 'Observed holidays must be an array of dates.';
    } else {
      const seen = new Set();
      const holidayErrors = [];

      data.holidays.forEach((entry, index) => {
        const itemErrors = {};
        const raw = typeof entry === 'string' ? entry.trim() : String(entry || '').trim();

        if (!raw) {
          itemErrors.required = 'Each observed holiday must include a date.';
        } else if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
          itemErrors.format = 'Use YYYY-MM-DD format (example: 2025-12-25).';
        } else {
          if (seen.has(raw)) {
            itemErrors.duplicate = 'Duplicate date detected. Remove repeated entries.';
          } else {
            seen.add(raw);
          }

          const date = new Date(`${raw}T00:00:00Z`);
          if (Number.isNaN(date.getTime())) {
            itemErrors.invalid = 'Enter a valid calendar date.';
          }
        }

        if (Object.keys(itemErrors).length) {
          holidayErrors[index] = itemErrors;
        }
      });

      if (holidayErrors.length) {
        errors.holidays = holidayErrors;
      }
    }
  }

  return Object.keys(errors).length ? errors : null;
};

// ==============================
//   BILLING CONTACT SCHEMA
// ==============================
export const billingContactSchema = (data = {}) => {
  const errors = {};

  // ===== REQUIRED FIELDS (uncomment to require) =====
  // if (!data.name?.trim()) errors.name = 'Full name is required.';
  // if (!data.email?.trim()) errors.email = 'Email is required.';
  // else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Invalid email format.';
  // if (!data.phone?.trim()) errors.phone = 'Primary office line is required.';
  // else if (!/^[0-9+()\s-]{7,}$/.test(data.phone)) errors.phone = 'Invalid phone number.';

  // ===== OPTIONAL FIELDS =====
  // data.title
  // data.purchaseOrder
  // data.notes

  return Object.keys(errors).length ? errors : null;
};

// ==============================
//   OFFICE REACH SCHEMA
// ==============================
export const officeReachSchema = (/* data = {} */) => {
  // All fields optional for now
  return null;

  // ===== EXAMPLE REQUIRED FIELDS =====
  // const errors = {};
  // if (!data.primaryOfficeLine?.trim()) errors.primaryOfficeLine = 'Primary office line is required.';
  // return Object.keys(errors).length ? errors : null;
};

// ==============================
//   ANSWER CALLS SCHEMA
// ==============================
export const answerCallsSchema = (data = {}) => {
  const errors = {};

  if (!data.businessType || !data.businessType.toString().trim()) {
    errors.businessType = 'Select the business type that best fits your organization.';
  }

  // Validate custom phrases if they're being used
  if (data.routine && !data.routine.useStandard) {
    if (!data.routine.custom?.trim()) {
      errors.routine = { custom: 'Custom routine phrase is required when not using standard.' };
    } else if (data.routine.custom.length > 300) {
      errors.routine = { custom: 'Routine phrase must be 300 characters or less.' };
    }
  }

  if (data.urgent && !data.urgent.useStandard) {
    if (!data.urgent.custom?.trim()) {
      errors.urgent = { custom: 'Custom urgent phrase is required when not using standard.' };
    } else if (data.urgent.custom.length > 300) {
      errors.urgent = { custom: 'Urgent phrase must be 300 characters or less.' };
    }
  }

  // Validate call types
  if (data.callTypes) {
    if (Array.isArray(data.callTypes)) {
      const callTypeErrors = [];
      data.callTypes.forEach((callType, index) => {
        const ctErrors = {};
        if (!callType.name?.trim()) {
          ctErrors.name = 'Call type name is required.';
        }
        if (!callType.instructions?.trim()) {
          ctErrors.instructions = 'Instructions are required for each call type.';
        }
        if (Object.keys(ctErrors).length) {
          callTypeErrors[index] = ctErrors;
        }
      });
      if (callTypeErrors.length) {
        errors.callTypes = callTypeErrors;
      }
    } else {
      const ctErrors = validateCallTypesObject(data.callTypes);
      if (ctErrors) {
        errors.callTypes = ctErrors;
      }
    }
  }

  return Object.keys(errors).length ? errors : null;
};

// ==============================
//   LEGACY ESCALATION MATRIX SCHEMA
// ==============================
export const escalationMatrixSchema = (/* rows = [] */) => {
  // All fields optional for now
  return null;

  // ===== EXAMPLE REQUIRED FIELDS =====
  // const errors = [];
  // rows.forEach((row, idx) => {
  //   const rowErr = {};
  //   if (!row.minutes) rowErr.minutes = 'Minutes must be set.';
  //   if (!row.contactInfo?.trim()) rowErr.contactInfo = 'Contact info required.';
  //   if (Object.keys(rowErr).length) errors[idx] = rowErr;
  // });
  // return errors.length ? errors : null;
};

// ==============================
//   ON-CALL DEPARTMENTS SCHEMA (legacy)
// ==============================
export const onCallDepartmentsSchema = (/* list = [] */) => {
  // All fields optional (kept for backward-compat)
  return null;
};

// ==============================
//   NOTIFICATION RULES SCHEMA (legacy)
// ==============================
export const notificationRulesSchema = () => null;

// ==============================
//   ACCOUNT PREFERENCES SCHEMA
// ==============================
export const accountPreferencesSchema = () => null;

// ==============================
//   CONSULTATION MEETING SCHEMA
// ==============================
export const consultationMeetingSchema = (data = {}) => {
  const errors = {};

  const allowedMeetingTypes = ['video', 'phone', 'in-person'];
  const slots = Array.isArray(data.selectedDateTimes) ? data.selectedDateTimes : [];

  if (slots.length < 3) {
    errors.selectedDateTimes = 'Please provide at least three available date and time options.';
  } else {
    const slotErrors = [];
    const seen = new Set();

    slots.forEach((slot = {}, index) => {
      const slotErr = {};
      const date = typeof slot.date === 'string' ? slot.date.trim() : '';
      const time = typeof slot.time === 'string' ? slot.time.trim() : '';

      if (!date) slotErr.date = 'Date is required for each availability entry.';
      if (!time) slotErr.time = 'Time is required for each availability entry.';

      if (date && time) {
        const key = `${date}::${time.toUpperCase()}`;
        if (seen.has(key)) {
          slotErr.duplicate = 'Duplicate availability detected. Please choose unique combinations.';
        } else {
          seen.add(key);
        }
      }

      if (Object.keys(slotErr).length) {
        slotErrors[index] = slotErr;
      }
    });

    if (slotErrors.length) {
      errors.selectedDateTimes = slotErrors;
    }
  }

  if (data.meetingType && !allowedMeetingTypes.includes(data.meetingType)) {
    errors.meetingType = 'Select a valid meeting type option.';
  }

  if (data.contactEmail && !/\S+@\S+\.\S+/.test(data.contactEmail)) {
    errors.contactEmail = 'Enter a valid email address.';
  }

  if (data.contactPhone && !phoneOk(data.contactPhone)) {
    errors.contactPhone = 'Enter a valid phone number (digits, space, +, -, () allowed).';
  }

  return Object.keys(errors).length ? errors : null;
};

// ==============================
//   PERSONNEL SCHEMA
// ==============================
export const personnelSchema = () => null;

// ==============================
//   SUMMARY PREFERENCES SCHEMA
// ==============================
export const summaryPreferencesSchema = (data = {}) => {
  if (!data || typeof data !== 'object') return null;

  const errors = {};

  if (data.dailyRecapEnabled !== null && data.dailyRecapEnabled !== undefined && typeof data.dailyRecapEnabled !== 'boolean') {
    errors.dailyRecapEnabled = 'Select yes or no for daily recaps.';
  }

  const realTime = Array.isArray(data.realTimeChannels) ? data.realTimeChannels : [];
  if (data.dailyRecapEnabled === false && realTime.length === 0) {
    errors.realTimeChannels = 'Select at least one real-time delivery method.';
  }
  if (realTime.length) {
    const allowed = new Set(['email', 'text', 'fax']);
    const invalid = realTime.filter((item) => !allowed.has(item));
    if (invalid.length) {
      errors.realTimeChannels = 'Real-time methods must be Email, Text, or Fax.';
    }
  }

  if (data.reportSpamHangups != null && typeof data.reportSpamHangups !== 'boolean') {
    errors.reportSpamHangups = 'Choose yes or no for hang-up reporting.';
  }

  if (data.alwaysSendEvenIfNoMessages != null && typeof data.alwaysSendEvenIfNoMessages !== 'boolean') {
    errors.alwaysSendEvenIfNoMessages = 'Specify whether to send summaries on quiet days.';
  }

  if (Array.isArray(data.recapSchedule)) {
    errors.recapSchedule = 'Recap schedule should be an object keyed by weekday.';
  }

  if (data.recapSchedule && typeof data.recapSchedule === 'object') {
    const scheduleErrors = {};
    Object.entries(data.recapSchedule).forEach(([day, value]) => {
      if (!value) return;
      const dayErrors = {};
      if (value.enabled != null && typeof value.enabled !== 'boolean') {
        dayErrors.enabled = 'Send toggle must be on or off.';
      }
      if (value.times != null && !Array.isArray(value.times)) {
        dayErrors.times = 'Times must be an array (HH:MM).';
      } else if (Array.isArray(value.times)) {
        const timeRegex = /^\d{2}:\d{2}$/;
        const dupCheck = new Set();
        value.times.forEach((time, idx) => {
          if (!timeRegex.test(time)) {
            if (!dayErrors.times) dayErrors.times = {};
            dayErrors.times[idx] = 'Use HH:MM format.';
          } else if (dupCheck.has(time)) {
            if (!dayErrors.times) dayErrors.times = {};
            dayErrors.times[idx] = 'Duplicate time.';
          } else {
            dupCheck.add(time);
          }
        });
      }
      if (Object.keys(dayErrors).length) {
        scheduleErrors[day] = dayErrors;
      }
    });
    if (Object.keys(scheduleErrors).length) {
      errors.recapSchedule = scheduleErrors;
    }
  }

  return Object.keys(errors).length ? errors : null;
};

// ==============================
//   CALL VOLUME METRICS SCHEMA
// ==============================
export const callVolumeSchema = (data = {}) => {
  if (!data || typeof data !== 'object') {
    return {
      avgDaily: 'Share a daily call estimate so we can size staffing.'
    };
  }

  const errors = {};

  const avg = typeof data.avgDaily === 'number'
    ? data.avgDaily.toString()
    : (data.avgDaily || '').toString().trim();
  if (!avg) {
    errors.avgDaily = 'Share a typical daily call total.';
  } else if (!/^[0-9]+$/.test(avg)) {
    errors.avgDaily = 'Use digits only for the daily total.';
  }

  const overnight = (data.overnightPct || '').toString().trim();
  if (overnight) {
    const numeric = Number(overnight);
    if (Number.isNaN(numeric)) {
      errors.overnightPct = 'Use numbers only for the overnight percentage.';
    } else if (numeric < 0 || numeric > 100) {
      errors.overnightPct = 'Share a value between 0 and 100.';
    }
  }

  if (typeof data.notes === 'string' && data.notes.length > 1000) {
    errors.notes = 'Keep notes under 1000 characters.';
  }

  return Object.keys(errors).length ? errors : null;
};

// ==============================
//   WEBSITE ACCESS SCHEMA
// ==============================
export const websiteAccessSchema = (data = {}) => {
  if (!data || typeof data !== 'object') return null;

  const errors = {};

  if (!data.required) {
    return null;
  }

  if (data.requiresLogin == null) {
    errors.requiresLogin = 'Let us know if a login is required.';
  } else if (typeof data.requiresLogin !== 'boolean') {
    errors.requiresLogin = 'Choose yes or no for the login requirement.';
  }

  if (data.requiresLogin === true) {
    if (data.requiresMFA == null) {
      errors.requiresMFA = 'Let us know if multi-factor authentication is needed.';
    } else if (typeof data.requiresMFA !== 'boolean') {
      errors.requiresMFA = 'Choose yes or no for multi-factor authentication.';
    }

    const sites = Array.isArray(data.sites) ? data.sites : [];
    const siteErrors = [];

    if (sites.length === 0) {
      siteErrors[0] = { url: 'Please add at least one website URL.' };
    } else {
      sites.forEach((site = {}, index) => {
        const siteErr = {};
        const url = typeof site.url === 'string' ? site.url.trim() : '';
        if (!url) {
          siteErr.url = 'Website URL is required.';
        } else if (!/^https?:\/\//i.test(url)) {
          siteErr.url = 'Include http:// or https:// in the website link.';
        }

        if (Object.keys(siteErr).length) {
          siteErrors[index] = siteErr;
        }
      });
    }

    if (siteErrors.length) {
      errors.sites = siteErrors;
    }
  }

  return Object.keys(errors).length ? errors : null;
};

// ==============================
//   CALL TYPES SCHEMA
// ==============================
export const callTypesSchema = (callTypes = {}) => {
  if (Array.isArray(callTypes)) {
    const errors = [];
    callTypes.forEach((callType, index) => {
      const ctErrors = {};
      if (!callType.name?.trim()) {
        ctErrors.name = 'Call type name is required.';
      }
      if (!callType.instructions?.trim()) {
        ctErrors.instructions = 'Instructions are required for each call type.';
      }
      if (Object.keys(ctErrors).length) {
        errors[index] = ctErrors;
      }
    });
    return errors.length ? errors : null;
  }

  return validateCallTypesObject(callTypes);
};

/* ======================================================================
   NEW: ON CALL VALIDATION
   These correspond to the new /on-call step sections in the UI.
   Lightweight rules intended to catch only clear issues.
====================================================================== */

// helpers
const isBlank = (v) => v == null || String(v).trim() === '';
const phoneOk = (v) => /^[0-9+()\s-]{7,}$/.test(v || '');
const emailOk = (v) => /\S+@\S+\.\S+/.test(v || '');
const timeOk = (v) => {
  if (!v) return true;
  const m = String(v).match(/^(\d{2}):(\d{2})$/);
  if (!m) return false;
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59;
};

const toMinutes = (value) => {
  if (!value) return null;

  const str = String(value).trim();
  const meridiemMatch = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (meridiemMatch) {
    let hours = Number(meridiemMatch[1]);
    const minutes = Number(meridiemMatch[2]);
    const meridiem = meridiemMatch[4].toUpperCase();

    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    if (hours < 1 || hours > 12 || minutes < 0 || minutes > 59) return null;

    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  const militaryMatch = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (militaryMatch) {
    const hours = Number(militaryMatch[1]);
    const minutes = Number(militaryMatch[2]);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    return hours * 60 + minutes;
  }

  return null;
};

const toNonEmptyArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((entry) => (entry == null ? '' : String(entry).trim()))
      .filter((entry) => entry.length > 0);
  }

  if (value == null) return [];

  const trimmed = String(value).trim();
  return trimmed ? [trimmed] : [];
};

// ------------------------------
// On Call: Rotation
// ------------------------------
export const onCallRotationSchema = (data = {}) => {
  const errors = {};

  // If rotation changes, only validate basic formats (keep requirements light)
  if (!data.doesNotChange) {
    if (data.changeBeginsTime && !timeOk(data.changeBeginsTime)) {
      errors.changeBeginsTime = 'Use HH:MM (24-hour) format.';
    }
    // Optional: ensure frequency is one of allowed values, if provided
    const allowed = ['', 'daily', 'weekly', 'monthly'];
    if (data.frequency && !allowed.includes(data.frequency)) {
      errors.frequency = 'Frequency must be daily, weekly, monthly, or blank.';
    }
  }

  return Object.keys(errors).length ? errors : null;
};

// ------------------------------
// On Call: Contact Rules
// ------------------------------
export const onCallContactRulesSchema = (data = {}) => {
  const errors = {};

  if (data.emergencyOnly && isBlank(data.emergencyDefinition)) {
    errors.emergencyDefinition = 'Please define what qualifies as an emergency.';
  }
  if (data.specificCallTypes && isBlank(data.specificTypes)) {
    errors.specificTypes = 'Please list the specific call types.';
  }

  return Object.keys(errors).length ? errors : null;
};

// ------------------------------
// On Call: Procedures
// ------------------------------
export const onCallProceduresSchema = (data = {}) => {
  const errors = {};

  const numCheck = (key, label) => {
    const val = data[key];
    if (val === '' || val == null) return;
    if (Number.isNaN(Number(val)) || Number(val) < 0) {
      errors[key] = `${label} must be a non-negative number.`;
    }
  };

  numCheck('attempts', 'Attempts');
  numCheck('minutesBetweenAttempts', 'Minutes between attempts');
  numCheck('escalateAfterMinutes', 'Escalate after (min)');

  if (!isBlank(data.escalateAfterMinutes) && isBlank(data.escalateTo)) {
    errors.escalateTo = 'Provide who to escalate to when the time threshold is reached.';
  }

  return Object.keys(errors).length ? errors : null;
};

// ------------------------------
// On Call: Escalation List
// ------------------------------
export const onCallEscalationSchema = (steps = []) => {
  if (!Array.isArray(steps)) return null;
  if (steps.length === 0) {
    return { base: 'Add at least one escalation contact.' };
  }

  const errors = [];
  steps.forEach((step = {}, index) => {
    const stepErrors = {};
    if (!step.name || !step.name.toString().trim()) {
      stepErrors.name = 'Name is required.';
    }
    if (!step.contact || !step.contact.toString().trim()) {
      stepErrors.contact = 'Provide the best contact details.';
    }
    if (step.window && step.window.toString().length > 120) {
      stepErrors.window = 'Keep the time window under 120 characters.';
    }
    if (step.notes && step.notes.toString().length > 500) {
      stepErrors.notes = 'Notes must be 500 characters or less.';
    }

    if (Object.keys(stepErrors).length) {
      errors[index] = stepErrors;
    }
  });

  return errors.length ? errors : null;
};

// ------------------------------
// On Call: Team
// ------------------------------
export const onCallTeamSchema = (rows = []) => {
  if (!Array.isArray(rows) || rows.length === 0) return null; // no team yet → OK

  const errors = [];
  rows.forEach((r, idx) => {
    const e = {};
    if (isBlank(r?.name)) e.name = 'Name is required.';

    // At least one contact method
    const emails = toNonEmptyArray(r?.email || r?.emails);
    const cells = toNonEmptyArray(r?.cellPhone ?? r?.cell);
    const homes = toNonEmptyArray(r?.homePhone ?? r?.home);
    const pagers = toNonEmptyArray(r?.pager ?? r?.other);
    const texts = toNonEmptyArray(r?.textCell ?? r?.text);

    const hasContact = [emails, cells, homes, pagers, texts].some((arr) => arr.length > 0);
    if (!hasContact) e.contactRequired = 'Provide at least one contact method.';

    if (emails.some((val) => !emailOk(val))) {
      e.email = 'Enter valid email addresses.';
    }

    if (cells.some((val) => !phoneOk(val))) {
      const msg = 'Enter valid cell numbers (digits, space, +, -, () allowed).';
      e.cellPhone = msg;
      e.cell = msg;
    }

    if (homes.some((val) => !phoneOk(val))) {
      const msg = 'Enter valid home numbers (digits, space, +, -, () allowed).';
      e.homePhone = msg;
      e.home = msg;
    }

    if (texts.some((val) => !phoneOk(val))) {
      const msg = 'Enter valid text numbers (digits, space, +, -, () allowed).';
      e.textCell = msg;
      e.text = msg;
    }

    if (pagers.some((val) => !phoneOk(val))) {
      const msg = 'Enter valid pager numbers (digits, space, +, -, () allowed).';
      e.pager = msg;
      e.other = msg;
    }

    if (Object.keys(e).length) errors[idx] = e;
  });

  return errors.length ? errors : null;
};

// ------------------------------
// Attachments
// ------------------------------
export const attachmentsSchema = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return null;

  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
  const errors = [];

  items.forEach((item = {}, index) => {
    const entryErrors = {};

    if (!item.name || !item.name.toString().trim()) {
      entryErrors.name = 'Attachment name is required.';
    }

    if (item.size != null && Number(item.size) > MAX_FILE_SIZE) {
      entryErrors.size = 'Attachments must be 25MB or smaller.';
    }

    if (item.type && item.type.toString().length > 120) {
      entryErrors.type = 'Attachment type looks invalid.';
    }

    if (Object.keys(entryErrors).length) {
      errors[index] = entryErrors;
    }
  });

  return errors.length ? errors : null;
};

// ------------------------------
// Fast Track Flow
// ------------------------------
export const fastTrackSchema = (data = {}) => {
  if (!data || data.enabled !== true) return null;

  const errors = {};

  const payment = data.payment || {};
  const paymentErrors = {};
  if (!payment.cardholderName || !payment.cardholderName.toString().trim()) {
    paymentErrors.cardholderName = 'Cardholder name is required.';
  }
  const last4 = payment.cardLast4 != null ? payment.cardLast4.toString().trim() : '';
  if (!/^[0-9]{4}$/.test(last4)) {
    paymentErrors.cardLast4 = 'Enter the last four digits (numbers only).';
  }
  if (!payment.billingZip || !payment.billingZip.toString().trim()) {
    paymentErrors.billingZip = 'Billing ZIP / postal code is required.';
  }
  if (payment.rushFeeAccepted !== true) {
    paymentErrors.rushFeeAccepted = 'Please acknowledge the $100 rush fee.';
  }
  if (payment.authorization !== true) {
    paymentErrors.authorization = 'Payment authorization is required to fast track your launch.';
  }
  if (payment.notes && payment.notes.length > 500) {
    paymentErrors.notes = 'Keep payment notes under 500 characters.';
  }
  if (Object.keys(paymentErrors).length) {
    errors.payment = paymentErrors;
  }

  const contacts = Array.isArray(data.onCallContacts) ? data.onCallContacts : [];
  const contactRows = [];
  let validContacts = 0;
  contacts.forEach((contact = {}, index) => {
    const rowErrors = {};
    if (!contact?.name || !contact.name.toString().trim()) {
      rowErrors.name = 'Name is required.';
    }
    if (!contact?.phone || !contact.phone.toString().trim()) {
      rowErrors.phone = 'Direct phone number is required.';
    }
  if (contact?.email && !emailOk(contact.email.toString().trim())) {
      rowErrors.email = 'Enter a valid email address.';
    }
    if (Object.keys(rowErrors).length) {
      contactRows[index] = rowErrors;
    } else if (contact?.name && contact?.phone) {
      validContacts += 1;
    }
  });
  const contactsErrorObject = {};
  if (contactRows.length) {
    contactsErrorObject.rows = contactRows;
  }
  if (validContacts < 2) {
    contactsErrorObject.base = 'Provide at least two primary contacts for the first weeks of coverage.';
  }
  if (Object.keys(contactsErrorObject).length) {
    errors.onCallContacts = contactsErrorObject;
  }

  const slots = Array.isArray(data.callTypeSlots) ? data.callTypeSlots : [];
  const slotErrors = [];
  slots.forEach((slot = {}, index) => {
    const rowErrors = {};
    if (!slot?.instructions || !slot.instructions.toString().trim()) {
      rowErrors.instructions = 'Tell us what to do for this scenario.';
    }
    if (slot?.afterHoursNotes && slot.afterHoursNotes.toString().length > 500) {
      rowErrors.afterHoursNotes = 'Keep after-hours notes under 500 characters.';
    }
    if (Object.keys(rowErrors).length) {
      slotErrors[index] = rowErrors;
    }
  });
  if (slotErrors.length) {
    errors.callTypeSlots = slotErrors;
  }

  const meeting = data.meeting || {};
  const meetingErrors = {};
  if (!meeting.platform || !meeting.platform.toString().trim()) {
    meetingErrors.platform = 'Select a meeting platform.';
  }
  if (!meeting.date || !meeting.date.toString().trim()) {
    meetingErrors.date = 'Choose a preferred date.';
  }
  if (!meeting.time || !meeting.time.toString().trim()) {
    meetingErrors.time = 'Choose a preferred time.';
  }
  if (meeting.timezone && meeting.timezone.toString().length > 80) {
    meetingErrors.timezone = 'Timezone label is too long.';
  }
  if (meeting.notes && meeting.notes.length > 600) {
    meetingErrors.notes = 'Keep meeting notes under 600 characters.';
  }
  if (Object.keys(meetingErrors).length) {
    errors.meeting = meetingErrors;
  }

  return Object.keys(errors).length ? errors : null;
};

// ------------------------------
// On Call: Schedules
// ------------------------------
export const onCallSchedulesSchema = (rows = []) => {
  if (!Array.isArray(rows) || rows.length === 0) return null; // optional

  const errors = [];

  rows.forEach((schedule = {}, idx) => {
    const e = {};

    const start = schedule.startTime;
    const end = schedule.endTime;
    const recurrence = schedule.recurrence;

    const startMinutes = toMinutes(start);
    const endMinutes = toMinutes(end);

    if (isBlank(start)) {
      e.startTime = 'Select a start time.';
    } else if (startMinutes == null) {
      e.startTime = 'Start time must be formatted like 4:30 PM.';
    }

    if (isBlank(end)) {
      e.endTime = 'Select an end time.';
    } else if (endMinutes == null) {
      e.endTime = 'End time must be formatted like 4:30 PM.';
    }

    if (startMinutes != null && endMinutes != null && startMinutes === endMinutes) {
      e.preview = 'Start and end time cannot be the same.';
    }

    if (isBlank(recurrence)) {
      e.recurrence = 'Choose how often this schedule repeats.';
    }

    if (recurrence === 'On Date' && isBlank(schedule.specificDate)) {
      e.specificDate = 'Pick a date for this schedule.';
    }

    if (recurrence && recurrence.includes('Week') && recurrence !== 'On Date') {
      const days = Array.isArray(schedule.selectedDays) ? schedule.selectedDays : [];
      if (days.length === 0) {
        e.selectedDays = 'Pick at least one day of the week.';
      }
    }

    if (recurrence === 'Every Month') {
      const value = Number(schedule.monthDay);
      if (Number.isNaN(value) || value < 1 || value > 31) {
        e.monthDay = 'Choose a calendar day between 1 and 31.';
      }
    }

    if (Object.keys(e).length) {
      errors[idx] = e;
    }
  });

  return errors.length ? errors : null;
};

// ==============================
//   FINAL DETAILS SCHEMA
// ==============================
export const finalDetailsSchema = (data = {}) => {
  // Final Details page contains optional review meeting preferences
  // All fields are optional, so this validator always passes
  return null;
};

/*
=====================================
   HOW TO MAKE A FIELD REQUIRED:
=====================================

1. Find the schema section for the relevant step.
2. Uncomment (or add) a line in the 'REQUIRED FIELDS' block for the field you want to require.
3. Example: To require 'Company Name' in Company Info, change:

   // if (!data.company?.trim()) errors.company = 'Company name is required.';

   to

   if (!data.company?.trim()) errors.company = 'Company name is required.';

4. Save & reload the app! That field will now be validated.

*/
