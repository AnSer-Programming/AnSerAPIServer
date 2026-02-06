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

const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_24H_REGEX = /^\d{2}:\d{2}$/;

const asTrimmed = (value) => (value == null ? '' : String(value).trim());
const isFilled = (value) => asTrimmed(value).length > 0;
const isBoolean = (value) => typeof value === 'boolean';

const isIsoDate = (value) => {
  const text = asTrimmed(value);
  if (!ISO_DATE_REGEX.test(text)) return false;
  const parsed = new Date(`${text}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime());
};

const isTime24h = (value) => {
  const text = asTrimmed(value);
  if (!TIME_24H_REGEX.test(text)) return false;
  const [hh, mm] = text.split(':').map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return false;
  return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59;
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
    errors.physicalLocation = 'Physical address is required.';
  }

  if (!data.physicalCity?.trim()) {
    errors.physicalCity = 'City is required for your physical location.';
  }

  if (!data.physicalState?.trim()) {
    errors.physicalState = 'State or province is required for your physical location.';
  }

  if (!data.physicalPostalCode?.trim()) {
    errors.physicalPostalCode = 'Postal code is required for your physical location.';
  }

  // ===== PRIMARY CONTACT REQUIRED =====
  if (data.primaryContact) {
    const primaryErrors = {};
    if (!data.primaryContact.name?.trim()) {
      primaryErrors.name = 'Primary contact name is required.';
    }
    if (!data.primaryContact.phone?.trim()) {
      primaryErrors.phone = 'Primary contact phone is required.';
    }
    if (!data.primaryContact.email?.trim()) {
      primaryErrors.email = 'Primary contact email is required.';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.primaryContact.email.trim())) {
      primaryErrors.email = 'Please enter a valid email address (e.g., name@company.com).';
    }
    if (Object.keys(primaryErrors).length) {
      errors.primaryContact = primaryErrors;
    }
  } else {
    errors.primaryContact = {
      name: 'Primary contact name is required.',
      phone: 'Primary contact phone is required.',
      email: 'Primary contact email is required.',
    };
  }

  // ===== BILLING CONTACT REQUIRED (unless same as primary) =====
  if (!data.billingSameAsPrimary) {
    if (data.billingContact) {
      const billingErrors = {};
      if (!data.billingContact.name?.trim()) {
        billingErrors.name = 'Billing contact name is required.';
      }
      if (!data.billingContact.email?.trim()) {
        billingErrors.email = 'Billing contact email is required.';
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.billingContact.email.trim())) {
        billingErrors.email = 'Please enter a valid email address (e.g., name@company.com).';
      }
      if (Object.keys(billingErrors).length) {
        errors.billingContact = billingErrors;
      }
    } else {
      errors.billingContact = {
        name: 'Billing contact name is required.',
        email: 'Billing contact email is required.',
      };
    }
  }

  // ===== CONTACT NUMBERS VALIDATION =====
  if (data.contactNumbers) {
    const contactErrors = {};
    if (!data.contactNumbers.primaryOfficeLine?.trim()) {
      contactErrors.primaryOfficeLine = 'Primary office line is required.';
    }
    if (data.contactNumbers.officeEmail && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.contactNumbers.officeEmail)) {
      contactErrors.officeEmail = 'Please enter a valid email address (e.g., name@company.com).';
    }
    if (Object.keys(contactErrors).length) {
      errors.contactNumbers = contactErrors;
    }
  } else {
    errors.contactNumbers = {
      primaryOfficeLine: 'Primary office line is required.',
    };
  }

  if (Array.isArray(data.contactChannels)) {
    const allowedTypes = new Set([
      'main',
      'phone',
      'toll-free',
      'fax',
      'website',
      'group-email',
      'linkedin',
      'facebook',
      'whatsapp',
      'x-twitter',
      'instagram',
      'other',
    ]);
    const phoneTypes = new Set(['main', 'phone', 'toll-free', 'fax', 'whatsapp', 'other']);
    const channelErrors = [];
    let hasPhone = false;

    data.contactChannels.forEach((channel = {}, index) => {
      const entryErrors = {};
      const type = channel.type;
      const value = typeof channel.value === 'string' ? channel.value.trim() : channel.value;
      const hasValue = Boolean(value);

      if (hasValue && (!type || !allowedTypes.has(type))) {
        entryErrors.type = 'Select a valid contact type.';
      }

      if (hasValue) {
        if (phoneTypes.has(type)) {
          hasPhone = true;
        }
      }

      if (Object.keys(entryErrors).length) {
        channelErrors[index] = entryErrors;
      }
    });

    if (!hasPhone) {
      channelErrors[0] = { ...(channelErrors[0] || {}), value: 'Add at least one phone number.' };
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

  // ===== OPTIONAL FIELDS with format validation =====
  // Validate email format if provided
  if (data.email && data.email.trim()) {
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address (e.g., name@company.com).';
    }
  }

  // Validate phone format if provided
  if (data.phone && data.phone.trim()) {
    if (!/^[0-9+()\s-]{7,}$/.test(data.phone.trim())) {
      errors.phone = 'Please enter a valid phone number.';
    }
  }

  return Object.keys(errors).length ? errors : null;
};

// ==============================
//   OTHER INFO SCHEMA
// ==============================
export const officeReachSchema = (data = {}) => {
  const errors = {};

  if (!isFilled(data.timeZone)) {
    errors.timeZone = 'Select your office time zone.';
  }

  const officeHours = data.officeHours && typeof data.officeHours === 'object' ? data.officeHours : {};
  const officeHoursErrors = {};
  let hasOpenDay = false;

  DAY_KEYS.forEach((dayKey) => {
    const day = officeHours[dayKey];
    if (!day || typeof day !== 'object') return;

    const dayErrors = {};
    const isClosed = Boolean(day.closed);
    const open = day.open;
    const close = day.close;

    if (!isClosed) {
      hasOpenDay = true;
      if (!isFilled(open)) {
        dayErrors.open = 'Open time is required when this day is active.';
      } else if (!isTime24h(open)) {
        dayErrors.open = 'Use HH:MM format.';
      }

      if (!isFilled(close)) {
        dayErrors.close = 'Close time is required when this day is active.';
      } else if (!isTime24h(close)) {
        dayErrors.close = 'Use HH:MM format.';
      }

      if (isFilled(open) && isFilled(close) && isTime24h(open) && isTime24h(close) && open === close) {
        dayErrors.close = 'Open and close times cannot match.';
      }
    }

    if (Object.keys(dayErrors).length) {
      officeHoursErrors[dayKey] = dayErrors;
    }
  });

  if (Object.keys(officeHoursErrors).length) {
    errors.officeHours = officeHoursErrors;
  } else if (Object.keys(officeHours).length > 0 && !hasOpenDay) {
    errors.officeHours = { base: 'Set at least one open day or clear office hours.' };
  }

  const lunch = data.lunchHours && typeof data.lunchHours === 'object' ? data.lunchHours : {};
  if (lunch.enabled) {
    const lunchErrors = {};
    if (!isFilled(lunch.open)) {
      lunchErrors.open = 'Lunch start time is required when lunch is enabled.';
    } else if (!isTime24h(lunch.open)) {
      lunchErrors.open = 'Use HH:MM format.';
    }

    if (!isFilled(lunch.close)) {
      lunchErrors.close = 'Lunch end time is required when lunch is enabled.';
    } else if (!isTime24h(lunch.close)) {
      lunchErrors.close = 'Use HH:MM format.';
    }

    if (isFilled(lunch.open) && isFilled(lunch.close) && isTime24h(lunch.open) && isTime24h(lunch.close) && lunch.open === lunch.close) {
      lunchErrors.close = 'Lunch start and end cannot match.';
    }

    if (Object.keys(lunchErrors).length) {
      errors.lunchHours = lunchErrors;
    }
  }

  const plannedTimes = data.plannedTimes && typeof data.plannedTimes === 'object' ? data.plannedTimes : {};
  const plannedTimesErrors = {};
  if (plannedTimes.other && !isFilled(plannedTimes.otherText)) {
    plannedTimesErrors.otherText = 'Explain "Other" planned service times.';
  }

  if (plannedTimes.emergency) {
    const emergencyProtocols = data.emergencyProtocols && typeof data.emergencyProtocols === 'object'
      ? data.emergencyProtocols
      : {};
    const hasEmergencyChoice = Object.values(emergencyProtocols).some((entry) => Boolean(entry?.enabled));
    if (!hasEmergencyChoice) {
      plannedTimesErrors.emergency = 'Select at least one emergency scenario.';
    }
  }

  const holidays = plannedTimes.holidays && typeof plannedTimes.holidays === 'object'
    ? plannedTimes.holidays
    : {};
  const holidayErrors = {};
  if (holidays.otherHolidays) {
    if (!Array.isArray(holidays.customDates) || holidays.customDates.length === 0) {
      holidayErrors.customDates = 'Add at least one custom holiday date.';
    } else {
      const dateErrors = [];
      const seen = new Set();
      holidays.customDates.forEach((entry, index) => {
        const itemErrors = {};
        const date = asTrimmed(entry);
        if (!isIsoDate(date)) {
          itemErrors.date = 'Use YYYY-MM-DD for each custom holiday date.';
        } else if (seen.has(date)) {
          itemErrors.date = 'Duplicate custom holiday date.';
        } else {
          seen.add(date);
        }
        if (Object.keys(itemErrors).length) {
          dateErrors[index] = itemErrors;
        }
      });
      if (dateErrors.length) {
        holidayErrors.customDates = dateErrors;
      }
    }
  }

  if (isFilled(holidays.easterNotes) && asTrimmed(holidays.easterNotes).length > 500) {
    holidayErrors.easterNotes = 'Keep Easter notes under 500 characters.';
  }

  if (Object.keys(holidayErrors).length) {
    plannedTimesErrors.holidays = holidayErrors;
  }

  if (Object.keys(plannedTimesErrors).length) {
    errors.plannedTimes = plannedTimesErrors;
  }

  if (Array.isArray(data.specialEvents)) {
    const specialEventErrors = [];
    data.specialEvents.forEach((event = {}, index) => {
      const eventErrors = {};
      const hasAnyField =
        isFilled(event.name) ||
        isFilled(event.date) ||
        isFilled(event.hours?.startHour) ||
        isFilled(event.hours?.startMinute) ||
        isFilled(event.hours?.endHour) ||
        isFilled(event.hours?.endMinute);

      if (!hasAnyField) return;

      if (!isFilled(event.name)) {
        eventErrors.name = 'Event name is required.';
      }
      if (!isIsoDate(event.date)) {
        eventErrors.date = 'Use YYYY-MM-DD for event dates.';
      }

      if (event.hours && typeof event.hours === 'object') {
        const startHour = asTrimmed(event.hours.startHour);
        const startMinute = asTrimmed(event.hours.startMinute);
        const endHour = asTrimmed(event.hours.endHour);
        const endMinute = asTrimmed(event.hours.endMinute);
        const hasAllTimeParts = startHour && startMinute && endHour && endMinute;

        if (!hasAllTimeParts) {
          eventErrors.hours = 'Provide both start and end times for each event.';
        } else if (`${startHour}:${startMinute}` === `${endHour}:${endMinute}`) {
          eventErrors.hours = 'Start and end times cannot match.';
        }
      } else {
        eventErrors.hours = 'Provide start and end times for each event.';
      }

      if (Object.keys(eventErrors).length) {
        specialEventErrors[index] = eventErrors;
      }
    });

    if (specialEventErrors.length) {
      errors.specialEvents = specialEventErrors;
    }
  }

  const summaryErrors = summaryPreferencesSchema(data.summaryPreferences || {});
  if (summaryErrors) {
    errors.summaryPreferences = summaryErrors;
  }

  const websiteErrors = websiteAccessSchema(data.websiteAccess || {});
  if (websiteErrors) {
    errors.websiteAccess = websiteErrors;
  }

  const overflow = data.businessHoursOverflow && typeof data.businessHoursOverflow === 'object'
    ? data.businessHoursOverflow
    : {};
  if (overflow.enabled) {
    const overflowErrors = {};
    if (!isFilled(overflow.overflowNumber)) {
      overflowErrors.overflowNumber = 'Overflow number is required when overflow is enabled.';
    } else if (!phoneOk(overflow.overflowNumber)) {
      overflowErrors.overflowNumber = 'Enter a valid overflow phone number.';
    }

    if (!isFilled(overflow.ringCount)) {
      overflowErrors.ringCount = 'Ring count is required when overflow is enabled.';
    } else {
      const ringCount = Number(overflow.ringCount);
      if (Number.isNaN(ringCount) || ringCount < 1 || ringCount > 10) {
        overflowErrors.ringCount = 'Ring count must be between 1 and 10.';
      }
    }

    if (Object.keys(overflowErrors).length) {
      errors.businessHoursOverflow = overflowErrors;
    }
  }

  const callFiltering = data.callFiltering && typeof data.callFiltering === 'object'
    ? data.callFiltering
    : {};
  const callFilteringErrors = {};
  if (!isBoolean(callFiltering.roboCallBlocking)) {
    callFilteringErrors.roboCallBlocking = 'Choose whether robo-call blocking is enabled.';
  }
  if (callFiltering.roboCallBlocking === false && !isBoolean(callFiltering.businessGreeting)) {
    callFilteringErrors.businessGreeting = 'Choose whether business greeting is enabled.';
  }
  if (!isBoolean(callFiltering.checkInRecording)) {
    callFilteringErrors.checkInRecording = 'Choose whether check-in recording is enabled.';
  }
  if (Object.keys(callFilteringErrors).length) {
    errors.callFiltering = callFilteringErrors;
  }

  return Object.keys(errors).length ? errors : null;
};

// ==============================
//   ANSWER CALLS SCHEMA
// ==============================
export const answerCallsSchema = (data = {}) => {
  const errors = {};

  if (!data.businessType || !data.businessType.toString().trim()) {
    errors.businessType = 'Select the business type that best fits your organization.';
  }

  if (Array.isArray(data.categories)) {
    if (data.categories.length === 0) {
      errors.categories = 'Add at least one call category.';
    } else {
      const categoryErrors = [];
      data.categories.forEach((category = {}, index) => {
        const rowErrors = {};
        const categoryName = asTrimmed(category.customName) || asTrimmed(category.selectedCommon);
        if (!categoryName) {
          rowErrors.customName = 'Give this call category a name.';
        }
        if (!isFilled(category.details)) {
          rowErrors.details = 'Add clarifying questions or instructions for this category.';
        } else if (asTrimmed(category.details).length > 2000) {
          rowErrors.details = 'Keep category instructions under 2000 characters.';
        }

        if (Object.keys(rowErrors).length) {
          categoryErrors[index] = rowErrors;
        }
      });
      if (categoryErrors.length) {
        errors.categories = categoryErrors;
      }
    }
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
export const onCallDepartmentsSchema = (list = []) => {
  if (!Array.isArray(list) || list.length === 0) {
    return { base: 'Add at least one on-call team.' };
  }

  const errors = [];
  list.forEach((row = {}, index) => {
    const rowErrors = {};
    const department = asTrimmed(row.department || row.name);
    const members = Array.isArray(row.members) ? row.members.filter((memberId) => isFilled(memberId)) : [];

    if (!department) {
      rowErrors.department = 'Team / department name is required.';
    }
    if (members.length === 0) {
      rowErrors.members = 'Select at least one member for this team.';
    }
    if (isFilled(row.contactMemberId) && !members.includes(row.contactMemberId)) {
      rowErrors.contactMemberId = 'Default contact must also be selected as a team member.';
    }

    if (Object.keys(rowErrors).length) {
      errors[index] = rowErrors;
    }
  });

  return errors.length ? errors : null;
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

  if (data.contactEmail && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data.contactEmail)) {
    errors.contactEmail = 'Please enter a valid email address (e.g., name@company.com).';
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

  if (data.dailyRecapEnabled == null) {
    errors.dailyRecapEnabled = 'Select yes or no for daily recaps.';
  } else if (typeof data.dailyRecapEnabled !== 'boolean') {
    errors.dailyRecapEnabled = 'Daily recap selection must be yes or no.';
  }

  if (data.dailyRecapEnabled === false) {
    return Object.keys(errors).length ? errors : null;
  }

  if (data.reportSpamHangups == null) {
    errors.reportSpamHangups = 'Choose yes or no for hang-up and spam reporting.';
  } else if (typeof data.reportSpamHangups !== 'boolean') {
    errors.reportSpamHangups = 'Choose yes or no for hang-up reporting.';
  }

  if (data.alwaysSendEvenIfNoMessages != null && typeof data.alwaysSendEvenIfNoMessages !== 'boolean') {
    errors.alwaysSendEvenIfNoMessages = 'Specify whether to send summaries on quiet days.';
  }

  const emailEnabled = Boolean(data.emailEnabled || data.recap?.delivery?.email);
  const faxEnabled = Boolean(data.faxEnabled || data.recap?.delivery?.fax);
  const otherEnabled = Boolean(data.recap?.delivery?.other);
  if (!emailEnabled && !faxEnabled && !otherEnabled) {
    errors.delivery = 'Select at least one delivery method (email, fax, or other).';
  }

  if (emailEnabled) {
    const emailList = asTrimmed(data.email)
      .split(/[,;]/)
      .map((entry) => entry.trim())
      .filter(Boolean);
    if (emailList.length === 0) {
      errors.email = 'Add at least one email recipient for daily summaries.';
    } else {
      const invalid = emailList.filter((email) => !emailOk(email));
      if (invalid.length) {
        errors.email = `Invalid email recipient(s): ${invalid.join(', ')}`;
      }
    }
  }

  if (faxEnabled) {
    if (!isFilled(data.faxNumber)) {
      errors.faxNumber = 'Add a fax number when fax delivery is enabled.';
    } else if (!phoneOk(data.faxNumber)) {
      errors.faxNumber = 'Enter a valid fax number.';
    }
  }

  if (otherEnabled && !isFilled(data.recap?.otherNotes)) {
    errors.otherNotes = 'Describe the "Other" delivery method.';
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

  if (data.recapSchedule && typeof data.recapSchedule === 'object') {
    const enabledDays = Object.values(data.recapSchedule).filter((entry) => Boolean(entry?.enabled));
    if (enabledDays.length === 0) {
      errors.recapSchedule = errors.recapSchedule || {};
      errors.recapSchedule.base = 'Select at least one day to send a recap.';
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

  if (Object.prototype.hasOwnProperty.call(data, 'hasWebsite')) {
    const errors = {};
    if (data.hasWebsite == null) {
      errors.hasWebsite = 'Please select whether your company has a website.';
    } else if (!isBoolean(data.hasWebsite)) {
      errors.hasWebsite = 'Website selection must be yes or no.';
    }
    return Object.keys(errors).length ? errors : null;
  }

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
// Improved email regex: requires proper format (user@domain.tld with at least 2-char TLD)
const emailOk = (v) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v || '');
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
      errors.changeBeginsTime = 'Select a valid time.';
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
  if (!Array.isArray(steps) || steps.length === 0) return null;

  const errors = [];
  steps.forEach((step = {}, index) => {
    const stepErrors = {};
    const hasAnyData = isFilled(step.name) || isFilled(step.contact) || isFilled(step.window) || isFilled(step.notes);
    if (!hasAnyData) return;

    if (!isFilled(step.name)) {
      stepErrors.name = 'Escalation contact name is required.';
    }
    if (!isFilled(step.contact)) {
      stepErrors.contact = 'Escalation contact details are required.';
    }
    if (isFilled(step.window) && asTrimmed(step.window).length > 120) {
      stepErrors.window = 'Availability window must be 120 characters or less.';
    }
    if (isFilled(step.notes) && asTrimmed(step.notes).length > 1000) {
      stepErrors.notes = 'Escalation notes must be 1000 characters or less.';
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
      e.email = 'Please enter a valid email address (e.g., name@company.com).';
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
// On Call: Schedule Type & Fixed Order
// ------------------------------
export const onCallScheduleTypeSchema = (data = {}) => {
  const errors = {};
  
  const scheduleType = data.scheduleType;
  const fixedOrder = data.fixedOrder;
  
  // Schedule type is required
  if (!scheduleType || !['rotating', 'fixed', 'no-schedule'].includes(scheduleType)) {
    errors.scheduleType = 'Please select how your after-hours coverage is organized.';
  }
  
  // If fixed schedule, fixedOrder array must have at least one entry
  if (scheduleType === 'fixed') {
    if (!Array.isArray(fixedOrder) || fixedOrder.length === 0) {
      errors.fixedOrder = 'Add at least one person to the fixed order list.';
    } else {
      const orderErrors = [];
      fixedOrder.forEach((person, idx) => {
        const personErrors = {};
        if (!person.name || !person.name.trim()) {
          personErrors.name = 'Name is required.';
        }
        if (!person.role || !person.role.trim()) {
          personErrors.role = 'Role/title is required.';
        }
        if (Object.keys(personErrors).length) {
          orderErrors[idx] = personErrors;
        }
      });
      if (orderErrors.length) {
        errors.fixedOrderItems = orderErrors;
      }
    }
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
//   CALL ROUTING SCHEMA
// ==============================
export const callRoutingSchema = (data = {}) => {
  const assignments = Array.isArray(data.categoryAssignments) ? data.categoryAssignments : [];
  const errors = {};

  if (assignments.length === 0) {
    return { categoryAssignments: 'Add at least one call category assignment.' };
  }

  const allowedWhenToContact = new Set(['all-hours', 'business-hours', 'after-hours', 'different', 'emergency']);
  const allowedFinalActions = new Set(['repeat-until-delivered', 'repeat-times', 'hold-checkin', 'hold', 'delivered']);
  const allowedRepeatActions = new Set(['hold-checkin', 'hold', 'delivered']);

  const normalizeContactList = (value) => {
    if (Array.isArray(value)) {
      return value.map((entry) => asTrimmed(entry)).filter(Boolean);
    }
    const trimmed = asTrimmed(value);
    return trimmed ? [trimmed] : [];
  };

  const validateEscalationSteps = (steps = []) => {
    if (!Array.isArray(steps) || steps.length === 0) {
      return 'Add at least one escalation step.';
    }

    const stepErrors = [];
    steps.forEach((step = {}, index) => {
      const itemErrors = {};
      const requiresContact = step.contactMethod !== 'delivered';
      if (requiresContact && !isFilled(step.contactPerson)) {
        itemErrors.contactPerson = index === 0
          ? 'Select who should be contacted first.'
          : 'Select a contact for this step.';
      }
      if (isFilled(step.notes) && asTrimmed(step.notes).length > 2000) {
        itemErrors.notes = 'Step notes must be 2000 characters or less.';
      }
      if (Object.keys(itemErrors).length) {
        stepErrors[index] = itemErrors;
      }
    });

    return stepErrors.length ? stepErrors : null;
  };

  const validateModeSettings = (assignment = {}, isAfterHours = false) => {
    const modeErrors = {};
    const modePrefix = isAfterHours ? 'afterHours' : '';
    const finalActionField = `${modePrefix}FinalAction`.replace(/^([a-z])/, (m) => m.toLowerCase());
    const repeatCountField = `${modePrefix}RepeatCount`.replace(/^([a-z])/, (m) => m.toLowerCase());
    const repeatFinalActionField = `${modePrefix}RepeatFinalAction`.replace(/^([a-z])/, (m) => m.toLowerCase());
    const confirmationField = isAfterHours ? 'afterHoursSendConfirmation' : 'sendConfirmationAfterDelivery';
    const confirmationTextField = isAfterHours ? 'afterHoursConfirmationViaText' : 'confirmationViaText';
    const confirmationEmailField = isAfterHours ? 'afterHoursConfirmationViaEmail' : 'confirmationViaEmail';
    const confirmationPhoneField = isAfterHours ? 'afterHoursConfirmationPhone' : 'confirmationPhone';
    const confirmationEmailValueField = isAfterHours ? 'afterHoursConfirmationEmail' : 'confirmationEmail';

    const finalAction = asTrimmed(assignment[finalActionField]) || 'repeat-until-delivered';
    if (!allowedFinalActions.has(finalAction)) {
      modeErrors[finalActionField] = 'Select a valid final action.';
    }

    if (finalAction === 'repeat-times') {
      const repeatCount = Number(assignment[repeatCountField]);
      if (!Number.isInteger(repeatCount) || repeatCount < 1 || repeatCount > 10) {
        modeErrors[repeatCountField] = 'Repeat count must be a whole number between 1 and 10.';
      }

      const repeatAction = asTrimmed(assignment[repeatFinalActionField]);
      if (!allowedRepeatActions.has(repeatAction)) {
        modeErrors[repeatFinalActionField] = 'Select what to do after repeats are exhausted.';
      }
    }

    if (assignment[confirmationField]) {
      const wantsText = Boolean(assignment[confirmationTextField]);
      const wantsEmail = Boolean(assignment[confirmationEmailField]);
      if (!wantsText && !wantsEmail) {
        modeErrors[confirmationField] = 'Choose at least one confirmation channel (text or email).';
      }

      if (wantsText) {
        const phones = normalizeContactList(assignment[confirmationPhoneField]);
        if (phones.length === 0) {
          modeErrors[confirmationPhoneField] = 'Add at least one phone number for text confirmations.';
        } else {
          const phoneErrors = {};
          phones.forEach((phone, index) => {
            if (!phoneOk(phone)) {
              phoneErrors[index] = 'Enter a valid phone number.';
            }
          });
          if (Object.keys(phoneErrors).length) {
            modeErrors[confirmationPhoneField] = phoneErrors;
          }
        }
      }

      if (wantsEmail) {
        const emails = normalizeContactList(assignment[confirmationEmailValueField]);
        if (emails.length === 0) {
          modeErrors[confirmationEmailValueField] = 'Add at least one email for confirmations.';
        } else {
          const emailErrors = {};
          emails.forEach((email, index) => {
            if (!emailOk(email)) {
              emailErrors[index] = 'Enter a valid email address.';
            }
          });
          if (Object.keys(emailErrors).length) {
            modeErrors[confirmationEmailValueField] = emailErrors;
          }
        }
      }
    }

    return Object.keys(modeErrors).length ? modeErrors : null;
  };

  const assignmentErrors = [];
  assignments.forEach((assignment = {}, index) => {
    const rowErrors = {};

    if (!isFilled(assignment.categoryId)) {
      rowErrors.categoryId = 'Category identifier is missing.';
    }
    if (!isFilled(assignment.categoryName)) {
      rowErrors.categoryName = 'Category name is required.';
    }
    if (isFilled(assignment.whenToContact) && !allowedWhenToContact.has(asTrimmed(assignment.whenToContact))) {
      rowErrors.whenToContact = 'Select a valid contact timing option.';
    }
    if (isFilled(assignment.specialInstructions) && asTrimmed(assignment.specialInstructions).length > 2000) {
      rowErrors.specialInstructions = 'Special instructions must be 2000 characters or less.';
    }

    const baseStepsErrors = validateEscalationSteps(assignment.escalationSteps);
    if (baseStepsErrors) {
      rowErrors.escalationSteps = baseStepsErrors;
    }

    const baseModeErrors = validateModeSettings(assignment, false);
    if (baseModeErrors) {
      Object.assign(rowErrors, baseModeErrors);
    }

    if (assignment.whenToContact === 'different') {
      const afterHoursErrors = validateEscalationSteps(assignment.afterHoursSteps);
      if (afterHoursErrors) {
        rowErrors.afterHoursSteps = afterHoursErrors;
      }

      const afterModeErrors = validateModeSettings(assignment, true);
      if (afterModeErrors) {
        Object.assign(rowErrors, afterModeErrors);
      }
    }

    if (Object.keys(rowErrors).length) {
      assignmentErrors[index] = rowErrors;
    }
  });

  if (assignmentErrors.length) {
    errors.categoryAssignments = assignmentErrors;
  }

  return Object.keys(errors).length ? errors : null;
};

// ==============================
//   FINAL DETAILS SCHEMA
// ==============================
export const finalDetailsSchema = (data = {}) => {
  const errors = {};

  // Validate consultation meeting email if provided
  if (data.consultationMeeting?.contactEmail) {
    const email = data.consultationMeeting.contactEmail.trim();
    if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.contactEmail = 'Please enter a valid email address (e.g., name@company.com).';
    }
  }

  // Validate daily recap email if provided
  if (data.dailyRecap?.emailAddress) {
    const email = data.dailyRecap.emailAddress.trim();
    if (email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      errors.emailAddress = 'Please enter a valid email address (e.g., name@company.com).';
    }
  }

  return Object.keys(errors).length ? errors : null;
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
