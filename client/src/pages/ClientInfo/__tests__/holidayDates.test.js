import { deriveObservedHolidayDates } from '../utils/holidayDates';

describe('holidayDates', () => {
  test('derives standard and custom holiday dates with deduplication', () => {
    const holidays = {
      christmas: true,
      otherHolidays: true,
      customDates: ['2026-12-25', '2026-12-31'],
    };

    const dates = deriveObservedHolidayDates(holidays, new Date('2026-01-01T00:00:00Z'));

    expect(dates).toContain('2026-12-25');
    expect(dates).toContain('2026-12-31');
    expect(dates.filter((date) => date === '2026-12-25')).toHaveLength(1);
  });

  test('returns empty list when no holidays are selected', () => {
    expect(deriveObservedHolidayDates({}, new Date('2026-01-01T00:00:00Z'))).toEqual([]);
  });
});
