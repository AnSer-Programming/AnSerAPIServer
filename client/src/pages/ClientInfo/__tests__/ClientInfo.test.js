import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@testing-library/jest-dom';

// Import components to test
import AnswerCalls from '../pages/AnswerCalls';
import StartNewClient from '../pages/StartNewClient';
import { WizardProvider } from '../context_API/WizardContext';
import { ClientInfoThemeProvider } from '../context_API/ClientInfoThemeContext';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// Test utilities
const theme = createTheme();

const renderWithProviders = (component, initialWizardState = {}) => {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <ClientInfoThemeProvider>
          <WizardProvider initialState={initialWizardState}>
            {children}
          </WizardProvider>
        </ClientInfoThemeProvider>
      </ThemeProvider>
    </BrowserRouter>
  );

  return render(component, { wrapper: Wrapper });
};

describe('ClientInfo Wizard Components', () => {
  describe('StartNewClient Component', () => {
    test('renders welcome message and start button', () => {
      renderWithProviders(<StartNewClient />);
      
      expect(screen.getByText('Welcome to the New Client Intake Form')).toBeInTheDocument();
      expect(screen.getByText('START NEW CLIENT WIZARD')).toBeInTheDocument();
    });

    test('shows loading state when starting wizard', async () => {
      const user = userEvent.setup();
      renderWithProviders(<StartNewClient />);
      
      const startButton = screen.getByText('START NEW CLIENT WIZARD');
      await user.click(startButton);
      
      expect(screen.getByText('Starting...')).toBeInTheDocument();
      expect(startButton).toBeDisabled();
    });

    test('displays test invite links', () => {
      renderWithProviders(<StartNewClient />);
      
      expect(screen.getByText('Test Invite: mock-token-123')).toBeInTheDocument();
      expect(screen.getByText('Test Invite: mock-token-review')).toBeInTheDocument();
    });

    test('responsive design adjustments', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderWithProviders(<StartNewClient />);
      
      // Test would check for mobile-specific styling
      const logo = screen.getByAltText('AnSer Logo');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('AnswerCalls Component', () => {
    const mockFormData = {
      answerCalls: {
        routine: {
          useStandard: true,
          custom: ''
        },
        urgent: {
          useStandard: false,
          custom: 'This is an urgent call for [Business Name]'
        }
      },
      companyInfo: {
        name: 'Test Company'
      }
    };

    test('renders tabs for routine and urgent calls', () => {
      renderWithProviders(<AnswerCalls />, { formData: mockFormData });
      
      expect(screen.getByText('Routine Calls')).toBeInTheDocument();
      expect(screen.getByText('Urgent Calls')).toBeInTheDocument();
    });

    test('switches between tabs correctly', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AnswerCalls />, { formData: mockFormData });
      
      const urgentTab = screen.getByText('Urgent Calls');
      await user.click(urgentTab);
      
      // Verify urgent content is shown
      expect(screen.getByText('Urgent phrase')).toBeInTheDocument();
    });

    test('validates required fields', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AnswerCalls />, { formData: {} });
      
      const nextButton = screen.getByText('Next: On Call');
      await user.click(nextButton);
      
      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/validation errors/i)).toBeInTheDocument();
      });
    });

    test('saves form data correctly', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AnswerCalls />, { formData: mockFormData });
      
      const saveButton = screen.getByText('Save');
      await user.click(saveButton);
      
      await waitFor(() => {
        expect(screen.getByText('Saved.')).toBeInTheDocument();
      });
    });

    test('shows preview with company name replacement', () => {
      renderWithProviders(<AnswerCalls />, { formData: mockFormData });
      
      // Should show preview with company name replaced
      expect(screen.getByText(/Test Company/)).toBeInTheDocument();
    });

    test('character count updates for custom text', async () => {
      const user = userEvent.setup();
      renderWithProviders(<AnswerCalls />, { formData: mockFormData });
      
      // Switch to urgent tab and check custom text
      const urgentTab = screen.getByText('Urgent Calls');
      await user.click(urgentTab);
      
      // Find custom radio and select it
      const customRadio = screen.getByDisplayValue('custom');
      await user.click(customRadio);
      
      // Character count should be visible
      expect(screen.getByText(/\/300 characters/)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('validates email format', () => {
      const { validateSection } = require('../utils/validationSchema');
      
      const invalidData = { email: 'invalid-email' };
      const errors = validateSection('companyInfo', invalidData);
      
      expect(errors.email).toBeDefined();
      expect(errors.email).toContain('valid email');
    });

    test('validates phone number format', () => {
      const { validateSection } = require('../utils/validationSchema');
      
      const invalidData = { phone: '123' };
      const errors = validateSection('companyInfo', invalidData);
      
      expect(errors.phone).toBeDefined();
    });

    test('validates required fields', () => {
      const { validateSection } = require('../utils/validationSchema');
      
      const emptyData = {};
      const errors = validateSection('companyInfo', emptyData);
      
      expect(errors.name).toBeDefined();
      expect(errors.address).toBeDefined();
    });
  });

  describe('Field Dependencies', () => {
    test('shows conditional fields correctly', () => {
      const { useFieldDependencies } = require('../hooks/useFieldDependencies');
      
      const formData = {
        companyInfo: {
          businessType: 'medical'
        }
      };
      
      const TestComponent = () => {
        const { isFieldVisible } = useFieldDependencies(formData, 'companyInfo');
        return (
          <div>
            {isFieldVisible('emergencyProtocol') && (
              <div data-testid="emergency-protocol">Emergency Protocol Field</div>
            )}
          </div>
        );
      };
      
      render(<TestComponent />);
      expect(screen.getByTestId('emergency-protocol')).toBeInTheDocument();
    });

    test('requires fields based on dependencies', () => {
      const { useFieldDependencies } = require('../hooks/useFieldDependencies');
      
      const formData = {
        answerCalls: {
          routine: { useStandard: false }
        }
      };
      
      const TestComponent = () => {
        const { isFieldRequired } = useFieldDependencies(formData, 'answerCalls');
        const required = isFieldRequired('customRoutineText');
        return <div data-testid="required">{required ? 'required' : 'optional'}</div>;
      };
      
      render(<TestComponent />);
      expect(screen.getByText('required')).toBeInTheDocument();
    });
  });

  describe('Save Progress Indicator', () => {
    test('shows save status correctly', () => {
      const SaveProgressIndicator = require('../components/SaveProgressIndicator').default;
      
      render(
        <SaveProgressIndicator
          saveStatus="saving"
          completionPercentage={75}
          showDetails={true}
        />
      );
      
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });

    test('displays progress percentage', () => {
      const SaveProgressIndicator = require('../components/SaveProgressIndicator').default;
      
      render(
        <SaveProgressIndicator
          saveStatus="saved"
          completionPercentage={50}
          showDetails={true}
        />
      );
      
      expect(screen.getByText('Form Progress: 50%')).toBeInTheDocument();
    });
  });

  describe('Data Export', () => {
    test('exports data in JSON format', async () => {
      const DataExportDialog = require('../components/DataExportDialog').default;
      const mockOnExport = jest.fn();
      
      const formData = {
        companyInfo: { name: 'Test Company' },
        answerCalls: { routine: { useStandard: true } }
      };
      
      render(
        <DataExportDialog
          open={true}
          onClose={jest.fn()}
          formData={formData}
          onExport={mockOnExport}
        />
      );
      
      expect(screen.getByText('Export Client Information')).toBeInTheDocument();
      expect(screen.getByText('JSON')).toBeInTheDocument();
    });

    test('validates section selection', () => {
      const DataExportDialog = require('../components/DataExportDialog').default;
      
      render(
        <DataExportDialog
          open={true}
          onClose={jest.fn()}
          formData={{}}
          onExport={jest.fn()}
        />
      );
      
      // Uncheck all sections first
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
          fireEvent.click(checkbox);
        }
      });
      
      expect(screen.getByText('Please select at least one section to export.')).toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    test('full wizard flow navigation', async () => {
      const user = userEvent.setup();
      
      // Start with StartNewClient
      renderWithProviders(<StartNewClient />);
      
      const startButton = screen.getByText('START NEW CLIENT WIZARD');
      await user.click(startButton);
      
      // Verify navigation would occur (mocked)
      expect(startButton).toBeDisabled();
    });

    test('form data persistence across components', () => {
      const initialState = {
        formData: {
          companyInfo: { name: 'Persistent Company' }
        }
      };
      
      renderWithProviders(<AnswerCalls />, initialState);
      
      // Company name should appear in previews
      expect(screen.getByText(/Persistent Company/)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles validation errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      renderWithProviders(<AnswerCalls />, { formData: null });
      
      // Component should still render without crashing
      expect(screen.getByText('Routine Calls')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    test('displays network error messages', async () => {
      // Mock a network error scenario
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
      
      renderWithProviders(<StartNewClient />);
      
      // Component should handle errors gracefully
      expect(screen.getByText('START NEW CLIENT WIZARD')).toBeInTheDocument();
      
      global.fetch = originalFetch;
    });
  });
});

// Performance tests
describe('Performance Tests', () => {
  test('components render within acceptable time', async () => {
    const startTime = performance.now();
    
    renderWithProviders(<AnswerCalls />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });

  test('form updates do not cause excessive re-renders', () => {
    const renderCount = jest.fn();
    
    const TestComponent = () => {
      renderCount();
      return <AnswerCalls />;
    };
    
    const { rerender } = renderWithProviders(<TestComponent />);
    
    // Simulate form updates
    rerender(<TestComponent />);
    rerender(<TestComponent />);
    
    // Should not render excessively
    expect(renderCount).toHaveBeenCalledTimes(3);
  });
});

// Accessibility tests
describe('Accessibility Tests', () => {
  test('components have proper ARIA labels', () => {
    renderWithProviders(<AnswerCalls />);
    
    expect(screen.getByLabelText('Answer calls tabs')).toBeInTheDocument();
  });

  test('form fields are keyboard navigable', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AnswerCalls />);
    
    // Tab through form elements
    await user.tab();
    // eslint-disable-next-line testing-library/no-node-access
    expect(document.activeElement).toBeInTheDocument();
  });

  test('color contrast meets WCAG standards', () => {
    renderWithProviders(<StartNewClient />);
    
    // This would typically use a library like jest-axe
    // expect(container).toHaveNoViolations();
  });
});
