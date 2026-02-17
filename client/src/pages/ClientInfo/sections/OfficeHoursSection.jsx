// src/pages/ClientInfo/sections/OfficeHoursSection.jsx
import React, { useEffect } from 'react';
import {
  Checkbox,
  Button,
  Box,
  Typography,
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
  Alert,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useWizard } from '../context_API/WizardContext';
import TwelveHourTimeField from '../components/TwelveHourTimeField';

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

const OfficeHoursSection = () => {
  const { formData, updateSection } = useWizard();
  const companyInfo = formData.companyInfo || {};
  const officeHours = companyInfo.officeHours || {};
  const lunch = companyInfo.lunchHours || { enabled: false, open: '12:00', close: '13:00' };
  const timeZone = companyInfo.timeZone || '';

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
  return (
    <Box sx={{ mt: 2 }}>
      <Alert severity="info" sx={{ mb: 2 }}>
        If your hours or availability change after submission, reach out to your AnSer support team and we'll update the live instructions right away.
      </Alert>
      <Box sx={{ mt: 2 }}>
          {/* Time Zone */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            <Typography sx={{ color: 'text.primary', fontWeight: 600, minWidth: 100 }}>
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
                        <TwelveHourTimeField
                          size="small"
                          value={value}
                          disabled={!!dayObj?.closed}
                          onChange={(nextValue) => setDay(d.key, 'open', nextValue)}
                          stepMinutes={5}
                          includeEmptyOption={false}
                          sx={{
                            bgcolor: (t) => (!!dayObj?.closed ? bgDisabled(t) : bgInput(t)),
                            width: '130px',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
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
                        <TwelveHourTimeField
                          size="small"
                          value={value}
                          disabled={!!dayObj?.closed}
                          onChange={(nextValue) => setDay(d.key, 'close', nextValue)}
                          stepMinutes={5}
                          includeEmptyOption={false}
                          sx={{
                            bgcolor: (t) => (!!dayObj?.closed ? bgDisabled(t) : bgInput(t)),
                            width: '130px',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
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
                            <TwelveHourTimeField
                              size="small"
                              value={lunch.open || '12:00'}
                              onChange={(nextValue) => setLunch({ open: nextValue })}
                              stepMinutes={5}
                              includeEmptyOption={false}
                              sx={{
                                width: 130,
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: (t) => bgInput(t)
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.3 }}>
                              End
                            </Typography>
                            <TwelveHourTimeField
                              size="small"
                              value={lunch.close || '13:00'}
                              onChange={(nextValue) => setLunch({ close: nextValue })}
                              stepMinutes={5}
                              includeEmptyOption={false}
                              sx={{
                                width: 130,
                                borderRadius: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: (t) => bgInput(t)
                              }}
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

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Button size="small" variant="outlined" onClick={copyMonday}>
              Copy Monday to Weekdays
            </Button>
          </Box>
        </Box>
      </Box>
  );
};

export default OfficeHoursSection;

