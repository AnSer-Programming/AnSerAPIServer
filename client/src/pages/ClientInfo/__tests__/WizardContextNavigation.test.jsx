import { __TESTING__ } from '../context_API/WizardContext';

describe('WizardContext navigation helpers', () => {
  test('maps new wizard routes to the correct data keys', () => {
    expect(__TESTING__.STEP_DATA_KEYS['call-routing']).toBe('callRouting');
    expect(__TESTING__.STEP_DATA_KEYS['office-reach']).toBe('companyInfo');
    expect(__TESTING__.STEP_DATA_KEYS['final-details']).toBe('companyInfo.consultationMeeting');
  });

  test('final details requires non-default user data', () => {
    const onlyDefaults = {
      companyInfo: {
        consultationMeeting: {
          selectedDateTimes: [],
          meetingType: 'video',
          notes: '',
          contactPerson: '',
          contactEmail: '',
          contactPhone: '',
        },
      },
      attachments: [],
    };
    expect(__TESTING__.hasFinalDetailsData(onlyDefaults)).toBe(false);

    const withSlot = {
      companyInfo: {
        consultationMeeting: {
          selectedDateTimes: [{ id: 's1', date: '2026-02-10', time: '9:00 AM' }],
          meetingType: 'video',
        },
      },
      attachments: [],
    };
    expect(__TESTING__.hasFinalDetailsData(withSlot)).toBe(true);

    const withAttachment = {
      companyInfo: { consultationMeeting: { selectedDateTimes: [], meetingType: 'video' } },
      attachments: [{ name: 'notes.pdf', size: 1000 }],
    };
    expect(__TESTING__.hasFinalDetailsData(withAttachment)).toBe(true);
  });
});
