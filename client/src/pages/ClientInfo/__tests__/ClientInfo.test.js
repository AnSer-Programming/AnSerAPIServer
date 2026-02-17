import { WIZARD_ROUTES, WIZARD_STEPS, STEP_LABELS } from '../constants/routes';
import { consultationMeetingSchema, onCallTeamSchema } from '../utils/validationSchema';
import { validateAll, validateSection } from '../utils/validators';
import { syncCategoryAssignments } from '../utils/callRoutingAssignments';
import { deriveObservedHolidayDates } from '../utils/holidayDates';
import { __TESTING__ } from '../context_API/WizardContext';

describe('ClientInfo route configuration', () => {
  test('wizard steps include Other Info before Final Details', () => {
    const officeReachIndex = WIZARD_STEPS.indexOf('office-reach');
    const finalDetailsIndex = WIZARD_STEPS.indexOf('final-details');

    expect(officeReachIndex).toBeGreaterThan(-1);
    expect(finalDetailsIndex).toBeGreaterThan(-1);
    expect(officeReachIndex).toBeLessThan(finalDetailsIndex);
    expect(WIZARD_ROUTES.OFFICE_REACH).toContain('/office-reach');
    expect(STEP_LABELS['office-reach']).toBe('Other Info');
  });
});

describe('ClientInfo validation wiring', () => {
  test('consultation meeting requires at least 3 availability slots', () => {
    const data = {
      selectedDateTimes: [
        { date: '2026-02-10', time: '9:00 AM' },
        { date: '2026-02-11', time: '10:00 AM' },
      ],
      meetingType: 'video',
    };

    const errors = consultationMeetingSchema(data);
    expect(errors).toBeTruthy();
    expect(errors.selectedDateTimes).toContain('at least three');
  });

  test('consultation meeting passes when minimum slot count is met', () => {
    const data = {
      selectedDateTimes: [
        { date: '2026-02-10', time: '9:00 AM' },
        { date: '2026-02-11', time: '10:00 AM' },
        { date: '2026-02-12', time: '11:00 AM' },
      ],
      meetingType: 'video',
      contactEmail: 'valid@example.com',
    };

    expect(validateSection('companyInfo.consultationMeeting', data)).toBeNull();
  });

  test('on-call team entry requires at least one contact method', () => {
    const errors = onCallTeamSchema([{ name: 'Dr. Lane', email: '', cellPhone: '', homePhone: '' }]);
    expect(errors).toBeTruthy();
    expect(errors[0].contactRequired).toContain('at least one contact method');
  });

  test('answer-calls categories require name and instructions', () => {
    const errors = validateSection('answerCalls', {
      businessType: 'Medical',
      categories: [{ customName: '', selectedCommon: '', details: '' }],
    });
    expect(errors).toBeTruthy();
    expect(errors?.categories?.[0]?.customName).toBeTruthy();
    expect(errors?.categories?.[0]?.details).toBeTruthy();
  });

  test('on-call departments require at least one team', () => {
    const errors = validateSection('onCall.departments', []);
    expect(errors).toBeTruthy();
    expect(errors?.base).toContain('at least one on-call team');
  });

  test('call-routing requires first contact when not delivered', () => {
    const errors = validateSection('callRouting', {
      categoryAssignments: [
        {
          categoryId: 'cat-1',
          categoryName: 'Urgent',
          whenToContact: 'all-hours',
          escalationSteps: [{ id: 's1', contactPerson: '', contactMethod: 'call', notes: '' }],
          finalAction: 'repeat-until-delivered',
        },
      ],
    });
    expect(errors).toBeTruthy();
    expect(errors?.categoryAssignments?.[0]?.escalationSteps?.[0]?.contactPerson).toBeTruthy();
  });

  test('office-reach validates from companyInfo data in validateAll', () => {
    const formData = {
      companyInfo: {
        timeZone: 'EST',
        callFiltering: {
          roboCallBlocking: true,
          checkInRecording: false,
        },
        websiteAccess: { hasWebsite: true },
        summaryPreferences: { dailyRecapEnabled: false },
      },
      answerCalls: { businessType: 'Medical', categories: [{ customName: 'Urgent', details: 'Ask callback number first.' }] },
      onCall: {
        team: [{ name: 'Dr. Lane', email: ['lane@example.com'] }],
        departments: [{ id: 'dept-1', department: 'ER', members: ['m-1'] }],
      },
      callRouting: {
        categoryAssignments: [{
          categoryId: 'cat-1',
          categoryName: 'Urgent',
          whenToContact: 'all-hours',
          escalationSteps: [{ id: 's1', contactPerson: 'm-1', contactMethod: 'call', notes: '' }],
          finalAction: 'repeat-until-delivered',
        }],
      },
      attachments: [],
      metrics: {},
    };

    const errors = validateAll(formData);
    expect(errors?.officeReach).toBeUndefined();
  });
});

describe('ClientInfo helper behavior', () => {
  test('category assignment sync removes stale entries and keeps category order', () => {
    const categories = [
      { id: 'c2', selectedCommon: 'Second' },
      { id: 'c1', selectedCommon: 'First' },
    ];
    const assignments = [
      { categoryId: 'c1', categoryName: 'First', escalationSteps: [{ id: 'a' }] },
      { categoryId: 'c2', categoryName: 'Second', escalationSteps: [{ id: 'b' }] },
      { categoryId: 'stale', categoryName: 'Old', escalationSteps: [{ id: 'c' }] },
    ];

    const { changed, nextAssignments } = syncCategoryAssignments(categories, assignments, () => 'fixed-step');
    expect(changed).toBe(true);
    expect(nextAssignments).toHaveLength(2);
    expect(nextAssignments[0].categoryId).toBe('c2');
    expect(nextAssignments[1].categoryId).toBe('c1');
  });

  test('holiday derivation merges selected standard and custom dates', () => {
    const holidays = {
      christmas: true,
      otherHolidays: true,
      customDates: ['2026-12-31'],
    };
    const dates = deriveObservedHolidayDates(holidays, new Date('2026-01-01T00:00:00Z'));

    expect(dates).toContain('2026-12-25');
    expect(dates).toContain('2026-12-31');
  });

  test('final-details helper ignores default-only values', () => {
    const defaultsOnly = {
      companyInfo: {
        consultationMeeting: {
          selectedDateTimes: [],
          meetingType: 'video',
          contactPerson: '',
          contactEmail: '',
          contactPhone: '',
          notes: '',
        },
      },
      attachments: [],
    };

    expect(__TESTING__.hasFinalDetailsData(defaultsOnly)).toBe(false);
    expect(__TESTING__.normalizeStepSlug('companyInfo.consultationMeeting')).toBe('final-details');
  });
});
