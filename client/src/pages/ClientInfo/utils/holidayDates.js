const HOLIDAY_DEFINITIONS = [
  { key: 'newYears', name: "New Year's Day", getDate: (year) => new Date(year, 0, 1) },
  { key: 'mlkDay', name: 'Martin Luther King Jr. Day', getDate: (year) => { const d = new Date(year, 0, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 14); return d; } },
  { key: 'presidentsDay', name: "Presidents' Day", getDate: (year) => { const d = new Date(year, 1, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 14); return d; } },
  { key: 'easter', name: 'Easter', getDate: (year) => easterDate(year) },
  { key: 'memorialDay', name: 'Memorial Day', getDate: (year) => { const d = new Date(year, 4, 31); while (d.getDay() !== 1) d.setDate(d.getDate() - 1); return d; } },
  { key: 'juneteenth', name: 'Juneteenth', getDate: (year) => new Date(year, 5, 19) },
  { key: 'independenceDay', name: 'Independence Day', getDate: (year) => new Date(year, 6, 4) },
  { key: 'laborDay', name: 'Labor Day', getDate: (year) => { const d = new Date(year, 8, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); return d; } },
  { key: 'columbusDay', name: 'Columbus Day', getDate: (year) => { const d = new Date(year, 9, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 7); return d; } },
  { key: 'veteransDay', name: 'Veterans Day', getDate: (year) => new Date(year, 10, 11) },
  { key: 'thanksgiving', name: 'Thanksgiving Day', getDate: (year) => { const d = new Date(year, 10, 1); while (d.getDay() !== 4) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 21); return d; } },
  { key: 'blackFriday', name: 'Black Friday', getDate: (year) => blackFridayDate(year) },
  { key: 'christmas', name: 'Christmas Day', getDate: (year) => new Date(year, 11, 25) },
];

function easterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function blackFridayDate(year) {
  const date = new Date(year, 10, 1);
  while (date.getDay() !== 4) date.setDate(date.getDate() + 1);
  date.setDate(date.getDate() + 21);
  const blackFriday = new Date(date);
  blackFriday.setDate(date.getDate() + 1);
  return blackFriday;
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeDateString(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return trimmed;
  return toIsoDate(parsed);
}

function getNextObservedHolidayDate(getDateFn, fromDate = new Date()) {
  const today = new Date(fromDate);
  today.setHours(0, 0, 0, 0);

  let year = today.getFullYear();
  let candidate = getDateFn(year);
  if (candidate < today) {
    year += 1;
    candidate = getDateFn(year);
  }
  return candidate;
}

function deriveObservedHolidayDates(holidays = {}, fromDate = new Date()) {
  const holidayConfig = (holidays && typeof holidays === 'object') ? holidays : {};
  const computedDates = HOLIDAY_DEFINITIONS
    .filter((holiday) => Boolean(holidayConfig[holiday.key]))
    .map((holiday) => toIsoDate(getNextObservedHolidayDate(holiday.getDate, fromDate)));

  const customDates = Array.isArray(holidayConfig.customDates)
    ? holidayConfig.customDates.map(normalizeDateString).filter(Boolean)
    : [];

  return Array.from(new Set([...computedDates, ...customDates])).sort((a, b) => {
    const left = new Date(`${a}T00:00:00`);
    const right = new Date(`${b}T00:00:00`);
    if (Number.isNaN(left.getTime()) || Number.isNaN(right.getTime())) {
      return String(a).localeCompare(String(b));
    }
    return left.getTime() - right.getTime();
  });
}

export {
  HOLIDAY_DEFINITIONS,
  getNextObservedHolidayDate,
  deriveObservedHolidayDates,
};
