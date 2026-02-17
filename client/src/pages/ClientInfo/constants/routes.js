// src/pages/ClientInfo/constants/routes.js
// Centralized route constants to avoid typos and improve maintainability.

export const WIZARD_BASE = '/ClientInfoReact/NewFormWizard';

export const WIZARD_ROUTES = {
  BASE: '/ClientInfoReact',

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

export const WIZARD_LINKS = [
  { slug: 'company-info', label: 'Company Information', to: WIZARD_ROUTES.COMPANY_INFO },
  { slug: 'answer-calls', label: 'Answer Calls', to: WIZARD_ROUTES.ANSWER_CALLS },
  { slug: 'on-call', label: 'On Call Setup', to: WIZARD_ROUTES.ON_CALL },
  { slug: 'team-setup', label: 'Team Setup', to: WIZARD_ROUTES.ON_CALL_TEAMS },
  { slug: 'escalation-details', label: 'Escalation & Rotation Details', to: WIZARD_ROUTES.ON_CALL_ESCALATION },
  { slug: 'call-routing', label: 'Call Routing', to: WIZARD_ROUTES.CALL_ROUTING },
  { slug: 'office-reach', label: 'Other Info', to: WIZARD_ROUTES.OFFICE_REACH },
  { slug: 'final-details', label: 'Final Details', to: WIZARD_ROUTES.FINAL_DETAILS },
  { slug: 'review', label: 'Review & Submit', to: WIZARD_ROUTES.REVIEW },
];

export const WIZARD_STEPS = WIZARD_LINKS.map(({ slug }) => slug);

export const STEP_LABELS = Object.fromEntries(
  WIZARD_LINKS.map(({ slug, label }) => [slug, label])
);

export const CLIENTINFO_NAV_ITEMS = [
  { label: 'HOME', to: WIZARD_ROUTES.BASE },
  { label: 'COMPANY INFORMATION', to: WIZARD_ROUTES.COMPANY_INFO },
  { label: 'HOW TO ANSWER YOUR CALLS', to: WIZARD_ROUTES.ANSWER_CALLS },
  { label: 'ON-CALL SETUP', to: WIZARD_ROUTES.ON_CALL },
  { label: 'OTHER INFO', to: WIZARD_ROUTES.OFFICE_REACH },
  { label: 'FINAL DETAILS', to: WIZARD_ROUTES.FINAL_DETAILS },
];
