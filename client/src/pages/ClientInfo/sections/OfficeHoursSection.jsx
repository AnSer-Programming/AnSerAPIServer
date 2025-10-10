// src/pages/ClientInfo/sections/OfficeHoursSection.jsx
import React, { useEffect } from 'react';
import {
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  Grid,
  Collapse,
  Alert,
  Stack
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useWizard } from '../context_API/WizardContext';
import HolidayMultiDatePicker from '../components/HolidayMultiDatePicker';

// Default imports (both of these files export default)
import SpecialEventsSection from './SpecialEventsSection';
import SummaryPreferencesSection from './SummaryPreferencesSection';

// --------- Holiday Calculation Helpers ---------
function easterDate(y) {
  const a = y % 19;
  const b = Math.floor(y / 100);
  const c = y % 100;
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
  return new Date(y, month - 1, day);
}
function blackFridayDate(y) {
  const d = new Date(y, 10, 1);
  while (d.getDay() !== 4) d.setDate(d.getDate() + 1);
  d.setDate(d.getDate() + 21);
  const bf = new Date(d);
  bf.setDate(d.getDate() + 1);
  return bf;
}
const HOLIDAYS = [
  { key: 'newYears', name: "New Year's Day", getDate: (y) => new Date(y, 0, 1) },
  { key: 'mlkDay', name: "Martin Luther King Jr. Day", getDate: (y) => { let d = new Date(y, 0, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 14); return d; } },
  { key: 'presidentsDay', name: "Presidents' Day", getDate: (y) => { let d = new Date(y, 1, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 14); return d; } },
  { key: 'easter', name: 'Easter', getDate: (y) => easterDate(y) },
  { key: 'memorialDay', name: "Memorial Day", getDate: (y) => { let d = new Date(y, 4, 31); while (d.getDay() !== 1) d.setDate(d.getDate() - 1); return d; } },
  { key: 'juneteenth', name: "Juneteenth National Independence Day", getDate: (y) => new Date(y, 5, 19) },
  { key: 'independenceDay', name: "Independence Day", getDate: (y) => new Date(y, 6, 4) },
  { key: 'laborDay', name: "Labor Day", getDate: (y) => { let d = new Date(y, 8, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); return d; } },
  { key: 'columbusDay', name: "Columbus Day", getDate: (y) => { let d = new Date(y, 9, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 7); return d; } },
  { key: 'veteransDay', name: "Veterans Day", getDate: (y) => new Date(y, 10, 11) },
  { key: 'thanksgiving', name: "Thanksgiving Day", getDate: (y) => { let d = new Date(y, 10, 1); while (d.getDay() !== 4) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 21); return d; } },
  { key: 'blackFriday', name: "Black Friday", getDate: (y) => blackFridayDate(y) },
  { key: 'christmas', name: "Christmas Day", getDate: (y) => new Date(y, 11, 25) },
];

function getNextHolidayDate(getDateFn) {
  const today = new Date();
  let year = today.getFullYear();
  let date = getDateFn(year);
  if (date < today) date = getDateFn(year + 1);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
}

const DAYS = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' }
];

const TIME_ZONES = [
  { value: '', label: 'Select Time Zone' },
  { value: 'EST', label: 'Eastern' },
  { value: 'CST', label: 'Central' },
  { value: 'MST', label: 'Mountain' },
  { value: 'PST', label: 'Pacific' }
];

const plannedTimesList = [
  { key: 'allDay', label: '24/7/365' },
  { key: 'outsideBusiness', label: 'Outside business hours' },
  { key: 'overflow', label: 'Business hours overflow' },
  { key: 'lunch', label: 'Lunch' },
  // Emergency handled separately so its drawer can span full width
  { key: 'other', label: <>Other <span style={{ fontStyle: 'italic' }}>– please explain:</span></> }
];

const fromShortToLong = (obj = {}) => ({
  monday: obj.mon || obj.monday,
  tuesday: obj.tue || obj.tuesday,
  wednesday: obj.wed || obj.wednesday,
  thursday: obj.thu || obj.thursday,
  friday: obj.fri || obj.friday,
  saturday: obj.sat || obj.saturday,
  sunday: obj.sun || obj.sunday,
});

// Defaults
const DEFAULT_OPEN  = '07:00';
const DEFAULT_CLOSE = '17:00';

// theme-aware helpers
const bgHead = (t) => (t.palette.mode === 'dark' ? alpha('#fff', 0.06) : t.palette.grey[50]);
const bgInput = (t) => (t.palette.mode === 'dark' ? alpha('#fff', 0.06) : t.palette.common.white);
const bgDisabled = (t) => (t.palette.mode === 'dark' ? alpha('#fff', 0.03) : t.palette.grey[200]);
const softPaper = (t) => (t.palette.mode === 'dark' ? alpha('#fff', 0.03) : '#f8fafd');

const OfficeHoursSection = ({
  data = {},
  errors = {},
  lunchErrors = {}
}) => {
  const { formData, updateSection } = useWizard();
  const companyInfo = formData.companyInfo || {};
  const officeHours = companyInfo.officeHours || {};
  const lunch = companyInfo.lunchHours || { enabled: false, open: '12:00', close: '13:00' };
  const timeZone = companyInfo.timeZone || '';
  const plannedTimes = companyInfo.plannedTimes || {};
  const holidays = (typeof plannedTimes.holidays === 'object' && plannedTimes.holidays) || {};
  const customHolidayDates = Array.isArray(holidays.customDates) ? holidays.customDates : [];
  const observedHolidays = Array.isArray(companyInfo.holidays) ? companyInfo.holidays : [];

  // emergency + volume
  const emergencies = companyInfo.emergencyProtocols || {
    weather: { enabled: false },
    power: { enabled: false },
    phone: { enabled: false },
    internet: { enabled: false },
  };
  const observedHolidayErrors = errors?.holidays;
  const observedHolidayMessages = Array.isArray(observedHolidayErrors)
    ? observedHolidayErrors
        .filter(Boolean)
        .map((entry) => (typeof entry === 'string' ? entry : Object.values(entry || {}).join(' • ')))
        .filter(Boolean)
    : observedHolidayErrors && typeof observedHolidayErrors === 'object'
      ? Object.values(observedHolidayErrors).join(' • ')
      : observedHolidayErrors || '';

  useEffect(() => {
    const hasShortKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].some(k => officeHours?.[k]);
    if (hasShortKeys) {
      const next = fromShortToLong(officeHours);
      updateSection('companyInfo', { officeHours: next });
    }
    // eslint-disable-next-line
  }, []);

  const setDay = (day, field, value) => {
    updateSection('companyInfo', {
      officeHours: {
        ...officeHours,
        [day]: {
          ...(officeHours[day] || { open: DEFAULT_OPEN, close: DEFAULT_CLOSE, closed: false }),
          [field]: value,
        },
      },
    });
  };

  const copyMonday = () => {
    const mon = officeHours.monday || { open: DEFAULT_OPEN, close: DEFAULT_CLOSE, closed: false };
    const next = { ...officeHours };
    ['tuesday', 'wednesday', 'thursday', 'friday'].forEach((d) => {
      next[d] = { ...mon };
    });
    updateSection('companyInfo', { officeHours: next });
  };

  const setLunch = (patch) => {
    updateSection('companyInfo', {
      lunchHours: { ...lunch, ...patch },
    });
  };

  const setTimeZone = (val) => {
    updateSection('companyInfo', { timeZone: val });
  };

  const setObservedHolidays = (list) => {
    const sanitized = Array.isArray(list)
      ? list.map((item) => (typeof item === 'string' ? item.trim() : String(item || '').trim())).filter(Boolean)
      : [];
    const unique = Array.from(new Set(sanitized)).sort((a, b) => a.localeCompare(b));
    updateSection('companyInfo', { holidays: unique });
  };

  // Planned Times handlers
  const togglePlanned = (key) => {
    if (key === 'holidays') {
      const currentlyObject = typeof plannedTimes.holidays === 'object' && plannedTimes.holidays;
      const nextHolidays = currentlyObject
        ? false
        : { otherHolidays: false, customDates: [] };
      updateSection('companyInfo', {
        plannedTimes: { ...plannedTimes, holidays: nextHolidays }
      });
      return;
    }
    updateSection('companyInfo', {
      plannedTimes: { ...plannedTimes, [key]: !plannedTimes[key] }
    });
  };

  const toggleHoliday = (key) => {
    updateSection('companyInfo', {
      plannedTimes: {
        ...plannedTimes,
        holidays: { ...holidays, [key]: !holidays[key] }
      }
    });
  };

  const handleOtherHolidays = (checked) => {
    updateSection('companyInfo', {
      plannedTimes: {
        ...plannedTimes,
        holidays: {
          ...holidays,
          otherHolidays: checked,
          customDates: checked ? (Array.isArray(holidays.customDates) ? holidays.customDates : []) : [],
        }
      }
    });
  };

  const setCustomHolidayDates = (dates) => {
    updateSection('companyInfo', {
      plannedTimes: {
        ...plannedTimes,
        holidays: {
          ...holidays,
          customDates: dates,
        },
      },
    });
  };

  const handlePlannedText = (key, value) => {
    updateSection('companyInfo', {
      plannedTimes: { ...plannedTimes, [key]: value }
    });
  };

  const setEmergencies = (patch) => {
    updateSection('companyInfo', { emergencyProtocols: { ...emergencies, ...patch } });
  };
  return (
    <Box sx={{ mt: 2 }}>
      <Alert severity="info" sx={{ mb: 2 }}>
        If your hours or availability change after submission, reach out to your AnSer support team and we'll update the live instructions right away.
      </Alert>
      <Typography variant="h5" sx={{ color: (t) => t.palette.error.main, fontWeight: 700, mb: 1 }}>
        TIME / ZONE & OFFICE HOURS
      </Typography>

      {/* Time Zone */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
        <Typography sx={{ color: (t) => t.palette.error.main, fontWeight: 700, minWidth: 100 }}>
          Time Zone
        </Typography>
        <FormControl sx={{ minWidth: 160 }} size="small">
          <Select
            value={timeZone}
            onChange={e => setTimeZone(e.target.value)}
            displayEmpty
            sx={{ bgcolor: (t) => bgInput(t) }}
          >
            {TIME_ZONES.map(tz => (
              <MenuItem key={tz.value} value={tz.value}>{tz.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Office Hours Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: '1px solid', borderColor: 'divider', mb: 1, borderRadius: 2 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  borderBottom: (t) => `2px solid ${alpha(t.palette.divider, 0.75)}`,
                  minWidth: 65,
                  bgcolor: (t) => bgHead(t),
                }}
              />
              {DAYS.map(d => (
                <TableCell
                  key={d.key}
                  align="center"
                  sx={{
                    fontWeight: 700,
                    borderBottom: (t) => `2px solid ${alpha(t.palette.divider, 0.75)}`,
                    bgcolor: (t) => bgHead(t),
                    fontStyle: 'italic',
                    fontSize: 18,
                    color: (t) => t.palette.text.secondary,
                  }}>
                  {d.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Open */}
            <TableRow>
              <TableCell sx={{ fontWeight: 500, color: (t) => t.palette.primary.dark, pl: 2, bgcolor: (t) => bgHead(t) }}>
                Open
              </TableCell>
              {DAYS.map(d => {
                const dayObj = officeHours[d.key];
                const value = (dayObj?.open ?? DEFAULT_OPEN);
                return (
                  <TableCell key={d.key + 'open'}>
                    <TextField
                      type="time"
                      size="small"
                      value={value}
                      disabled={!!dayObj?.closed}
                      onChange={e => setDay(d.key, 'open', e.target.value)}
                      sx={{
                        bgcolor: (t) => (!!dayObj?.closed ? bgDisabled(t) : bgInput(t)),
                        width: '120px',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                      inputProps={{ step: 300, style: { fontSize: 15, padding: '6px 8px' } }}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
            {/* Close */}
            <TableRow>
              <TableCell sx={{ fontWeight: 500, color: (t) => t.palette.primary.dark, pl: 2, bgcolor: (t) => bgHead(t) }}>
                Close
              </TableCell>
              {DAYS.map(d => {
                const dayObj = officeHours[d.key];
                const value = (dayObj?.close ?? DEFAULT_CLOSE);
                return (
                  <TableCell key={d.key + 'close'}>
                    <TextField
                      type="time"
                      size="small"
                      value={value}
                      disabled={!!dayObj?.closed}
                      onChange={e => setDay(d.key, 'close', e.target.value)}
                      sx={{
                        bgcolor: (t) => (!!dayObj?.closed ? bgDisabled(t) : bgInput(t)),
                        width: '120px',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                      inputProps={{ step: 300, style: { fontSize: 15, padding: '6px 8px' } }}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
            {/* Closed */}
            <TableRow>
              <TableCell sx={{ fontWeight: 500, color: 'text.secondary', pl: 2, bgcolor: (t) => bgHead(t) }}>
                Closed
              </TableCell>
              {DAYS.map(d => (
                <TableCell key={d.key + 'closed'} align="center">
                  <Checkbox
                    checked={!!officeHours[d.key]?.closed}
                    onChange={e => setDay(d.key, 'closed', e.target.checked)}
                    size="small"
                  />
                </TableCell>
              ))}
            </TableRow>
            {/* Lunch Break */}
            <TableRow>
              <TableCell sx={{ fontWeight: 'italic', color: 'text.secondary', pl: 2, bgcolor: (t) => bgHead(t) }}>
                Lunch Break
              </TableCell>
              <TableCell colSpan={7}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pl: 1 }}>
                  <Checkbox
                    checked={!!lunch.enabled}
                    onChange={e => setLunch({ enabled: e.target.checked })}
                  />
                  <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary', minWidth: 60 }}>
                    Enable
                  </Typography>
                  {lunch.enabled && (
                    <Box sx={{ display: 'flex', gap: 4 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.3 }}>
                          Start
                        </Typography>
                        <TextField
                          type="time"
                          size="small"
                          value={lunch.open || '12:00'}
                          onChange={e => setLunch({ open: e.target.value })}
                          sx={{
                            width: 120,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: (t) => bgInput(t)
                          }}
                          inputProps={{ step: 300, style: { fontSize: 15, padding: '6px 8px' } }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.3 }}>
                          End
                        </Typography>
                        <TextField
                          type="time"
                          size="small"
                          value={lunch.close || '13:00'}
                          onChange={e => setLunch({ close: e.target.value })}
                          sx={{
                            width: 120,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                            bgcolor: (t) => bgInput(t)
                          }}
                          inputProps={{ step: 300, style: { fontSize: 15, padding: '6px 8px' } }}
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button size="small" variant="outlined" onClick={copyMonday}>
          Copy Monday to Weekdays
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Planned Times */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: (t) => t.palette.error.main, fontWeight: 700, mb: 0.5 }}>
          PLANNED TIMES TO USE <span style={{ color: 'inherit', letterSpacing: 1 }}>ANSER’S SERVICES</span>
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }}>
          (Please check all that apply)
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, bgcolor: (t) => softPaper(t) }}>
          <Grid container spacing={1} alignItems="center">
            {/* Standard options (excluding Emergency) */}
            {plannedTimesList.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.key}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!plannedTimes[item.key]}
                        onChange={() => togglePlanned(item.key)}
                        size="small"
                      />
                    }
                    label={item.label}
                    sx={{
                      whiteSpace: 'nowrap',
                      fontSize: 16,
                      '.MuiFormControlLabel-label': { fontSize: 15 }
                    }}
                  />
                </Box>
                {(item.key === 'other') && plannedTimes[item.key] && (
                  <TextField
                    size="small"
                    fullWidth
                    label="Please explain"
                    value={plannedTimes[item.key + 'Text'] || ''}
                    onChange={e => handlePlannedText(item.key + 'Text', e.target.value)}
                    sx={{ mt: 1, bgcolor: (t) => bgInput(t), fontStyle: 'italic' }}
                    inputProps={{ style: { fontStyle: 'italic' } }}
                  />
                )}
              </Grid>
            ))}

            {/* Emergency Times – full width row */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!plannedTimes.emergency}
                    onChange={() => togglePlanned('emergency')}
                  />
                }
                label="Emergency Times"
              />
            </Grid>

            {/* Emergency Scenarios — ONLY CHECKBOXES */}
            <Grid item xs={12}>
              <Collapse in={!!plannedTimes.emergency} unmountOnExit>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    borderLeft: '4px solid',
                    borderColor: 'error.light',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'error.main', mb: 1.5 }}>
                    Emergency Scenarios
                  </Typography>

                  <Grid container spacing={1.5}>
                    {[
                      { key: 'weather',  label: 'Weather / natural disaster' },
                      { key: 'power',    label: 'Power outage' },
                      { key: 'phone',    label: 'Phone outage' },
                      { key: 'internet', label: 'Internet outage' },
                    ].map((e) => (
                      <Grid item xs={12} md={6} key={e.key}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={!!emergencies[e.key]?.enabled}
                              onChange={(ev) =>
                                setEmergencies({
                                  [e.key]: { enabled: ev.target.checked }
                                })
                              }
                              size="small"
                            />
                          }
                          label={e.label}
                        />
                      </Grid>
                    ))}
                  </Grid>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                    Tip: Check all that apply; detailed on-call workflow will be captured on the On-Call step.
                  </Typography>
                </Paper>
              </Collapse>
            </Grid>

            {/* Holidays */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!plannedTimes.holidays}
                    onChange={() => togglePlanned('holidays')}
                  />
                }
                label={<span>Holidays <span style={{ fontStyle: 'italic' }}>– please list:</span></span>}
              />
            </Grid>

            <Collapse in={!!plannedTimes.holidays}>
              <Grid container spacing={2} sx={{ pl: 2, pb: 1 }}>
                {HOLIDAYS.map((h) => (
                  <Grid item xs={12} sm={6} md={4} key={h.key}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!holidays[h.key]}
                          onChange={() => toggleHoliday(h.key)}
                          size="small"
                        />
                      }
                      label={
                        <span>
                          {h.name}{' '}
                          <span style={{ fontStyle: 'italic', fontSize: 13, color: 'inherit' }}>
                            – {getNextHolidayDate(h.getDate)}
                          </span>
                        </span>
                      }
                    />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <TextField
                    label="Easter surrounding dates (Good Friday, Easter Monday, etc.)"
                    size="small"
                    fullWidth
                    value={holidays.easterNotes || ''}
                    onChange={(e) =>
                      updateSection('companyInfo', {
                        plannedTimes: {
                          ...plannedTimes,
                          holidays: { ...holidays, easterNotes: e.target.value }
                        }
                      })
                    }
                    placeholder="List specific dates or notes here"
                    helperText="Example: Closed Good Friday and Easter Monday; urgent calls go to on-call doctor."
                    sx={{ bgcolor: (t) => bgInput(t) }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!holidays.otherHolidays}
                        onChange={(e) => handleOtherHolidays(e.target.checked)}
                        size="small"
                      />
                    }
                    label={<b>Other Holiday(s)</b>}
                  />
                  {holidays.otherHolidays && (
                    <HolidayMultiDatePicker
                      value={customHolidayDates}
                      onChange={setCustomHolidayDates}
                    />
                  )}
                </Grid>
              </Grid>
            </Collapse>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  border: (theme) => `1px dashed ${alpha(theme.palette.divider, 0.6)}`,
                  p: { xs: 2, md: 3 },
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                  Observed Holiday Calendar
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Use the calendar below to flag the exact dates your team will be unavailable. We’ll exclude
                  these from scheduling and routing.
                </Typography>
                <HolidayMultiDatePicker
                  value={observedHolidays}
                  onChange={setObservedHolidays}
                  helperText="Select each observed date, then use the chips to remove any that change."
                />
                {Array.isArray(observedHolidayMessages) && observedHolidayMessages.length > 0 && (
                  <Box sx={{ mt: 1.5 }}>
                    {observedHolidayMessages.map((message, index) => (
                      <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                        {message || 'Please review the highlighted date.'}
                      </Alert>
                    ))}
                  </Box>
                )}
                {typeof observedHolidayMessages === 'string' && observedHolidayMessages && (
                  <Alert severity="warning" sx={{ mt: 1.5 }}>
                    {observedHolidayMessages}
                  </Alert>
                )}
              </Box>
            </Grid>

            {/* Special Events (when Other Holiday(s) is checked) */}
            <Grid item xs={12}>
              <Collapse in={!!(holidays.otherHolidays)}>
                <SpecialEventsSection
                  events={companyInfo.specialEvents || []}
                  onChange={(evts) => updateSection('companyInfo', { specialEvents: evts })}
                  errors={errors.specialEvents || []}
                />
              </Collapse>
            </Grid>

          </Grid>
        </Paper>
      </Box>

      {/* Daily summary prefs */}
      <SummaryPreferencesSection errors={errors.summaryPreferences || {}} />
    </Box>
  );
};

export default OfficeHoursSection;
