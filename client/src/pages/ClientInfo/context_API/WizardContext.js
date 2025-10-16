import React, { createContext, useReducer, useContext, useCallback, useMemo } from 'react';
import useAutosave from '../utils/useAutosave';
import {
  validateSection as rawValidateSection,
  validateAll as rawValidateAll,
} from '../utils/validators';
import * as mockInviteService from './mockInviteService';

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
    mailingAddress: '',
    mailingSuite: '',
    mailingCity: '',
    mailingState: '',
    mailingPostalCode: '',
    mailingSameAsPhysical: false,
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
      realTimeChannels: [],
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
  metrics: {
    callVolume: {
      avgDaily: '',
      peakWindow: '',
      overnightPct: '',
      notes: '',
    },
  },
  fastTrack: {
    enabled: false,
    highCallVolumeExpected: false,
    payment: {
      cardholderName: '',
      cardBrand: '',
      cardLast4: '',
      billingZip: '',
      rushFeeAccepted: false,
      authorization: false,
      notes: '',
    },
    onCallContacts: [
      { id: 'contact-1', name: '', role: '', phone: '', email: '', availability: 'Daytime (Week 1)' },
      { id: 'contact-2', name: '', role: '', phone: '', email: '', availability: 'Evening (Week 1)' },
    ],
    callTypeSlots: [
      { id: 'urgent', label: 'Urgent / Emergencies', instructions: '', afterHoursNotes: '' },
      { id: 'routine', label: 'Routine / Standard', instructions: '', afterHoursNotes: '' },
      { id: 'overflow', label: 'Overflow / Backup', instructions: '', afterHoursNotes: '' },
      { id: 'custom', label: 'Custom Requests', instructions: '', afterHoursNotes: '' },
    ],
    meeting: {
      platform: 'teams',
      date: '',
      time: '',
      timezone: '',
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

      return {
        ...state,
        formData: {
          ...state.formData,
          [section]: nextSection,
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
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
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

  // Initialize wizard state from an invite token.
  // This uses the local mockInviteService by default. When moving to a server,
  // replace the mock calls with real fetches (examples commented below).
  const initializeFromInvite = useCallback(async (token) => {
    const inviteRes = await mockInviteService.getInviteByToken(token);
    if (!inviteRes.ok) {
      throw new Error('Invalid or expired token');
    }
    const { clientId, targetStep, formData: inviteForm } = inviteRes.data;

    // If invite payload included a snapshot, seed it directly.
    if (inviteForm && Object.keys(inviteForm).length) {
      dispatch({ type: 'LOAD_DRAFT', payload: { formData: inviteForm, visitedSteps: {} } });
    } else {
      // Otherwise attempt to fetch full wizard state (mocked here).
      const stateRes = await mockInviteService.getWizardStateByClientId(clientId, token);
      if (stateRes.ok && stateRes.data) {
        dispatch({ type: 'LOAD_DRAFT', payload: stateRes.data });
      }
    }

    // Example real server calls (commented):
    // const inviteResp = await fetch(`/api/wizard/invite/${token}`);
    // if (!inviteResp.ok) throw new Error('Invalid or expired token');
    // const inviteJson = await inviteResp.json();
    // const serverState = await fetch(`/api/wizard/state?token=${token}&clientId=${inviteJson.clientId}`);
    // if (serverState.ok) { const js = await serverState.json(); dispatch({ type: 'LOAD_DRAFT', payload: js }); }

    return targetStep || 'start';
  }, []);

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
    const sections = ['companyInfo', 'officeReach', 'metrics', 'answerCalls', 'onCall', 'finalDetails'];
    const completedSections = sections.filter(section => {
      const sectionData = state.formData[section];
      if (!sectionData) return false;
      
      // Basic completion check - has any data
      const hasData = Object.values(sectionData).some(value => {
        if (typeof value === 'string') return value.trim().length > 0;
        if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
        return value !== null && value !== undefined;
      });
      
      return hasData;
    });
    
    return Math.round((completedSections.length / sections.length) * 100);
  }, [state.formData]);

  // Get validation errors for a specific step
  const getStepErrors = useCallback((step) => {
    const sectionData = state.formData[step] || {};
    const errors = rawValidateSection(step, sectionData);
    if (!errors) return [];
    return Object.entries(errors).map(([field, message]) => ({ field, message }));
  }, [state.formData]);

  // Check if a step can be proceeded to (previous steps completed)
  const canProceedToStep = useCallback((targetStep) => {
    const stepOrder = ['companyInfo', 'officeReach', 'metrics', 'answerCalls', 'onCall', 'finalDetails'];
    const targetIndex = stepOrder.indexOf(targetStep);
    
    if (targetIndex === -1) return true; // Unknown step, allow
    if (targetIndex === 0) return true; // First step always accessible
    
    // Check if all previous steps have been visited and have minimal data
    for (let i = 0; i < targetIndex; i++) {
      const step = stepOrder[i];
      if (!state.visitedSteps[step]) return false;
      
      const sectionData = state.formData[step];
      if (!sectionData || Object.keys(sectionData).length === 0) return false;
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
      summary += `Mailing Address: ${info.mailingSameAsPhysical ? 'Same as physical' : formatAddress(info.mailingAddress, info.mailingSuite, info.mailingCity, info.mailingState, info.mailingPostalCode)}\n`;

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

      if (Array.isArray(info.holidays) && info.holidays.length) {
        const formattedHolidays = info.holidays
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
        const channelLabels = {
          email: 'Email',
          text: 'Text',
          fax: 'Fax',
        };
        const channels = Array.isArray(prefs.realTimeChannels)
          ? prefs.realTimeChannels.map((ch) => channelLabels[ch] || ch.toString().toUpperCase())
          : [];
        summary += `  • Real-time Messages: ${channels.length ? channels.join(', ') : 'Not specified'}\n`;
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

    if (formData.fastTrack && formData.fastTrack.enabled) {
      const ft = formData.fastTrack || {};
      const payment = ft.payment || {};
      const contacts = Array.isArray(ft.onCallContacts) ? ft.onCallContacts : [];
  const slots = Array.isArray(ft.callTypeSlots) ? ft.callTypeSlots : [];
  const meeting = ft.meeting || {};
  const highCallVolume = Boolean(ft.highCallVolumeExpected);

      const formatMeetingDate = (value) => {
        if (!value) return 'Not provided';
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return value;
        return parsed.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      };

      const formatMeetingTime = (value) => {
        if (!value) return 'Not provided';
        const str = String(value).trim();
        const meridiemMatch = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (meridiemMatch) {
          const hours = Number(meridiemMatch[1]) % 12 || 12;
          const minutes = meridiemMatch[2];
          const meridiem = meridiemMatch[3].toUpperCase();
          return `${hours}:${minutes} ${meridiem}`;
        }
        const militaryMatch = str.match(/^(\d{1,2}):(\d{2})$/);
        if (militaryMatch) {
          let hour = Number(militaryMatch[1]);
          const minutes = militaryMatch[2];
          const meridiem = hour >= 12 ? 'PM' : 'AM';
          hour = hour % 12 || 12;
          return `${hour}:${minutes} ${meridiem}`;
        }
        return str;
      };

      summary += 'FAST TRACK LAUNCH:\n';

      const paymentParts = [];
      if (payment.cardholderName) paymentParts.push(payment.cardholderName);
      if (payment.cardBrand) paymentParts.push(payment.cardBrand);
      if (payment.cardLast4) paymentParts.push(`**** ${payment.cardLast4}`);
      summary += `Payment: ${paymentParts.length ? paymentParts.join(' • ') : 'Details pending'}\n`;
      summary += `Billing ZIP: ${payment.billingZip || 'Not provided'}\n`;
      summary += `Rush fee accepted: ${payment.rushFeeAccepted ? 'Yes' : 'No'}\n`;
      summary += `Authorization: ${payment.authorization ? 'Approved' : 'Pending'}\n`;
      if (payment.notes) {
        summary += `Payment notes: ${payment.notes}\n`;
      }

      summary += `High call volume expected: ${highCallVolume ? 'Yes (scale staffing during launch)' : 'No'}\n`;

      if (contacts.length) {
        summary += 'Launch contacts:\n';
        contacts.forEach((contact, index) => {
          if (!contact) return;
          const label = contact.name || `Contact ${index + 1}`;
          const details = [];
          if (contact.role) details.push(contact.role);
          if (contact.phone) details.push(`Phone: ${contact.phone}`);
          if (contact.email) details.push(`Email: ${contact.email}`);
          if (contact.availability) details.push(contact.availability);
          summary += `  • ${label}${details.length ? ` — ${details.join(' | ')}` : ''}\n`;
        });
      }

      if (slots.length) {
        summary += 'Rapid call scenarios:\n';
        slots.forEach((slot, index) => {
          if (!slot) return;
          const label = slot.label || slot.id || `Scenario ${index + 1}`;
          const parts = [];
          if (slot.instructions) parts.push(slot.instructions);
          if (slot.afterHoursNotes) parts.push(`After-hours: ${slot.afterHoursNotes}`);
          summary += `  • ${label}${parts.length ? ` — ${parts.join(' | ')}` : ''}\n`;
        });
      }

      const meetingParts = [];
      if (meeting.platform) {
        const platformLabels = {
          teams: 'Microsoft Teams',
          zoom: 'Zoom',
          phone: 'Phone Call',
          'google-meet': 'Google Meet',
          other: 'Other',
        };
        meetingParts.push(platformLabels[meeting.platform] || meeting.platform);
      }
      if (meeting.date || meeting.time) {
        meetingParts.push(`${formatMeetingDate(meeting.date)} at ${formatMeetingTime(meeting.time)}`);
      }
      if (meeting.timezone) {
        meetingParts.push(`Timezone: ${meeting.timezone}`);
      }
      if (meeting.notes) {
        meetingParts.push(`Notes: ${meeting.notes}`);
      }
      if (meetingParts.length) {
        summary += `Kickoff meeting: ${meetingParts.join(' | ')}\n`;
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
      console.error('Failed to restore form data:', error);
      return false;
    }
  }, []);

  // Advanced validation with field dependencies
  const validateStepWithDependencies = useCallback((step) => {
    const basicErrors = getStepErrors(step);
    // Add dependency-based validation here
    // This would integrate with the useFieldDependencies hook
    return basicErrors;
  }, [getStepErrors]);

  const contextValue = useMemo(() => ({
    // Original values
    formData: state.formData,
    visitedSteps: state.visitedSteps,
    updateSection,
    markStepVisited,
    loadDraft,
    initializeFromInvite,
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
    initializeFromInvite,
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
