/**
 * Test utilities for ClientInfo module
 * 
 * This file provides reusable testing utilities, mock data, and wrapper components
 * for testing ClientInfo components.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { WizardProvider } from '../context_API/WizardContext';
import { ClientInfoThemeProvider } from '../context_API/ClientInfoThemeContext';

// =============================================================================
// TEST THEME
// =============================================================================

export const testTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

// =============================================================================
// WRAPPER COMPONENT
// =============================================================================

/**
 * All-in-one wrapper for testing ClientInfo components
 * Provides Router, Theme, and Wizard context
 */
export const AllProviders = ({ children, initialWizardState = {} }) => (
  <BrowserRouter>
    <ThemeProvider theme={testTheme}>
      <ClientInfoThemeProvider>
        <WizardProvider initialState={initialWizardState}>
          {children}
        </WizardProvider>
      </ClientInfoThemeProvider>
    </ThemeProvider>
  </BrowserRouter>
);

/**
 * Custom render function with all providers
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Render options
 * @param {Object} options.initialWizardState - Initial wizard state
 * @returns {RenderResult} - RTL render result
 */
export const renderWithProviders = (ui, { initialWizardState = {}, ...options } = {}) => {
  const Wrapper = ({ children }) => (
    <AllProviders initialWizardState={initialWizardState}>
      {children}
    </AllProviders>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// =============================================================================
// MOCK DATA
// =============================================================================

export const mockCompanyInfo = {
  businessName: 'Test Medical Clinic',
  company: 'Test Medical Group LLC',
  physicalLocation: '123 Main Street',
  suiteOrUnit: 'Suite 100',
  physicalCity: 'Seattle',
  physicalState: 'WA',
  physicalPostalCode: '98101',
  contactNumbers: {
    primaryOfficeLine: '206-555-1234',
    officeEmail: 'test@example.com',
  },
  officeHours: {
    monday: { open: '08:00', close: '17:00', closed: false },
    tuesday: { open: '08:00', close: '17:00', closed: false },
    wednesday: { open: '08:00', close: '17:00', closed: false },
    thursday: { open: '08:00', close: '17:00', closed: false },
    friday: { open: '08:00', close: '17:00', closed: false },
    saturday: { closed: true },
    sunday: { closed: true },
  },
  timeZone: 'PST',
};

export const mockAnswerCalls = {
  routine: {
    useStandard: true,
    custom: '',
  },
  urgent: {
    useStandard: true,
    custom: '',
  },
  callTypes: [],
};

export const mockOnCall = {
  team: [
    {
      id: 'member-1',
      name: 'Dr. Smith',
      cellPhone: ['555-123-4567'],
      email: ['dr.smith@example.com'],
    },
  ],
  rotation: {
    frequency: 'weekly',
    whenChanges: 'Monday',
    changeBeginsTime: '08:00 AM',
  },
  procedures: {
    attempts: 3,
    minutesBetweenAttempts: 5,
    stopAfterSuccessfulContact: true,
    leaveVoicemail: true,
  },
  schedules: [],
  escalation: [],
  departments: [],
  contactRules: {},
  notificationRules: {},
};

export const mockFormData = {
  companyInfo: mockCompanyInfo,
  answerCalls: mockAnswerCalls,
  onCall: mockOnCall,
  attachments: [],
  fastTrack: { enabled: false },
};

// =============================================================================
// MOCK FUNCTIONS
// =============================================================================

/**
 * Create a mock onChange function that tracks calls
 */
export const createMockOnChange = () => {
  const calls = [];
  const fn = (value) => {
    calls.push(value);
    return value;
  };
  fn.getCalls = () => calls;
  fn.getLastCall = () => calls[calls.length - 1];
  fn.reset = () => { calls.length = 0; };
  return fn;
};

/**
 * Mock localStorage for testing
 */
export const mockLocalStorage = () => {
  const store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { Object.keys(store).forEach(key => delete store[key]); }),
    get store() { return { ...store }; },
  };
};

// =============================================================================
// ASSERTION HELPERS
// =============================================================================

/**
 * Wait for element to appear with custom timeout
 */
export const waitForElement = async (getElement, timeout = 3000) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const element = getElement();
      if (element) return element;
    } catch (e) {
      // Element not found yet
    }
    await new Promise(resolve => setTimeout(resolve, 50));
  }
  throw new Error('Element not found within timeout');
};

/**
 * Check if form field has error state
 */
export const hasErrorState = (element) => {
  return element.classList.contains('Mui-error') ||
    element.getAttribute('aria-invalid') === 'true';
};

// =============================================================================
// EXPORTS
// =============================================================================

export default {
  renderWithProviders,
  AllProviders,
  testTheme,
  mockCompanyInfo,
  mockAnswerCalls,
  mockOnCall,
  mockFormData,
  createMockOnChange,
  mockLocalStorage,
  waitForElement,
  hasErrorState,
};
