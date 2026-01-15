/**
 * Tests for CallVolumeSection component
 */

import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CallVolumeSection from '../components/CallVolumeSection';
import { renderWithProviders, createMockOnChange } from './testUtils';

describe('CallVolumeSection', () => {
  describe('Rendering', () => {
    it('renders the section heading', () => {
      renderWithProviders(<CallVolumeSection />);
      expect(screen.getByText('Call Volume Snapshot')).toBeInTheDocument();
    });

    it('renders all input fields', () => {
      renderWithProviders(<CallVolumeSection />);
      expect(screen.getByLabelText(/average daily call volume/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/peak times/i)).toBeInTheDocument();
    });

    it('displays info alert about consulting Ryan', () => {
      renderWithProviders(<CallVolumeSection />);
      expect(screen.getByText(/consult ryan/i)).toBeInTheDocument();
    });
  });

  describe('Value Display', () => {
    it('displays provided values', () => {
      const value = {
        avgDaily: '45',
        peakWindow: 'Mondays 7-10 AM',
        overnightPct: '15',
        notes: 'Test notes',
      };
      
      renderWithProviders(<CallVolumeSection value={value} />);
      
      expect(screen.getByDisplayValue('45')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Mondays 7-10 AM')).toBeInTheDocument();
    });

    it('handles empty/undefined values gracefully', () => {
      renderWithProviders(<CallVolumeSection value={{}} />);
      // Should not throw and should render empty fields
      expect(screen.getByLabelText(/average daily call volume/i)).toHaveValue('');
    });
  });

  describe('User Interactions', () => {
    it('calls onChange when avgDaily is updated', () => {
      const onChange = createMockOnChange();
      renderWithProviders(<CallVolumeSection onChange={onChange} />);
      
      const input = screen.getByLabelText(/average daily call volume/i);
      fireEvent.change(input, { target: { value: '50' } });
      
      expect(onChange.getCalls().length).toBe(1);
      expect(onChange.getLastCall()).toMatchObject({ avgDaily: '50' });
    });

    it('filters non-numeric characters from avgDaily', () => {
      const onChange = createMockOnChange();
      renderWithProviders(<CallVolumeSection onChange={onChange} />);
      
      const input = screen.getByLabelText(/average daily call volume/i);
      fireEvent.change(input, { target: { value: '45abc' } });
      
      expect(onChange.getLastCall()).toMatchObject({ avgDaily: '45' });
    });

    it('calls onChange when peakWindow is updated', () => {
      const onChange = createMockOnChange();
      renderWithProviders(<CallVolumeSection onChange={onChange} />);
      
      const input = screen.getByLabelText(/peak times/i);
      fireEvent.change(input, { target: { value: 'Lunch rush' } });
      
      expect(onChange.getLastCall()).toMatchObject({ peakWindow: 'Lunch rush' });
    });
  });

  describe('Error Display', () => {
    it('displays error message for avgDaily', () => {
      const errors = { avgDaily: 'This field is required' };
      renderWithProviders(<CallVolumeSection errors={errors} />);
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('shows error styling on input with error', () => {
      const errors = { avgDaily: 'Invalid value' };
      renderWithProviders(<CallVolumeSection errors={errors} />);
      
      const input = screen.getByLabelText(/average daily call volume/i);
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Accessibility', () => {
    it('has accessible labels for all inputs', () => {
      renderWithProviders(<CallVolumeSection />);
      
      // All inputs should be findable by their labels
      expect(screen.getByLabelText(/average daily call volume/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/peak times/i)).toBeInTheDocument();
    });
  });
});
