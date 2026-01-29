import React from 'react';
import { screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnhancedOnCallTeamSection from '../sections/EnhancedOnCallTeamSection';
import { renderWithProviders } from './testUtils';

describe('EnhancedOnCallTeamSection', () => {
  it('lists Text Cell immediately after each Cell Phone in escalation contact method dropdown', () => {
    const onCall = {
      team: [
        {
          id: 'member-1',
          name: 'Jamie Lee',
          cellPhone: ['555-111-2222', '555-333-4444'],
          escalationSteps: [
            {
              id: 'step-1',
              contactMethod: '',
              attempts: '',
              interval: '',
            },
          ],
        },
      ],
    };

    renderWithProviders(
      <EnhancedOnCallTeamSection onCall={onCall} setOnCall={jest.fn()} />
    );

    const contactSelect = screen.getByLabelText('Contact Method');
    fireEvent.mouseDown(contactSelect);

    const listbox = screen.getByRole('listbox');
    const options = within(listbox).getAllByRole('option');
    const labels = options.map((option) => option.textContent);

    const cellOneIndex = labels.indexOf('Cell Phone 1');
    const cellTwoIndex = labels.indexOf('Cell Phone 2');

    expect(cellOneIndex).toBeGreaterThan(-1);
    expect(labels[cellOneIndex + 1]).toBe('Text Cell 1');
    expect(cellTwoIndex).toBeGreaterThan(-1);
    expect(labels[cellTwoIndex + 1]).toBe('Text Cell 2');
  });
});
