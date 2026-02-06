import React, { createContext, useReducer, useContext, useCallback, useMemo } from 'react';
import useAutosave from '../utils/useAutosave';
import logger from '../utils/logger';
import { deriveObservedHolidayDates } from '../utils/holidayDates';
import {
  validateSection as rawValidateSection,
  validateAll as rawValidateAll,
} from '../utils/validators';
import { WIZARD_STEPS } from '../constants/routes';

const WizardContext = createContext(null);

// Default shapes for sections we want to safely read before the user types anything.
const DEFAULTS = {
  companyInfo: {
    businessName: '',
    company: '',
    physicalLocation: '',
    suiteOrUnit: '',
    physicalCity: '',
    physicalState: '',
    physicalPostalCode: '',
    billingAddress: '',
    billingSuite: '',
    billingCity: '',
    billingState: '',
    billingPostalCode: '',
    billingSameAsPhysical: false,
    additionalLocations: [],
    contactNumbers: {
      primaryOfficeLine: '',
      tollFree: '',
      secondaryLine: '',
      fax: '',
      officeEmail: '',
      website: '',
    },
    contactChannels: [],
    primaryContact: {
      name: '',
      title: '',
      phone: '',
      email: '',
    },
    billingContact: {
      name: '',
      title: '',
      phone: '',
      email: '',
      purchaseOrder: '',
      notes: '',
    },
    billingSameAsPrimary: false,
    timeZone: '',
    officeHours: {},
    lunchHours: { enabled: false, open: '12:00', close: '13:00' },
    plannedTimes: {
      allDay: false,
      outsideBusiness: false,
      overflow: false,
      lunch: false,
      emergency: false,
      other: false,
      holidays: {
        otherHolidays: false,
        customDates: [],
      },
    },
    emergencyProtocols: {
      weather: { enabled: false },
      power: { enabled: false },
      phone: { enabled: false },
      internet: { enabled: false },
    },
    holidays: [],
    specialEvents: [],
    callFiltering: {
      roboCallBlocking: null,
      businessGreeting: null,
      checkInRecording: null,
    },
    businessHoursOverflow: {
      enabled: false,
      overflowNumber: '',
      ringCount: '',
    },
    dailyRecap: {
      enabled: false,
      deliveryTime: '17:00',
      deliveryMethod: 'email',
      emailAddress: '',
      includeDetails: true,
    },
    websiteAccess: {
      required: false,
      requiresLogin: null,
      requiresMFA: null,
      difficulty: 'unknown',
      sites: [{ url: '', username: '', password: '', notes: '' }],
      hasCAPTCHA: false,
      autoLogoutAggressive: false,
      testComplete: false,
      missingInfo: false,
    },
    consultationMeeting: {
      selectedDateTimes: [],
      meetingType: 'video',
      notes: '',
      contactPerson: '',
      contactEmail: '',
      contactPhone: '',
    },
    summaryPreferences: {
      emailEnabled: false,
      faxEnabled: false,
      email: '',
      faxNumber: '',
      alwaysSendEvenIfNoMessages: false,
      reportSpamHangups: undefined,
      dailyRecapEnabled: null,
      recap: {
        includeNoMessages: false,
        delivery: { email: false, fax: false, other: false },
        otherNotes: '',
      },
      recapSchedule: {},
      sameTimeWeekdays: false,
    },
  },
  onCall: {
    teamSize: 0,
    collectEmailsForRecaps: false,
    rotation: {
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
    scheduleType: 'no-schedule', // 'rotating' | 'fixed' | 'no-schedule'
    fixedOrder: [], // [{ id, name, role }]
  },
  escalationMatrix: [],
  answerCalls: {
    businessType: '',
    routine: { useStandard: true, custom: '', guidelines: '' },
    urgent: { useStandard: true, custom: '', guidelines: '' },
    callTypes: {
      newLead: { enabled: false, customLabel: '', instructions: '', reachPrimary: '', reachSecondary: '', notes: '', autoEmailOffice: false },
      existingClient: { enabled: false, customLabel: '', instructions: '', reachPrimary: '', reachSecondary: '', notes: '', autoEmailOffice: false },
      urgentIssue: { enabled: false, customLabel: '', instructions: '', reachPrimary: '', reachSecondary: '', notes: '', autoEmailOffice: false },
      serviceRequest: { enabled: false, customLabel: '', instructions: '', reachPrimary: '', reachSecondary: '', notes: '', autoEmailOffice: false },
      billingQuestion: { enabled: false, customLabel: '', instructions: '', reachPrimary: '', reachSecondary: '', notes: '', autoEmailOffice: false },
      otherText: '',
    },
  },
  callRouting: {
    categoryAssignments: [], // [{ categoryId, categoryName, whenToContact, specialInstructions, escalationSteps: [{ id, contactPerson, contactMethod, notes, ifNaAction, repeatSteps, holdForCheckIn }] }]
  },
  metrics: {
    callVolume: {
      avgDaily: '',
      peakWindow: '',
      overnightPct: '',
      notes: '',
    },
  },
  attachments: [],
};

const deepClone = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }
  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = deepClone(value[key]);
      return acc;
    }, {});
  }
  return value;
};

const normalizeCompanyInfoModel = (companyInfo = {}) => {
  const normalized = { ...companyInfo };

  if (normalized.billingAddress == null && normalized.mailingAddress != null) {
    normalized.billingAddress = normalized.mailingAddress;
  }
  if (normalized.billingSuite == null && normalized.mailingSuite != null) {
    normalized.billingSuite = normalized.mailingSuite;
  }
  if (normalized.billingCity == null && normalized.mailingCity != null) {
    normalized.billingCity = normalized.mailingCity;
  }
  if (normalized.billingState == null && normalized.mailingState != null) {
    normalized.billingState = normalized.mailingState;
  }
  if (normalized.billingPostalCode == null && normalized.mailingPostalCode != null) {
    normalized.billingPostalCode = normalized.mailingPostalCode;
  }
  if (normalized.billingSameAsPhysical == null && normalized.mailingSameAsPhysical != null) {
    normalized.billingSameAsPhysical = normalized.mailingSameAsPhysical;
  }

  delete normalized.mailingAddress;
  delete normalized.mailingSuite;
  delete normalized.mailingCity;
  delete normalized.mailingState;
  delete normalized.mailingPostalCode;
  delete normalized.mailingSameAsPhysical;

  return normalized;
};

const normalizeFormDataModel = (formData = {}) => {
  if (!formData || typeof formData !== 'object') return formData;
  if (!formData.companyInfo || typeof formData.companyInfo !== 'object') return formData;
  return {
    ...formData,
    companyInfo: normalizeCompanyInfoModel(formData.companyInfo),
  };
};

const initialState = {
  formData: {},
  visitedSteps: {},
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_SECTION': {
      const { section, payload } = action;
      const current = state.formData[section];
      const base = current != null ? current : (DEFAULTS[section] != null ? deepClone(DEFAULTS[section]) : {});
      // If payload is an array, replace; else shallow-merge into object
      const nextSection = Array.isArray(payload)
        ? payload
        : { ...(base || {}), ...payload };
      const normalizedSection = section === 'companyInfo' && !Array.isArray(nextSection)
        ? normalizeCompanyInfoModel(nextSection)
        : nextSection;

      return {
        ...state,
        formData: {
          ...state.formData,
          [section]: normalizedSection,
        },
      };
    }
    case 'MARK_VISITED':
      return {
        ...state,
        visitedSteps: {
          ...state.visitedSteps,
          [action.step]: true,
        },
      };
    case 'LOAD_DRAFT':
      {
        const payload = action.payload || {};
        return {
          ...state,
          ...payload,
          formData: normalizeFormDataModel(payload.formData || {}),
        };
      }
    default:
      return state;
  }
};

const STEP_DATA_KEYS = {
  'company-info': 'companyInfo',
  'answer-calls': 'answerCalls',
  'on-call': 'onCall',
  'team-setup': 'onCall',
  'escalation-details': 'onCall',
  'call-routing': 'callRouting',
  'office-reach': 'companyInfo',
  'final-details': 'companyInfo.consultationMeeting',
};

const STEP_SLUG_BY_KEY = {
  companyInfo: 'company-info',
  answerCalls: 'answer-calls',
  onCall: 'on-call',
  callRouting: 'call-routing',
  officeReach: 'office-reach',
  finalDetails: 'final-details',
  'companyInfo.consultationMeeting': 'final-details',
};

const STEP_VALIDATION_KEYS = {
  'company-info': ['companyInfo'],
  'answer-calls': ['answerCalls'],
  'on-call': ['onCall.team'],
  'team-setup': ['onCall.departments'],
  'escalation-details': ['onCall.rotation', 'onCall.scheduleType'],
  'call-routing': ['callRouting'],
  'office-reach': ['officeReach'],
  'final-details': ['companyInfo.consultationMeeting', 'attachments'],
};

const normalizeStepSlug = (step) => {
  if (STEP_DATA_KEYS[step]) return step;
  return STEP_SLUG_BY_KEY[step] || step;
};

const getValueByPath = (source, path) => {
  if (!path || typeof path !== 'string') return undefined;
  return path.split('.').reduce((acc, key) => acc?.[key], source);
};

const hasAnyData = (value) => {
  if (value == null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  if (typeof value === 'number' || typeof value === 'boolean') return true;
  if (typeof value === 'object') {
    return Object.values(value).some((entry) => hasAnyData(entry));
  }
  return false;
};

const hasFinalDetailsData = (formData = {}) => {
  const consultation = getValueByPath(formData, 'companyInfo.consultationMeeting') || {};
  const attachments = Array.isArray(formData.attachments) ? formData.attachments : [];

  const hasSlots = Array.isArray(consultation.selectedDateTimes) && consultation.selectedDateTimes.length > 0;
  const hasContactMeta = hasAnyData({
    contactPerson: consultation.contactPerson,
    contactEmail: consultation.contactEmail,
    contactPhone: consultation.contactPhone,
    notes: consultation.notes,
  });
  const hasNonDefaultMeetingType = Boolean(
    consultation.meetingType && consultation.meetingType !== 'video'
  );

  return hasSlots || hasContactMeta || hasNonDefaultMeetingType || attachments.length > 0;
};

const flattenValidationErrors = (value, prefix = '') => {
  if (!value) return [];
  if (typeof value === 'string') {
    return [{ field: prefix || 'base', message: value }];
  }
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => (
      flattenValidationErrors(entry, prefix ? `${prefix}.${index}` : String(index))
    ));
  }
  if (typeof value === 'object') {
    return Object.entries(value).flatMap(([key, entry]) => (
      flattenValidationErrors(entry, prefix ? `${prefix}.${key}` : key)
    ));
  }
  return [];
};

export const WizardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Auto-save wizard state to localStorage
  useAutosave('clientWizardDraft', state);

  const updateSection = useCallback((section, payload) => {
    dispatch({ type: 'UPDATE_SECTION', section, payload });
  }, []);

  const markStepVisited = useCallback((step) => {
    dispatch({ type: 'MARK_VISITED', step });
  }, []);

  const loadDraft = useCallback((draft) => {
    dispatch({ type: 'LOAD_DRAFT', payload: draft });
  }, []);

  const validateSection = useCallback((section, data) => rawValidateSection(section, data), []);
  const validateAll = useCallback((formData) => rawValidateAll(formData), []);

  // Helper to read a section with a safe default shape when missing.
  const mergeDefaults = (defaults, value) => {
    if (value == null) return deepClone(defaults);
    if (Array.isArray(value)) return value.slice();
    if (typeof value === 'object') {
      const result = { ...defaults };
      Object.keys(defaults).forEach((key) => {
        if (typeof defaults[key] === 'object' && !Array.isArray(defaults[key])) {
          result[key] = mergeDefaults(defaults[key], value[key]);
        }
      });
      return { ...result, ...value };
    }
    return value;
  };

  const getSection = useCallback((section) => {
    const existing = state.formData[section];
    if (existing != null && DEFAULTS[section]) {
      return mergeDefaults(DEFAULTS[section], existing);
    }
    if (existing != null) return existing;
    return DEFAULTS[section] != null ? deepClone(DEFAULTS[section]) : existing;
  }, [state.formData]);

  // Enhanced features for Phase 3
  
  // Get completion percentage for entire form
  const getOverallProgress = useCallback(() => {
    const sectionChecks = [
      () => hasAnyData(state.formData.companyInfo),
      () => hasAnyData(state.formData.answerCalls),
      () => hasAnyData(state.formData.onCall),
      () => hasAnyData(state.formData.callRouting),
      () => hasFinalDetailsData(state.formData),
    ];
    const completedSections = sectionChecks.filter((check) => check());
    
    return Math.round((completedSections.length / sectionChecks.length) * 100);
  }, [state.formData]);

  // Get validation errors for a specific step
  const getStepErrors = useCallback((step) => {
    const normalizedStep = normalizeStepSlug(step);

    if (normalizedStep === 'review') {
      return flattenValidationErrors(rawValidateAll(state.formData));
    }

    const validationKeys = STEP_VALIDATION_KEYS[normalizedStep] || [normalizedStep];
    return validationKeys.flatMap((validationKey) => {
      let sectionData;
      if (validationKey === 'officeReach') {
        sectionData = state.formData.companyInfo || {};
      } else if (validationKey === 'onCall.scheduleType') {
        sectionData = state.formData.onCall || {};
      } else {
        sectionData = getValueByPath(state.formData, validationKey);
      }
      const errors = rawValidateSection(validationKey, sectionData);
      return flattenValidationErrors(errors, validationKey);
    });
  }, [state.formData]);

  // Check if a step can be proceeded to (previous steps completed)
  const canProceedToStep = useCallback((targetStep) => {
    const stepOrder = WIZARD_STEPS;
    const normalizedTarget = normalizeStepSlug(targetStep);
    const targetIndex = stepOrder.indexOf(normalizedTarget);
    
    if (targetIndex === -1) return true; // Unknown step, allow
    if (targetIndex === 0) return true; // First step always accessible
    
    // Check if all previous steps have been visited and have minimal data
    for (let i = 0; i < targetIndex; i++) {
      const step = stepOrder[i];
      const dataPath = STEP_DATA_KEYS[step] || step;
      const visited = state.visitedSteps[step] || state.visitedSteps[dataPath];
      if (!visited) return false;
      
      if (step === 'final-details') {
        if (!hasFinalDetailsData(state.formData)) return false;
        continue;
      }

      const sectionData = getValueByPath(state.formData, dataPath) ?? state.formData[step];
      if (!hasAnyData(sectionData)) return false;
    }
    
    return true;
  }, [state.formData, state.visitedSteps]);

  // Generate a human-readable summary
  const generateFormSummary = useCallback((data) => {
    const { formData } = data;
    let summary = 'CLIENT INFORMATION SUMMARY\n';
    summary += '='.repeat(30) + '\n\n';

    if (formData.companyInfo) {
      summary += 'COMPANY INFORMATION:\n';
      const info = formData.companyInfo;
      const formatAddress = (street, suite, city, state, postal) => {
        const parts = [street, suite, city, state, postal].map((part) => part && part.trim()).filter(Boolean);
        return parts.length ? parts.join(', ') : 'Not provided';
      };

      summary += `Business Name: ${info.businessName || info.company || 'Not provided'}\n`;
      summary += `Physical Address: ${formatAddress(info.physicalLocation, info.suiteOrUnit, info.physicalCity, info.physicalState, info.physicalPostalCode)}\n`;
      summary += `Billing Address: ${info.billingSameAsPhysical ? 'Same as physical' : formatAddress(info.billingAddress, info.billingSuite, info.billingCity, info.billingState, info.billingPostalCode)}\n`;

      const primaryContact = info.primaryContact || {};
      const primaryLine = [primaryContact.name, primaryContact.phone, primaryContact.email].filter((value) => value && value.trim()).join(' | ');
      summary += `Primary Contact: ${primaryLine || 'Not provided'}\n`;

      if (info.billingSameAsPrimary) {
        summary += 'Billing Contact: Same as primary\n';
      } else {
        const billingContact = info.billingContact || {};
        const billingLine = [billingContact.name, billingContact.phone, billingContact.email].filter((value) => value && value.trim()).join(' | ');
        summary += `Billing Contact: ${billingLine || 'Not provided'}\n`;
      }

      if (Array.isArray(info.contactChannels) && info.contactChannels.length) {
        summary += 'Contact Channels:\n';
        info.contactChannels.forEach((channel, index) => {
          if (!channel) return;
          const label = channel.type ? channel.type.replace(/-/g, ' ') : `Channel ${index + 1}`;
          summary += `  • ${label}: ${channel.value || 'Not provided'}\n`;
        });
      } else if (info.contactNumbers?.primaryOfficeLine) {
        summary += `Primary Phone: ${info.contactNumbers.primaryOfficeLine}\n`;
      }

      if (Array.isArray(info.additionalLocations) && info.additionalLocations.length) {
        summary += 'Additional Locations:\n';
        info.additionalLocations.forEach((location, index) => {
          if (!location) return;
          const label = location.label || `Location ${index + 1}`;
          const address = formatAddress(location.address, location.suite, location.city, location.state, location.postalCode);
          summary += `  • ${label}: ${address}\n`;
        });
      }

      const plannedTimes = info.plannedTimes || {};
      const holidays = plannedTimes && typeof plannedTimes.holidays === 'object' ? plannedTimes.holidays : null;
      const HOLIDAY_LABELS = {
        newYears: "New Year's Day",
        mlkDay: 'Martin Luther King Jr. Day',
        presidentsDay: "Presidents' Day",
        easter: 'Easter',
        memorialDay: 'Memorial Day',
        juneteenth: 'Juneteenth',
        independenceDay: 'Independence Day',
        laborDay: 'Labor Day',
        columbusDay: 'Columbus Day',
        veteransDay: 'Veterans Day',
        thanksgiving: 'Thanksgiving Day',
        blackFriday: 'Black Friday',
        christmas: 'Christmas Day',
      };

      if (plannedTimes) {
        const plannedFlags = Object.entries(plannedTimes)
          .filter(([key, value]) => key !== 'holidays' && value)
          .map(([key]) => key)
          .join(', ');
        if (plannedFlags) {
          summary += `Planned Service Times: ${plannedFlags}\n`;
        }
      }

      if (holidays) {
        const standardHolidays = Object.entries(holidays)
          .filter(([key, value]) => typeof value === 'boolean' && value && key in HOLIDAY_LABELS)
          .map(([key]) => HOLIDAY_LABELS[key]);

        if (standardHolidays.length) {
          summary += `Observed Holidays: ${standardHolidays.join(', ')}\n`;
        }

        if (Array.isArray(holidays.customDates) && holidays.customDates.length) {
          summary += `Custom Holiday Dates: ${holidays.customDates.join(', ')}\n`;
        }

        if (holidays.easterNotes) {
          summary += `Easter Notes: ${holidays.easterNotes}\n`;
        }
      }

      const legacyHolidayDates = Array.isArray(info.holidays) ? info.holidays : [];
      const plannedHolidayDates = deriveObservedHolidayDates(info.plannedTimes?.holidays || {});
      const mergedHolidayDates = Array.from(new Set([...legacyHolidayDates, ...plannedHolidayDates]));
      if (mergedHolidayDates.length) {
        const formattedHolidays = mergedHolidayDates
          .map((date) => {
            const parsed = new Date(`${date}T00:00:00Z`);
            if (Number.isNaN(parsed.getTime())) {
              return String(date);
            }
            return parsed.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
          })
          .join(', ');
        summary += `Observed Holiday Dates: ${formattedHolidays}\n`;
      }

      if (info.summaryPreferences) {
        const prefs = info.summaryPreferences;
        summary += 'Daily Summary Preferences:\n';
        const recapAnswer = prefs.dailyRecapEnabled === true
          ? 'Yes'
          : prefs.dailyRecapEnabled === false
            ? 'No'
            : 'Not specified';
        summary += `  • Daily Recap: ${recapAnswer}\n`;
      }

      const websiteAccess = info.websiteAccess || {};
      summary += `Website Access Required: ${websiteAccess.required ? 'Yes' : 'No'}\n`;
      if (websiteAccess.required) {
        const loginLabel = websiteAccess.requiresLogin === true
          ? 'Yes'
          : websiteAccess.requiresLogin === false
            ? 'No'
            : 'Not specified';
        summary += `  • Login required: ${loginLabel}\n`;

        if (websiteAccess.requiresLogin) {
          const mfaLabel = websiteAccess.requiresMFA === true
            ? 'Yes'
            : websiteAccess.requiresMFA === false
              ? 'No'
              : 'Not specified';
          summary += `  • MFA required: ${mfaLabel}\n`;

          const difficultyMap = {
            easy: 'Web Easy',
            hard: 'Web Hard',
          };
          const difficulty = websiteAccess.difficulty && websiteAccess.difficulty !== 'unknown'
            ? (difficultyMap[websiteAccess.difficulty] || websiteAccess.difficulty)
            : 'Not specified';
          summary += `  • Handling Complexity: ${difficulty}\n`;

          const flagLabels = [];
          if (websiteAccess.hasCAPTCHA) flagLabels.push('CAPTCHA present');
          if (websiteAccess.autoLogoutAggressive) flagLabels.push('Aggressive auto-logout');
          if (websiteAccess.testComplete) flagLabels.push('Login test complete');
          if (websiteAccess.missingInfo) flagLabels.push('Info still missing');
          if (flagLabels.length) {
            summary += `  • Notes: ${flagLabels.join(', ')}\n`;
          }

          const sites = Array.isArray(websiteAccess.sites) ? websiteAccess.sites : [];
          if (sites.length) {
            summary += '  • Websites:\n';
            sites.forEach((site, idx) => {
              if (!site) return;
              const url = site.url || `Website ${idx + 1}`;
              const parts = [];
              parts.push(url);
              if (site.username) parts.push(`user: ${site.username}`);
              if (site.notes) parts.push(site.notes);
              summary += `      - ${parts.join(' — ')}\n`;
            });
          }
        }
      }

      const volume = info.callVolumeExpectations || {};
      if (volume.weekday || volume.weekend) {
        const weekday = volume.weekday || {};
        const weekend = volume.weekend || {};
        summary += 'Call Volume Expectations:\n';
        summary += `  • Weekday: ${weekday.level || 'Not set'}${weekday.expected ? ` (~${weekday.expected} calls)` : ''}${weekday.custom ? ` – ${weekday.custom}` : ''}\n`;
        summary += `  • Weekend: ${weekend.level || 'Not set'}${weekend.expected ? ` (~${weekend.expected} calls)` : ''}${weekend.custom ? ` – ${weekend.custom}` : ''}\n`;
        if (volume.peakSeasonNotes) {
          summary += `  • Peak Season Notes: ${volume.peakSeasonNotes}\n`;
        }
        if (volume.additionalNotes) {
          summary += `  • Additional Notes: ${volume.additionalNotes}\n`;
        }
      }

      const metrics = formData.metrics || {};
      const callVolume = metrics.callVolume || {};
      const volumeProvided = callVolume.avgDaily || callVolume.peakWindow || callVolume.overnightPct || callVolume.notes;
      if (volumeProvided) {
        summary += 'Call Volume Snapshot:\n';
        if (callVolume.avgDaily) {
          summary += `  • Average daily calls: ${callVolume.avgDaily}\n`;
        }
        if (callVolume.peakWindow) {
          summary += `  • Peak times: ${callVolume.peakWindow}\n`;
        }
        if (callVolume.overnightPct) {
          summary += `  • Overnight percentage: ${callVolume.overnightPct}\n`;
        }
        if (callVolume.notes) {
          summary += `  • Notes: ${callVolume.notes}\n`;
        }
      }

      summary += '\n';
    }

    if (formData.answerCalls) {
  summary += 'CALL HANDLING:\n';
      const BUSINESS_TYPE_LABELS = {
        healthcare: 'Healthcare / Medical',
        legal: 'Legal Services',
        'home-services': 'Home Services / Trades',
        'property-management': 'Property Management / Real Estate',
        'professional-services': 'Professional Services',
        'retail-ecommerce': 'Retail / eCommerce',
        nonprofit: 'Nonprofit / Community',
        other: 'Other',
      };
      const businessTypeValue = formData.answerCalls.businessType;
      summary += `Business Type: ${BUSINESS_TYPE_LABELS[businessTypeValue] || businessTypeValue || 'Not provided'}\n`;
      summary += `Routine: ${formData.answerCalls.routine?.useStandard ? 'Standard' : 'Custom'}\n`;
      summary += `Urgent: ${formData.answerCalls.urgent?.useStandard ? 'Standard' : 'Custom'}\n`;

      const { callTypes } = formData.answerCalls;
      const callTypeLabels = {
        newLead: 'New customer / sales inquiry',
        existingClient: 'Existing client support',
        urgentIssue: 'Urgent or emergency issue',
        serviceRequest: 'Service or maintenance request',
        billingQuestion: 'Billing or account question',
      };

      const formatCallType = (key, value) => {
        const label = callTypeLabels[key] || key;
        const details = [];
        if (value?.instructions) {
          details.push(value.instructions);
        }
        if (value?.urgency) {
          const urgencyLabel = value.urgency === 'urgent' ? 'Urgent' : 'Non-urgent';
          details.push(`Urgency: ${urgencyLabel}`);
        }
        if (value?.whoToReach) {
          details.push(`Reach: ${value.whoToReach}`);
        }
        if (value?.differsAfterHours === true && value?.afterHoursInstructions) {
          details.push(`After-hours: ${value.afterHoursInstructions}`);
        } else if (value?.differsAfterHours === true) {
          details.push('After-hours process differs');
        }
        if (value?.differsAfterHours === false) {
          details.push('Same after hours');
        }
        return `  • ${label}${details.length ? ` — ${details.join(' | ')}` : ''}`;
      };

      if (callTypes && !Array.isArray(callTypes) && typeof callTypes === 'object') {
        const enabledEntries = Object.entries(callTypes)
          .filter(([key, value]) => key !== 'otherText' && value?.enabled);
        if (enabledEntries.length || (typeof callTypes.otherText === 'string' && callTypes.otherText.trim())) {
          summary += 'Call Types:\n';
          enabledEntries.forEach(([key, value]) => {
            summary += `${formatCallType(key, value)}\n`;
          });
          if (callTypes.otherText?.trim()) {
            summary += `  • Other notes: ${callTypes.otherText.trim()}\n`;
          }
        }
      } else if (Array.isArray(callTypes) && callTypes.length) {
        summary += 'Call Types:\n';
        callTypes.forEach((ct, idx) => {
          const label = ct?.name || `Type ${idx + 1}`;
          const info = ct?.instructions ? ` — ${ct.instructions}` : '';
          summary += `  • ${label}${info}\n`;
        });
      }

      summary += '\n';
    }

    if (formData.onCall) {
      const oc = formData.onCall;
      const escalation = Array.isArray(oc.escalation) ? oc.escalation : [];
      if (escalation.length) {
        summary += 'ON-CALL ESCALATION:\n';
        escalation.forEach((step, idx) => {
          const headlineParts = [];
          if (step?.name) headlineParts.push(step.name);
          if (step?.role) headlineParts.push(step.role);
          const headline = headlineParts.length ? headlineParts.join(' — ') : `Step ${idx + 1}`;

          const detailParts = [];
          if (step?.contact) detailParts.push(`Contact: ${step.contact}`);
          if (step?.window) detailParts.push(`Window: ${step.window}`);
          if (step?.notes) detailParts.push(step.notes);

          summary += `  • ${headline}${detailParts.length ? ` — ${detailParts.join(' | ')}` : ''}\n`;
        });
        summary += '\n';
      }
    }

    const attachmentsList = Array.isArray(formData.attachments) ? formData.attachments : [];
    if (attachmentsList.length) {
      summary += 'ATTACHMENTS PROVIDED:\n';
      attachmentsList.forEach((file = {}, index) => {
        const name = file.name || `Attachment ${index + 1}`;
        let sizeLabel = '';
        if (Number.isFinite(Number(file.size))) {
          const size = Number(file.size);
          if (size >= 1024 * 1024) {
            sizeLabel = `${(size / (1024 * 1024)).toFixed(1)} MB`;
          } else if (size >= 1024) {
            sizeLabel = `${Math.round(size / 1024)} KB`;
          } else {
            sizeLabel = `${size} B`;
          }
        }
        const parts = [name];
        if (file.type) parts.push(file.type);
        if (sizeLabel) parts.push(sizeLabel);
        summary += `  • ${parts.join(' — ')}\n`;
      });
      summary += '\n';
    }

    return summary;
  }, []);

  // Export form data in various formats
  const exportFormData = useCallback((format = 'json', includeMetadata = true) => {
    const exportData = {
      formData: state.formData,
      visitedSteps: state.visitedSteps,
    };

    if (includeMetadata) {
      exportData.metadata = {
        exportDate: new Date().toISOString(),
        completionPercentage: getOverallProgress(),
        version: '1.0',
        format,
      };
    }

    switch (format) {
      case 'json':
        return JSON.stringify(exportData, null, 2);
      case 'summary':
        return generateFormSummary(exportData);
      default:
        return exportData;
    }
  }, [state.formData, state.visitedSteps, getOverallProgress, generateFormSummary]);

  // Restore form from backup/export
  const restoreFormData = useCallback((backupData) => {
    try {
      const parsed = typeof backupData === 'string' ? JSON.parse(backupData) : backupData;
      if (parsed.formData) {
        dispatch({ type: 'LOAD_DRAFT', payload: parsed });
        return true;
      }
      return false;
    } catch (error) {
      logger.error('Failed to restore form data:', error);
      return false;
    }
  }, []);

  // Advanced validation with field dependencies
  const validateStepWithDependencies = useCallback((step) => {
    const basicErrors = getStepErrors(step);
    return basicErrors;
  }, [getStepErrors]);

  const contextValue = useMemo(() => ({
    // Original values
    formData: state.formData,
    visitedSteps: state.visitedSteps,
    updateSection,
    markStepVisited,
    loadDraft,
    validateSection,
    validateAll,
    getSection,
    
    // Enhanced Phase 3 features
    getOverallProgress,
    getStepErrors,
    canProceedToStep,
    exportFormData,
    restoreFormData,
    validateStepWithDependencies,
    
    // Computed properties
    isFormComplete: getOverallProgress() === 100,
    currentStep: Object.keys(state.visitedSteps).pop() || 'start',
  }), [
    state.formData,
    state.visitedSteps,
    updateSection,
    markStepVisited,
    loadDraft,
    validateSection,
    validateAll,
    getSection,
    getOverallProgress,
    getStepErrors,
    canProceedToStep,
    exportFormData,
    restoreFormData,
    validateStepWithDependencies,
  ]);

  return (
    <WizardContext.Provider value={contextValue}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => useContext(WizardContext);

export const __TESTING__ = {
  STEP_DATA_KEYS,
  normalizeStepSlug,
  getValueByPath,
  hasAnyData,
  hasFinalDetailsData,
};
