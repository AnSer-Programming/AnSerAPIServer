// src/pages/ClientInfo/sections/PlannedServiceTimesSection.jsx
import React from 'react';
import {
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useWizard } from '../context_API/WizardContext';
import HolidayMultiDatePicker from '../components/HolidayMultiDatePicker';

const plannedTimesList = [
  { key: 'allDay', label: '24/7/365' },
  { key: 'outsideBusiness', label: 'Outside business hours' },
  { key: 'overflow', label: 'Business hours overflow' },
  { key: 'lunch', label: 'Lunch' },
  // Emergency handled separately so its drawer can span full width
  { key: 'other', label: <>Other <span style={{ fontStyle: 'italic' }}>- please explain:</span></> }
];

const bgInput = (t) => (t.palette.mode === 'dark' ? alpha('#fff', 0.06) : t.palette.common.white);
const softPaper = (t) => (t.palette.mode === 'dark' ? alpha('#fff', 0.03) : '#f8fafd');

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
  const bf = new Date(date);
  bf.setDate(date.getDate() + 1);
  return bf;
}

const HOLIDAYS = [
  { key: 'newYears', name: "New Year's Day", getDate: (year) => new Date(year, 0, 1) },
  { key: 'mlkDay', name: 'Martin Luther King Jr. Day', getDate: (year) => { let d = new Date(year, 0, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 14); return d; } },
  { key: 'presidentsDay', name: "Presidents' Day", getDate: (year) => { let d = new Date(year, 1, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 14); return d; } },
  { key: 'easter', name: 'Easter', getDate: (year) => easterDate(year) },
  { key: 'memorialDay', name: 'Memorial Day', getDate: (year) => { let d = new Date(year, 4, 31); while (d.getDay() !== 1) d.setDate(d.getDate() - 1); return d; } },
  { key: 'juneteenth', name: 'Juneteenth', getDate: (year) => new Date(year, 5, 19) },
  { key: 'independenceDay', name: 'Independence Day', getDate: (year) => new Date(year, 6, 4) },
  { key: 'laborDay', name: 'Labor Day', getDate: (year) => { let d = new Date(year, 8, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); return d; } },
  { key: 'columbusDay', name: 'Columbus Day', getDate: (year) => { let d = new Date(year, 9, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 7); return d; } },
  { key: 'veteransDay', name: 'Veterans Day', getDate: (year) => new Date(year, 10, 11) },
  { key: 'thanksgiving', name: 'Thanksgiving Day', getDate: (year) => { let d = new Date(year, 10, 1); while (d.getDay() !== 4) d.setDate(d.getDate() + 1); d.setDate(d.getDate() + 21); return d; } },
  { key: 'blackFriday', name: 'Black Friday', getDate: (year) => blackFridayDate(year) },
  { key: 'christmas', name: 'Christmas Day', getDate: (year) => new Date(year, 11, 25) },
];

const getNextHolidayDate = (getDateFn) => {
  const today = new Date();
  let year = today.getFullYear();
  let date = getDateFn(year);
  if (date < today) date = getDateFn(year + 1);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${String(date.getFullYear()).slice(-2)}`;
};

const PlannedServiceTimesSection = () => {
  const { formData, updateSection } = useWizard();
  const companyInfo = formData.companyInfo || {};
  const plannedTimes = companyInfo.plannedTimes || {};
  const holidays = (typeof plannedTimes.holidays === 'object' && plannedTimes.holidays) || {
    otherHolidays: false,
    customDates: [],
  };
  const emergencies = companyInfo.emergencyProtocols || {
    weather: { enabled: false },
    power: { enabled: false },
    phone: { enabled: false },
    internet: { enabled: false },
  };

  const togglePlanned = (key) => {
    updateSection('companyInfo', {
      plannedTimes: { ...plannedTimes, [key]: !plannedTimes[key] },
    });
  };

  const handlePlannedText = (key, value) => {
    updateSection('companyInfo', {
      plannedTimes: { ...plannedTimes, [key]: value },
    });
  };

  const setHolidays = (patch) => {
    updateSection('companyInfo', {
      plannedTimes: {
        ...plannedTimes,
        holidays: { ...holidays, ...patch },
      },
    });
  };

  const toggleHoliday = (key) => {
    setHolidays({ [key]: !holidays[key] });
  };

  const handleOtherHolidays = (checked) => {
    setHolidays({
      otherHolidays: checked,
      customDates: checked ? (Array.isArray(holidays.customDates) ? holidays.customDates : []) : [],
    });
  };

  const setCustomHolidayDates = (dates) => {
    setHolidays({ customDates: dates });
  };

  const setEmergencies = (patch) => {
    updateSection('companyInfo', {
      emergencyProtocols: { ...emergencies, ...patch },
    });
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1 }} color="text.secondary">
        (Please check all that apply)
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, bgcolor: (t) => softPaper(t) }}>
        <Grid container spacing={1} alignItems="center">
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
                    '.MuiFormControlLabel-label': { fontSize: 15 },
                  }}
                />
              </Box>
              {(item.key === 'other') && plannedTimes[item.key] && (
                <TextField
                  size="small"
                  fullWidth
                  label="Please explain"
                  value={plannedTimes[item.key + 'Text'] || ''}
                  onChange={(e) => handlePlannedText(item.key + 'Text', e.target.value)}
                  sx={{ mt: 1, bgcolor: (t) => bgInput(t), fontStyle: 'italic' }}
                  inputProps={{ style: { fontStyle: 'italic' } }}
                />
              )}
            </Grid>
          ))}

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

          <Grid item xs={12}>
            <Collapse in={!!plannedTimes.emergency} unmountOnExit>
              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  borderLeft: '4px solid',
                  borderColor: 'warning.light',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>
                  Emergency Scenarios
                </Typography>

                <Grid container spacing={1.5}>
                  {[
                    { key: 'weather', label: 'Weather / natural disaster' },
                    { key: 'power', label: 'Power outage' },
                    { key: 'phone', label: 'Phone outage' },
                    { key: 'internet', label: 'Internet outage' },
                  ].map((item) => (
                    <Grid item xs={12} md={6} key={item.key}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!emergencies[item.key]?.enabled}
                            onChange={(event) =>
                              setEmergencies({
                                [item.key]: { enabled: event.target.checked },
                              })
                            }
                            size="small"
                          />
                        }
                        label={item.label}
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

          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                Observed Holidays
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select the holidays your office observes.
              </Typography>

              <Grid container spacing={1.5}>
                {HOLIDAYS.map((holiday) => (
                  <Grid item xs={12} sm={6} md={4} key={holiday.key}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={!!holidays[holiday.key]}
                          onChange={() => toggleHoliday(holiday.key)}
                          size="small"
                        />
                      }
                      label={`${holiday.name} - ${getNextHolidayDate(holiday.getDate)}`}
                    />
                  </Grid>
                ))}
              </Grid>

              {holidays.easter && (
                <TextField
                  size="small"
                  fullWidth
                  label="Easter surrounding dates (Good Friday, Easter Monday, etc.)"
                  value={holidays.easterNotes || ''}
                  onChange={(e) => setHolidays({ easterNotes: e.target.value })}
                  helperText="Example: Closed Good Friday and Easter Monday; urgent calls go to on-call doctor."
                  sx={{ mt: 2, bgcolor: (t) => bgInput(t) }}
                />
              )}

              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!holidays.otherHolidays}
                      onChange={(event) => handleOtherHolidays(event.target.checked)}
                      size="small"
                    />
                  }
                  label="Other Holiday(s)"
                />
                <Collapse in={!!holidays.otherHolidays} unmountOnExit>
                  <HolidayMultiDatePicker
                    value={Array.isArray(holidays.customDates) ? holidays.customDates : []}
                    onChange={setCustomHolidayDates}
                    helperText="Use the calendar to add each observed date. You can remove any date using the chips below."
                  />
                </Collapse>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PlannedServiceTimesSection;
