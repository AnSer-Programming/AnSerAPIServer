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
  ANSWER_CALLS: `${WIZARD_BASE}/answer-calls`,
  ON_CALL: `${WIZARD_BASE}/on-call`,
  ON_CALL_TEAMS: `${WIZARD_BASE}/team-setup`,
  ON_CALL_ESCALATION: `${WIZARD_BASE}/escalation-details`,
  CALL_ROUTING: `${WIZARD_BASE}/call-routing`,
  FINAL_DETAILS: `${WIZARD_BASE}/final-details`,
  REVIEW: `${WIZARD_BASE}/review`,
};

export const WIZARD_STEPS = [
  'company-info',
  'answer-calls',
  'on-call',
  'team-setup',
  'escalation-details',
  'call-routing',
  'office-reach',
  'final-details',
  'review'
];

export const STEP_LABELS = {
  'company-info': 'Company Information',
  'answer-calls': 'Answer Calls',
  'on-call': 'On Call Setup',
  'team-setup': 'Team Setup',
  'escalation-details': 'Escalation & Rotation Details',
  'call-routing': 'Call Routing',
  'office-reach': 'Other Info',
  'final-details': 'Final Details',
  'review': 'Review & Submit'
};
