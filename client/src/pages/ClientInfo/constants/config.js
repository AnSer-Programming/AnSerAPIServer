/**
 * ClientInfo Module Constants
 * 
 * Centralized constants file for magic numbers, validation limits, and configuration values.
 * Import from this file instead of using hardcoded values throughout the codebase.
 */

// =============================================================================
// FILE SIZE LIMITS
// =============================================================================

/** Maximum file size for attachments (25 MB) */
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

/** File size in MB for display purposes */
export const MAX_FILE_SIZE_MB = 25;

/** Bytes per kilobyte */
export const BYTES_PER_KB = 1024;

/** Bytes per megabyte */
export const BYTES_PER_MB = 1024 * 1024;

// =============================================================================
// TEXT LENGTH LIMITS
// =============================================================================

/** Maximum length for business name */
export const MAX_BUSINESS_NAME_LENGTH = 200;

/** Minimum length for business name */
export const MIN_BUSINESS_NAME_LENGTH = 2;

/** Maximum length for custom greeting/prompt text */
export const MAX_CUSTOM_PROMPT_LENGTH = 300;

/** Maximum length for general notes fields */
export const MAX_NOTES_LENGTH = 500;

/** Maximum length for detailed notes (e.g., meeting notes) */
export const MAX_DETAILED_NOTES_LENGTH = 600;

/** Maximum length for large text areas (e.g., otherText) */
export const MAX_LARGE_TEXT_LENGTH = 2000;

/** Maximum length for rotation procedure notes */
export const MAX_ROTATION_NOTES_LENGTH = 1000;

/** Maximum length for escalation window description */
export const MAX_ESCALATION_WINDOW_LENGTH = 120;

/** Maximum length for file type description */
export const MAX_FILE_TYPE_LENGTH = 120;

/** Maximum length for timezone string */
export const MAX_TIMEZONE_LENGTH = 80;

// =============================================================================
// SOCIAL MEDIA HANDLE LIMITS
// =============================================================================

/** Minimum length for social media handles */
export const MIN_HANDLE_LENGTH = 1;

/** Maximum length for social media handles */
export const MAX_HANDLE_LENGTH = 30;

// =============================================================================
// FORM CONFIGURATION
// =============================================================================

/** Default autosave debounce delay in milliseconds */
export const AUTOSAVE_DEBOUNCE_MS = 800;

/** Draft storage key for localStorage */
export const WIZARD_DRAFT_KEY = 'anser_wizard_draft';

/** Legacy draft storage key */
export const LEGACY_DRAFT_KEY = 'clientWizardDraft';

// =============================================================================
// TIME PICKER OPTIONS
// =============================================================================

/** Hours for 12-hour time picker (01-12) */
export const HOURS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

/** Common minute intervals */
export const MINUTE_INTERVALS = ['00', '15', '30', '45'];

/** Meridiem options */
export const MERIDIEMS = ['AM', 'PM'];

// =============================================================================
// VALIDATION MESSAGES
// =============================================================================

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  BUSINESS_NAME_TOO_SHORT: `Business name must be at least ${MIN_BUSINESS_NAME_LENGTH} characters`,
  BUSINESS_NAME_TOO_LONG: `Business name cannot exceed ${MAX_BUSINESS_NAME_LENGTH} characters`,
  NOTES_TOO_LONG: `Notes cannot exceed ${MAX_NOTES_LENGTH} characters`,
  FILE_TOO_LARGE: `File size cannot exceed ${MAX_FILE_SIZE_MB} MB`,
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  HANDLE_TOO_SHORT: `Handle must be at least ${MIN_HANDLE_LENGTH} character`,
  HANDLE_TOO_LONG: `Handle cannot exceed ${MAX_HANDLE_LENGTH} characters`,
};

// =============================================================================
// UI CONFIGURATION
// =============================================================================

/** Animation/transition delays in milliseconds */
export const UI_DELAYS = {
  MOUNT_DELAY: 100,
  PROGRESS_HIDE_DELAY: 2000,
  LOADING_SIMULATION: 300,
  INVITE_FETCH_DELAY: 350,
};

/** Default pagination settings */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// =============================================================================
// MEETING TYPES
// =============================================================================

export const MEETING_TYPES = {
  VIDEO: 'video',
  PHONE: 'phone',
  IN_PERSON: 'in-person',
};

export const MEETING_TYPE_LABELS = {
  [MEETING_TYPES.VIDEO]: {
    label: 'Video Call',
    details: 'Microsoft Teams or Zoom',
  },
  [MEETING_TYPES.PHONE]: {
    label: 'Phone Call',
    details: 'Traditional phone consultation',
  },
  [MEETING_TYPES.IN_PERSON]: {
    label: 'In-Person Meeting',
    details: 'Meet at our office',
  },
};

// =============================================================================
// CALL TYPES
// =============================================================================

export const CALL_TYPE_LABELS = {
  newLead: 'New Lead/Inquiry',
  existingClient: 'Existing Client',
  urgentIssue: 'Urgent Issue',
  serviceRequest: 'Service Request',
  billingQuestion: 'Billing Question',
};

// =============================================================================
// WIZARD STEPS
// =============================================================================

export const WIZARD_STEPS = [
  'company-info',
  'answer-calls',
  'on-call',
  'call-routing',
  'office-reach',
  'final-details',
  'review',
];

export const WIZARD_STEP_LABELS = {
  'company-info': 'Company Information',
  'answer-calls': 'Answer Calls',
  'on-call': 'On-Call Setup',
  'call-routing': 'Call Routing',
  'office-reach': 'Office & Availability',
  'final-details': 'Final Details',
  'review': 'Review & Submit',
};
