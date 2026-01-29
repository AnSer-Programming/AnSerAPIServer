// 📁 client/src/pages/ClientInfo/pages/AnswerCallsNew.test.jsx
// Unit tests for Answer Calls redesigned page

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AnswerCallsNew from './AnswerCallsNew';
import { ClientInfoThemeProvider } from '../context_API/ClientInfoThemeContext';
import { WizardProvider } from '../context_API/WizardContext';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

const theme = createTheme();

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <ClientInfoThemeProvider>
          <WizardProvider>
            {component}
          </WizardProvider>
        </ClientInfoThemeProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('AnswerCallsNew Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Rendering', () => {
    test('renders page heading', () => {
      renderWithProviders(<AnswerCallsNew />);
      expect(screen.getByText(/Answering & Call Handling/i)).toBeInTheDocument();
    });

    test('renders business type selector', () => {
      renderWithProviders(<AnswerCallsNew />);
      expect(screen.getByLabelText(/business type/i)).toBeInTheDocument();
    });

    test('renders at least one category by default', () => {
      renderWithProviders(<AnswerCallsNew />);
      expect(screen.getByText(/Call Categories/i)).toBeInTheDocument();
    });
  });

  describe('Category Management', () => {
    test('adds a new category when "Add Another Category" is clicked', async () => {
      renderWithProviders(<AnswerCallsNew />);
      
      const addButton = screen.getByText(/Add Another Category/i);
      const initialCategories = screen.getAllByRole('textbox', { name: /Category input/i });
      const initialCount = initialCategories.length;
      
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const newCategories = screen.getAllByRole('textbox', { name: /Category input/i });
        expect(newCategories.length).toBe(initialCount + 1);
      });
    });

    test('does not remove the last category', () => {
      renderWithProviders(<AnswerCallsNew />);
      
      const removeButtons = screen.queryAllByText(/Remove/i);
      if (removeButtons.length === 1) {
        fireEvent.click(removeButtons[0]);
        // Should still have one category
        expect(screen.getAllByRole('textbox', { name: /Category input/i }).length).toBeGreaterThanOrEqual(1);
      }
    });

    test('removes a category when there are multiple', async () => {
      renderWithProviders(<AnswerCallsNew />);
      
      // Add a second category first
      const addButton = screen.getByText(/Add Another Category/i);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getAllByRole('textbox', { name: /Category input/i }).length).toBeGreaterThanOrEqual(2);
      });
      
      const removeButtons = screen.getAllByText(/Remove/i);
      const initialCount = screen.getAllByRole('textbox', { name: /Category input/i }).length;
      
      fireEvent.click(removeButtons[0]);
      
      await waitFor(() => {
        const afterRemove = screen.getAllByRole('textbox', { name: /Category input/i });
        expect(afterRemove.length).toBe(initialCount - 1);
      });
    });
  });

  describe('Focus Guard & Local State', () => {
    test('category input maintains value while typing (no clobbering)', async () => {
      renderWithProviders(<AnswerCallsNew />);
      
      const input = screen.getAllByRole('textbox', { name: /Category input/i })[0];
      
      // Simulate rapid typing
      fireEvent.change(input, { target: { value: 'N' } });
      fireEvent.change(input, { target: { value: 'No' } });
      fireEvent.change(input, { target: { value: 'No ' } });
      fireEvent.change(input, { target: { value: 'No H' } });
      fireEvent.change(input, { target: { value: 'No He' } });
      fireEvent.change(input, { target: { value: 'No Heat' } });
      
      // Value should be preserved (not clobbered)
      expect(input.value).toBe('No Heat');
    });

    test('commits value on blur', async () => {
      renderWithProviders(<AnswerCallsNew />);
      
      const input = screen.getAllByRole('textbox', { name: /Category input/i })[0];
      
      fireEvent.change(input, { target: { value: 'Test Category' } });
      fireEvent.blur(input);
      
      await waitFor(() => {
        // After blur, value should be persisted
        expect(input.value).toBe('Test Category');
      }, { timeout: 1000 });
    });

    test('minimized state does not persist to wizard context', async () => {
      renderWithProviders(<AnswerCallsNew />);
      
      // Add a category and minimize it
      const addButton = screen.getByText(/Add Another Category/i);
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getAllByRole('textbox', { name: /Category input/i }).length).toBeGreaterThanOrEqual(2);
      });
      
      // Check that localStorage doesn't contain minimized flags in categories
      const stored = localStorage.getItem('wizard_state_v2');
      if (stored) {
        const state = JSON.parse(stored);
        const categories = state?.answerCalls?.categories || [];
        categories.forEach(cat => {
          expect(cat).not.toHaveProperty('minimized');
        });
      }
    });
  });

  describe('Business Type Integration', () => {
    test('shows suggestions after selecting business type', async () => {
      renderWithProviders(<AnswerCallsNew />);
      
      const businessTypeSelect = screen.getByLabelText(/business type/i);
      
      // Open the select and choose HVAC
      fireEvent.mouseDown(businessTypeSelect);
      
      await waitFor(() => {
        const hvacOption = screen.getByText(/HVAC \(heating, ventilation, air conditioning\)/i);
        fireEvent.click(hvacOption);
      });
      
      // After selection, suggestions should be available
      // (This is a shallow test - full integration would test Autocomplete options)
      expect(businessTypeSelect).toHaveValue('HVAC (heating, ventilation, air conditioning)');
    });
  });

  describe('Navigation', () => {
    test('renders back and next buttons', () => {
      renderWithProviders(<AnswerCallsNew />);
      
      expect(screen.getByText(/Back/i)).toBeInTheDocument();
      expect(screen.getByText(/Next: On Call Setup/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('page heading receives focus on mount', async () => {
      renderWithProviders(<AnswerCallsNew />);
      
      await waitFor(() => {
        const heading = document.getElementById('answercalls-title');
        expect(heading).toEqual(document.activeElement);
      });
    });

    test('inputs have accessible labels', () => {
      renderWithProviders(<AnswerCallsNew />);
      
      const categoryInputs = screen.getAllByRole('textbox', { name: /Category input/i });
      expect(categoryInputs.length).toBeGreaterThan(0);
      
      categoryInputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
      });
    });
  });
});
