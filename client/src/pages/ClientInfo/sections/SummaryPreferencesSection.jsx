// src/pages/ClientInfo/sections/SummaryPreferencesSection.jsx
import React, { useEffect, useState } from 'react';
import {
  Typography,
  Checkbox,
  TextField,
  Button,
  FormControlLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Grid,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useWizard } from '../context_API/WizardContext';
import FieldRow from '../components/FieldRow';
import { EMAIL_REGEX } from '../utils/emailValidation';

const DAYS = [
  { key: 'monday', label: 'Mon' },
  { key: 'tuesday', label: 'Tue' },
  { key: 'wednesday', label: 'Wed' },
  { key: 'thursday', label: 'Thu' },
  { key: 'friday', label: 'Fri' },
  { key: 'saturday', label: 'Sat' },
  { key: 'sunday', label: 'Sun' },
];

const DEFAULT_TIME = '17:00';

const bgHead = (t) => (t.palette.mode === 'dark' ? alpha('#fff', 0.06) : t.palette.grey[50]);
const bgInput = (t) => (t.palette.mode === 'dark' ? alpha('#fff', 0.06) : t.palette.common.white);
const softPaper = (t) => (t.palette.mode === 'dark' ? alpha('#fff', 0.03) : '#f7f9fa');

function SummaryPreferencesSection({ errors = {} }) {
  const theme = useTheme();
  const { formData, updateSection } = useWizard();

  const summary = formData.companyInfo?.summaryPreferences || {
    emailEnabled: false,
    faxEnabled: false,
    email: '',
    faxNumber: '',
    alwaysSendEvenIfNoMessages: false,
    reportSpamHangups: undefined,
    dailyRecapEnabled: null,
    realTimeChannels: [],
    recap: {
      includeNoMessages: false,
      delivery: { email: false, fax: false, other: false },
      otherNotes: '',
    },
    // schedule format: { [day]: { enabled: boolean, times: [ "HH:mm", ... ] } }
    recapSchedule: {},
    sameTimeWeekdays: false,
  };

  const recapDelivery = summary.recap?.delivery || { email: false, fax: false, other: false };
  const recapSchedule = summary.recapSchedule || {};
  const [pendingAdd, setPendingAdd] = useState({}); // per-day temp time input
  const [summaryEmailError, setSummaryEmailError] = useState('');
  const realTimeChannels = Array.isArray(summary.realTimeChannels) ? summary.realTimeChannels : [];
  const recapErrors = errors || {};
  const dailyRecapError = recapErrors.dailyRecapEnabled;
  const realTimeError = recapErrors.realTimeChannels;

  // Validate comma/semicolon separated email list
  const validateEmailList = (emailString) => {
    if (!emailString || !emailString.trim()) {
      setSummaryEmailError('');
      return;
    }
    const emails = emailString.split(/[,;]/).map(e => e.trim()).filter(e => e);
    const invalidEmails = emails.filter(e => !EMAIL_REGEX.test(e));
    if (invalidEmails.length > 0) {
      setSummaryEmailError(`Invalid email(s): ${invalidEmails.join(', ')}`);
    } else {
      setSummaryEmailError('');
    }
  };

  const setPrefs = (patch) =>
    updateSection('companyInfo', { summaryPreferences: { ...summary, ...patch } });

  const setRecap = (patch) =>
    setPrefs({ recap: { ...(summary.recap || {}), ...patch } });

  // ensure every day exists in schedule object
  useEffect(() => {
    const next = { ...recapSchedule };
    let changed = false;
    DAYS.forEach(({ key }) => {
      if (!next[key]) {
        next[key] = { enabled: false, times: [] };
        changed = true;
      } else if (!Array.isArray(next[key].times)) {
        next[key] = { ...next[key], times: next[key].time ? [next[key].time] : [] };
        delete next[key].time;
        changed = true;
      }
    });
    if (changed) setPrefs({ recapSchedule: next });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDayEnabled = (day, enabled) => {
    const cur = recapSchedule[day] || { enabled: false, times: [] };
    const next = {
      ...recapSchedule,
      [day]: { enabled, times: enabled ? cur.times : [] },
    };
    setPrefs({ recapSchedule: next });
    // propagate Monday enable state to Tue–Fri if sameTimeWeekdays
    if (summary.sameTimeWeekdays && day === 'monday') {
      const mon = next.monday;
      ['tuesday', 'wednesday', 'thursday', 'friday'].forEach((d) => {
        next[d] = { enabled: mon.enabled, times: [...mon.times] };
      });
      setPrefs({ recapSchedule: next });
    }
  };

  const addTime = (day, time) => {
    if (!time) return;
    const dayObj = recapSchedule[day] || { enabled: true, times: [] };
    if (dayObj.times.includes(time)) return;
    const next = { ...recapSchedule, [day]: { enabled: true, times: [...dayObj.times, time].sort() } };
    // mirror M–F if needed
    if (summary.sameTimeWeekdays && day === 'monday') {
      ['tuesday', 'wednesday', 'thursday', 'friday'].forEach((d) => {
        next[d] = { enabled: next.monday.enabled, times: [...next.monday.times] };
      });
    }
    setPrefs({ recapSchedule: next });
    setPendingAdd((p) => ({ ...p, [day]: '' }));
  };

  const removeTime = (day, idx) => {
    const dayObj = recapSchedule[day];
    if (!dayObj) return;
    const nextTimes = dayObj.times.filter((_, i) => i !== idx);
    const next = { ...recapSchedule, [day]: { ...dayObj, times: nextTimes } };
    // mirror M–F if needed
    if (summary.sameTimeWeekdays && day === 'monday') {
      ['tuesday', 'wednesday', 'thursday', 'friday'].forEach((d) => {
        next[d] = { enabled: next.monday.enabled, times: [...next.monday.times] };
      });
    }
    setPrefs({ recapSchedule: next });
  };

  const toggleSameTimeWeekdays = (checked) => {
    const next = { ...recapSchedule };
    if (checked) {
      const mon = next.monday || { enabled: false, times: [] };
      ['tuesday', 'wednesday', 'thursday', 'friday'].forEach((d) => {
        next[d] = { enabled: mon.enabled, times: [...mon.times] };
      });
    }
    setPrefs({ recapSchedule: next, sameTimeWeekdays: checked });
  };

  // delivery toggles
  const toggleEmail = (checked) => {
    setPrefs({ emailEnabled: checked });
    setRecap({ delivery: { ...recapDelivery, email: checked } });
  };
  const toggleFax = (checked) => {
    setPrefs({ faxEnabled: checked });
    setRecap({ delivery: { ...recapDelivery, fax: checked } });
  };
  const toggleOther = (checked) => {
    setRecap({ delivery: { ...recapDelivery, other: checked } });
  };

  const handleDailyRecapChange = (value) => {
    setPrefs({ dailyRecapEnabled: value });
    if (value === true && realTimeChannels.length === 0) {
      setPrefs({ realTimeChannels: ['email'] });
    }
  };

  const handleRealTimeToggle = (channel) => (event) => {
    const checked = event.target.checked;
    const next = new Set(realTimeChannels);
    if (checked) {
      next.add(channel);
    } else {
      next.delete(channel);
    }
    setPrefs({ realTimeChannels: Array.from(next) });
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        mt: 3,
        borderRadius: 2,
        p: 2.5,
        bgcolor: (t) => softPaper(t),
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: (t) => t.palette.error.main,
          fontWeight: 700,
          textDecoration: 'underline',
          letterSpacing: 0.25,
          mb: 1.5,
        }}
      >
        Daily Summary & Recap Preferences
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
            Do you want a daily recap of all messages?
          </Typography>
          <Stack direction="row" spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={summary.dailyRecapEnabled === true}
                  onChange={() => handleDailyRecapChange(true)}
                  color="primary"
                />
              }
              label="Yes"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={summary.dailyRecapEnabled === false}
                  onChange={() => handleDailyRecapChange(false)}
                  color="primary"
                />
              }
              label="No"
            />
          </Stack>
          {dailyRecapError && (
            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
              {dailyRecapError}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
            How would you like your real-time messages?
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="flex-start">
            <FormControlLabel
              control={
                <Checkbox
                  checked={realTimeChannels.includes('email')}
                  onChange={handleRealTimeToggle('email')}
                />
              }
              label="Email"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={realTimeChannels.includes('text')}
                  onChange={handleRealTimeToggle('text')}
                />
              }
              label="Text"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={realTimeChannels.includes('fax')}
                  onChange={handleRealTimeToggle('fax')}
                />
              }
              label="Fax"
            />
          </Stack>
          {realTimeError && (
            <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
              {realTimeError}
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Delivery method */}
      <Typography sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
        How would you like your daily summary delivered?
      </Typography>

      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        <Grid item xs={12} md="auto">
          <FormControlLabel
            control={
              <Checkbox
                checked={!!summary.emailEnabled || recapDelivery.email}
                onChange={(e) => toggleEmail(e.target.checked)}
              />
            }
            label="Email"
          />
        </Grid>
        <Grid item xs={12} md sx={{ display: (summary.emailEnabled || recapDelivery.email) ? 'block' : 'none' }}>
          <FieldRow helperText={summaryEmailError}>
            <TextField
              value={summary.email || ''}
              size="small"
              placeholder="Email(s) - separate multiple with commas"
              onChange={(e) => {
                setPrefs({ email: e.target.value });
                if (summaryEmailError) {
                  validateEmailList(e.target.value);
                }
              }}
              onBlur={(e) => validateEmailList(e.target.value)}
              fullWidth
              error={!!summaryEmailError}
              sx={{ bgcolor: (t) => bgInput(t) }}
            />
          </FieldRow>
        </Grid>

        <Grid item xs={12} md="auto">
          <FormControlLabel
            control={
              <Checkbox
                checked={!!summary.faxEnabled || recapDelivery.fax}
                onChange={(e) => toggleFax(e.target.checked)}
              />
            }
            label="Fax"
          />
        </Grid>
        <Grid item xs={12} md sx={{ display: (summary.faxEnabled || recapDelivery.fax) ? 'block' : 'none' }}>
          <FieldRow>
            <TextField
              value={summary.faxNumber || ''}
              size="small"
              placeholder="Fax Number"
              onChange={(e) => setPrefs({ faxNumber: e.target.value.replace(/[^\d\-()+ ]/g, '').slice(0, 18) })}
              fullWidth
              sx={{ bgcolor: (t) => bgInput(t) }}
            />
          </FieldRow>
        </Grid>

        <Grid item xs={12} md="auto">
          <FormControlLabel
            control={
              <Checkbox
                checked={!!recapDelivery.other}
                onChange={(e) => toggleOther(e.target.checked)}
              />
            }
            label="Other"
          />
        </Grid>
        <Grid item xs={12} md sx={{ display: recapDelivery.other ? 'block' : 'none' }}>
          <FieldRow>
            <TextField
              value={summary.recap?.otherNotes || ''}
              size="small"
              placeholder="Describe other delivery method"
              onChange={(e) => setRecap({ otherNotes: e.target.value })}
              fullWidth
              sx={{ bgcolor: (t) => bgInput(t) }}
            />
          </FieldRow>
        </Grid>
      </Grid>

      {/* When to receive */}
      <Typography sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
        When would you like to receive your Daily Summary/Recap?
      </Typography>

      <FormControlLabel
        sx={{ mb: 0.5 }}
        control={
          <Checkbox
            checked={!!summary.sameTimeWeekdays}
            onChange={(e) => toggleSameTimeWeekdays(e.target.checked)}
          />
        }
        label={
          <span>
            Same time every day Mon–Fri <em>(uses Monday’s times)</em>
          </span>
        }
      />
      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 1.5 }}>
        Weekend isn’t included — add Sat/Sun below if you want weekend recaps.
      </Typography>

      {/* Schedule table */}
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: (t) => bgHead(t), borderBottom: `2px solid ${alpha(theme.palette.divider, 0.75)}` }} />
              {DAYS.map((d) => (
                <TableCell
                  key={d.key}
                  align="center"
                  sx={{
                    fontWeight: 700,
                    bgcolor: (t) => bgHead(t),
                    borderBottom: `2px solid ${alpha(theme.palette.divider, 0.75)}`,
                    fontStyle: 'italic',
                    color: 'text.secondary',
                  }}
                >
                  {d.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Send row */}
            <TableRow>
              <TableCell sx={{ fontWeight: 600, bgcolor: (t) => bgHead(t) }}>Send?</TableCell>
              {DAYS.map((d) => (
                <TableCell key={`${d.key}-send`} align="center">
                  <Checkbox
                    checked={!!recapSchedule[d.key]?.enabled}
                    onChange={(e) => setDayEnabled(d.key, e.target.checked)}
                  />
                </TableCell>
              ))}
            </TableRow>
            {/* Times row */}
            <TableRow>
              <TableCell sx={{ fontWeight: 600, bgcolor: (t) => bgHead(t) }}>Time(s)</TableCell>
              {DAYS.map((d) => {
                const cell = recapSchedule[d.key] || { enabled: false, times: [] };
                const pending = pendingAdd[d.key] ?? '';
                return (
                  <TableCell key={`${d.key}-times`} align="center" sx={{ verticalAlign: 'top' }}>
                    <Stack direction="column" spacing={1} alignItems="center">
                      <Stack direction="row" spacing={0.75} flexWrap="wrap" justifyContent="center">
                        {cell.times.length === 0 && (
                          <Typography variant="caption" color="text.disabled">—</Typography>
                        )}
                        {cell.times.map((t, idx) => (
                          <Chip
                            key={`${d.key}-${t}-${idx}`}
                            label={t}
                            onDelete={() => removeTime(d.key, idx)}
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: 'divider' }}
                          />
                        ))}
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <FieldRow>
                          <TextField
                            type="time"
                            size="small"
                            value={pending || DEFAULT_TIME}
                            onChange={(e) => setPendingAdd((p) => ({ ...p, [d.key]: e.target.value }))}
                            disabled={!cell.enabled}
                            sx={{ width: 120, bgcolor: (t) => bgInput(t) }}
                            inputProps={{ step: 300, style: { padding: '6px 8px' } }}
                          />
                        </FieldRow>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => addTime(d.key, (pending || DEFAULT_TIME))}
                          disabled={!cell.enabled}
                        >
                          Add
                        </Button>
                      </Stack>
                    </Stack>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* No-message + include-no-message (together) */}
      <Grid container spacing={3} sx={{ mb: 1 }}>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!summary.alwaysSendEvenIfNoMessages}
                onChange={(e) => setPrefs({ alwaysSendEvenIfNoMessages: e.target.checked })}
              />
            }
            label="Receive a summary even with no messages?"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!summary.recap?.includeNoMessages}
                onChange={(e) => setRecap({ includeNoMessages: e.target.checked })}
              />
            }
            label="Include no-message calls in recap?"
          />
        </Grid>
      </Grid>

      {/* Hang-ups / spam */}
      <Typography sx={{ fontWeight: 600, mb: 0.75 }}>
        Do you want to see messages for hang-ups, spam, etc. on your daily report?
      </Typography>
      <Stack direction="row" spacing={3}>
        <FormControlLabel
          control={
            <Checkbox
              checked={summary.reportSpamHangups === true}
              onChange={() => setPrefs({ reportSpamHangups: true })}
            />
          }
          label="YES, include them"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={summary.reportSpamHangups === false}
              onChange={() => setPrefs({ reportSpamHangups: false })}
            />
          }
          label="NO, discard"
        />
      </Stack>
    </Paper>
  );
}

export default SummaryPreferencesSection;
