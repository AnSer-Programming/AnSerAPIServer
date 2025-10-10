// 📁 src/pages/ClientInfo/constants/routes.js
// Centralized route constants to avoid typos and improve maintainability

export const WIZARD_BASE = '/ClientInfoReact/NewFormWizard';

export const WIZARD_ROUTES = {
  BASE: '/ClientInfoReact',
  ADMIN_INVITE: '/ClientInfoReact/admin-invite',
  INVITE: (token) => `/ClientInfoReact/invite/${token}`,
  
  // Wizard steps
  COMPANY_INFO: `${WIZARD_BASE}/company-info`,
  OFFICE_REACH: `${WIZARD_BASE}/office-reach`, 
  CALL_VOLUME: `${WIZARD_BASE}/call-volume`,
  ANSWER_CALLS: `${WIZARD_BASE}/answer-calls`,
  ON_CALL: `${WIZARD_BASE}/on-call`,
  FINAL_DETAILS: `${WIZARD_BASE}/final-details`,
  REVIEW: `${WIZARD_BASE}/review`,
  FAST_TRACK: '/ClientInfoReact/fast-track',
};

export const WIZARD_STEPS = [
  'company-info',
  'office-reach', 
  'call-volume',
  'answer-calls',
  'on-call',
  'final-details',
  'review'
];

export const STEP_LABELS = {
  'company-info': 'Company Information',
  'office-reach': 'Office Reach',
  'call-volume': 'Call Volume',
  'answer-calls': 'Answer Calls',
  'on-call': 'On Call',
  'final-details': 'Final Details',
  'review': 'Review & Submit'
};
