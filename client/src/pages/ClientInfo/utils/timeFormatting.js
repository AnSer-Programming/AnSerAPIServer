const TIME_24H_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const TIME_12H_REGEX = /^(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/i;

const pad2 = (value) => String(value).padStart(2, '0');

export const normalizeTime24h = (value) => {
  if (value == null) return '';
  const text = String(value).trim();
  if (!text) return '';

  const match24 = text.match(TIME_24H_REGEX);
  if (match24) {
    return `${match24[1]}:${match24[2]}`;
  }

  const match12 = text.match(TIME_12H_REGEX);
  if (!match12) return '';

  let hours = Number(match12[1]);
  const minutes = Number(match12[2]);
  const meridiem = match12[3].toUpperCase();
  if (meridiem === 'PM' && hours !== 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;
  return `${pad2(hours)}:${pad2(minutes)}`;
};

export const to12HourLabel = (value) => {
  const normalized = normalizeTime24h(value);
  if (!normalized) return String(value || '');

  const [hourText, minuteText] = normalized.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const meridiem = hour >= 12 ? 'PM' : 'AM';
  const displayHour = ((hour + 11) % 12) + 1;
  return `${displayHour}:${pad2(minute)} ${meridiem}`;
};

export const buildTimeOptions = (stepMinutes = 15) => {
  const step = Number(stepMinutes);
  const safeStep = Number.isFinite(step) && step > 0 ? step : 15;
  const options = [];

  for (let minutes = 0; minutes < 24 * 60; minutes += safeStep) {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const value = `${pad2(hour)}:${pad2(minute)}`;
    options.push({ value, label: to12HourLabel(value) });
  }

  return options;
};
