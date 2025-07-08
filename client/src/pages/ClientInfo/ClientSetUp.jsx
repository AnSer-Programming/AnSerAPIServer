import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
import {
  Box, Button, Snackbar, Alert, Checkbox, FormControlLabel, Typography, Paper,
  Container, Divider, Accordion, AccordionSummary, AccordionDetails, FormControl, Select, MenuItem, TextField,
  InputLabel, FormHelperText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useWizard } from './WizardContext';
import { useHistory } from 'react-router-dom';
import ClientInfoNavbar from './ClientInfoNavbar';
import ClientInfoFooter from './ClientInfoFooter';
import DayTimeRangePicker from './DayTimeRangePicker';
import { useClientInfoTheme } from './ClientInfoThemeContext';

const daysOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const hours = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const minutes = ['00', '15', '30', '45'];
const meridiems = ['AM', 'PM'];

const convertTo24Hour = (hourStr, meridiem) => {
  if (!hourStr || !meridiem) return null;
  let hour = parseInt(hourStr, 10);
  if (meridiem === 'PM' && hour < 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  return hour;
};

const formatDateForDisplay = (dateString) => {
  if (!dateString) return 'No date';
  // The 'T00:00:00' is added to ensure the date is parsed in the local timezone
  // rather than UTC, which can prevent off-by-one day errors.
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
};

// Memoized component for time selection dropdowns to prevent unnecessary re-renders.
const TimeSelects = React.memo(({ label, time, setTime, which, disabled = false }) => (
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
    <Typography variant="caption" sx={{ minWidth: 50 }}>{label}</Typography>
    <FormControl size="small" disabled={disabled}>
      <Select value={time[which]?.hour || ''} onChange={e => setTime(prev => ({ ...prev, [which]: { ...prev[which], hour: e.target.value } }))} displayEmpty>
        <MenuItem value="">Hr</MenuItem>
        {hours.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}
      </Select>
    </FormControl>
    <FormControl size="small" disabled={disabled}>
      <Select value={time[which]?.minute || ''} onChange={e => setTime(prev => ({ ...prev, [which]: { ...prev[which], minute: e.target.value } }))} displayEmpty>
        <MenuItem value="">Min</MenuItem>
        {minutes.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
      </Select>
    </FormControl>
    <FormControl size="small" disabled={disabled}>
      <Select value={time[which]?.meridiem || ''} onChange={e => setTime(prev => ({ ...prev, [which]: { ...prev[which], meridiem: e.target.value } }))} displayEmpty>
        <MenuItem value="">AM/PM</MenuItem>
        {meridiems.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
      </Select>
    </FormControl>
  </Box>
));

// Memoized component for the entire bulk selection UI.
const BulkTimeSelector = React.memo(({ label, time, setTime, days, setDays, onApply }) => (
  <>
    <Typography variant="subtitle2" sx={{ mt: 1 }}>{label} - Bulk Apply</Typography>
    <TimeSelects label="Start" time={time} setTime={setTime} which="start" />
    <TimeSelects label="End" time={time} setTime={setTime} which="end" />
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1, mb: 1 }}>
      {daysOfWeek.map(day => (
        <FormControlLabel
          key={day}
          control={<Checkbox
            checked={days.includes(day)}
            onChange={e => setDays(prev => e.target.checked ? [...prev, day] : prev.filter(d => d !== day))}
          />}
          label={day.toUpperCase()}
        />
      ))}
    </Box>
    <Button size="small" variant="contained" onClick={onApply} disabled={days.length === 0}>Apply</Button>
  </>
));

const ClientSetUp = () => {
  const history = useHistory();
  const { formData, updateSection } = useWizard();
  const { darkMode } = useClientInfoTheme();

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [form, setForm] = useState(() => {
    const initialOfficeHours = daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: {} }), {});
    const initialLunchHours = daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: {} }), {});
    return {
      company: '', complexName: '', physicalAddress: '', billingAddress: '', timeZone: '',
      takeLunchCalls: false, officeHours: initialOfficeHours, lunchHours: initialLunchHours, specialEvents: [],
      ...(formData.companyInfo || {})
    };
  });
  const [errors, setErrors] = useState({});

  const [bulkOffice, setBulkOffice] = useState({ start: {}, end: {} });
  const [bulkOfficeDays, setBulkOfficeDays] = useState([]);
  const [bulkLunch, setBulkLunch] = useState({ start: {}, end: {} });
  const [bulkLunchDays, setBulkLunchDays] = useState([]);

  const bulkStateSetters = {
    officeHours: { setTime: setBulkOffice, setDays: setBulkOfficeDays },
    lunchHours: { setTime: setBulkLunch, setDays: setBulkLunchDays },
  };

  const debouncedUpdate = useCallback(debounce(data => updateSection('companyInfo', data), 300), []);
  useEffect(() => { debouncedUpdate(form); }, [form, debouncedUpdate]);

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleTakeLunchCallsChange = (e) => setForm({ ...form, takeLunchCalls: e.target.checked });

  const handleSaveExit = () => {
    localStorage.setItem('ClientWizardDraft', JSON.stringify(form));
    setShowSnackbar(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.company.trim()) errs.company = 'Company Name is required';
    if (!form.physicalAddress.trim()) errs.physicalAddress = 'Physical Address is required';
    if (!form.timeZone) errs.timeZone = 'Time Zone is required';

    ['officeHours', 'lunchHours'].forEach(type => {
      if (type === 'lunchHours' && !form.takeLunchCalls) return;
      const typeErrors = {};
      daysOfWeek.forEach(day => {
        const dayHours = form[type][day];
        if (dayHours && dayHours.startHour && dayHours.endHour) {
          const startHour24 = convertTo24Hour(dayHours.startHour, dayHours.startMeridiem);
          const endHour24 = convertTo24Hour(dayHours.endHour, dayHours.endMeridiem);
          const startMinute = parseInt(dayHours.startMinute, 10);
          const endMinute = parseInt(dayHours.endMinute, 10);
          if (startHour24 > endHour24 || (startHour24 === endHour24 && startMinute >= endMinute)) {
            typeErrors[day] = 'End time must be after start time.';
          }
        }
      });
      if (Object.keys(typeErrors).length > 0) errs[type] = typeErrors;
    });

    errs.specialEvents = [];
    (form.specialEvents || []).forEach((event, index) => {
      const eventErrors = {};
      if (!event.name || !event.name.trim()) eventErrors.name = 'Event name is required.';
      if (!event.date) eventErrors.date = 'Date is required.';
      if (!event.isClosed && event.hours && event.hours.startHour && event.hours.endHour) {
        const startHour24 = convertTo24Hour(event.hours.startHour, event.hours.startMeridiem);
        const endHour24 = convertTo24Hour(event.hours.endHour, event.hours.endMeridiem);
        const startMinute = parseInt(event.hours.startMinute, 10);
        const endMinute = parseInt(event.hours.endMinute, 10);
        if (startHour24 > endHour24 || (startHour24 === endHour24 && startMinute >= endMinute)) {
          eventErrors.hours = 'End time must be after start time.';
        }
      }
      if (Object.keys(eventErrors).length > 0) errs.specialEvents[index] = eventErrors;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0 && errs.specialEvents.every(e => Object.keys(e).length === 0);
  };

  const handleContinue = () => {
    if (validate()) {
      history.push('/ClientInfoReact/NewFormWizard/OfficeReach');
    }
  };

  const handleClearDay = (type, day) => setForm(prev => ({ ...prev, [type]: { ...prev[type], [day]: {} } }));

  const handleCopyFromMonday = (type) => {
    const mondayHours = form[type]['mon'];
    if (Object.keys(mondayHours).length === 0) return;
    setForm(prev => {
      const updatedHours = { ...prev[type] };
      daysOfWeek.forEach(day => { updatedHours[day] = { ...mondayHours }; });
      return { ...prev, [type]: updatedHours };
    });
  };

  const handleApplyBulk = (type, time, days) => {
    const timeObj = {
      startHour: time.start.hour, startMinute: time.start.minute, startMeridiem: time.start.meridiem,
      endHour: time.end.hour, endMinute: time.end.minute, endMeridiem: time.end.meridiem,
    };
    setForm(prev => {
      const updated = { ...prev[type] };
      days.forEach(day => { updated[day] = timeObj; });
      return { ...prev, [type]: updated };
    });
    const { setTime, setDays } = bulkStateSetters[type];
    setTime({ start: {}, end: {} });
    setDays([]);
  };

  const handleAddEvent = () => setForm(prev => ({ ...prev, specialEvents: [...(prev.specialEvents || []), { id: Date.now(), name: '', date: null, hours: {}, isClosed: false }] }));
  const handleRemoveEvent = (index) => setForm(prev => ({ ...prev, specialEvents: prev.specialEvents.filter((_, i) => i !== index) }));
  const handleEventChange = (index, field, value) => setForm(prev => ({ ...prev, specialEvents: prev.specialEvents.map((event, i) => i === index ? { ...event, [field]: value } : event) }));
  const handleEventIsClosedChange = (index, isClosed) => {
    setForm(prev => {
      const newEvents = [...prev.specialEvents];
      const event = { ...newEvents[index], isClosed };
      if (isClosed) event.hours = {};
      newEvents[index] = event;
      return { ...prev, specialEvents: newEvents };
    });
  };

  const formatTimeRange = (timeObj) => {
    if (!timeObj || !timeObj.startHour || !timeObj.endHour) return 'Not Set';
    return `${timeObj.startHour}:${timeObj.startMinute} ${timeObj.startMeridiem} - ${timeObj.endHour}:${timeObj.endMinute} ${timeObj.endMeridiem}`;
  };

  const renderHoursSection = (title, type, bulkTime, setBulkTime, bulkDays, setBulkDays) => (
    <Accordion defaultExpanded sx={{ mt: 3 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">{title}</Typography></AccordionSummary>
      <AccordionDetails>
        <BulkTimeSelector label={title} time={bulkTime} setTime={setBulkTime} days={bulkDays} setDays={setBulkDays} onApply={() => handleApplyBulk(type, bulkTime, bulkDays)} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          {type === 'officeHours' && <Button size="small" onClick={() => handleCopyFromMonday(type)}>Copy Mon to All</Button>}
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, mt: 2 }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ width: '80px', flexShrink: 0, fontWeight: 'bold', textTransform: 'uppercase', pl: 2 }}>Day</Typography>
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-around' }}><Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Start Time</Typography><Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>End Time</Typography></Box>
          </Box>
          <Box sx={{ width: '65px', flexShrink: 0 }} />
        </Box>
        {daysOfWeek.map((day, idx) => (
          <Box key={`${type}-${day}-row`} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: idx === daysOfWeek.length - 1 ? 0 : 1 }}>
            <Box sx={{ flex: 1 }}>
              <DayTimeRangePicker day={day} type={type} values={form[type][day]} onChange={(type, d, k, v) => setForm(prev => ({ ...prev, [type]: { ...prev[type], [day]: { ...prev[type][day], [k]: v } } }))} showHeader={false} />
              {errors[type]?.[day] && <FormHelperText error sx={{ pl: '96px' }}>{errors[type][day]}</FormHelperText>}
            </Box>
            <Button size="small" variant="outlined" onClick={() => handleClearDay(type, day)}>Clear</Button>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );

  const renderSpecialEventsSection = () => (
    <Accordion sx={{ mt: 3 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography variant="h6">Holidays & Special Events</Typography></AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" sx={{ mb: 2 }}>Define specific dates with different hours that override the regular weekly schedule.</Typography>
        {(form.specialEvents || []).map((event, index) => {
          const setEventTime = (updater) => handleEventChange(index, 'hours', updater(event.hours || { start: {}, end: {} }));
          return (
            <Paper key={event.id || index} variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <TextField label="Event Name" value={event.name} onChange={(e) => handleEventChange(index, 'name', e.target.value)} fullWidth size="small" error={!!errors.specialEvents?.[index]?.name} helperText={errors.specialEvents?.[index]?.name} />
                <TextField
                  label="Date"
                  type="date"
                  value={event.date || ''}
                  onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                  sx={{ ml: 2, minWidth: 220 }}
                  size="small"
                  fullWidth
                  error={!!errors.specialEvents?.[index]?.date}
                  helperText={errors.specialEvents?.[index]?.date}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <TimeSelects label="Start" time={event.hours || { start: {}, end: {} }} setTime={setEventTime} which="start" disabled={event.isClosed} />
                  <TimeSelects label="End" time={event.hours || { start: {}, end: {} }} setTime={setEventTime} which="end" disabled={event.isClosed} />
                  {errors.specialEvents?.[index]?.hours && <FormHelperText error sx={{ mt: 1, pl: '58px' }}>{errors.specialEvents?.[index]?.hours}</FormHelperText>}
                </Box>
                <Button variant="outlined" color="error" size="small" onClick={() => handleRemoveEvent(index)}>Remove</Button>
              </Box>
              <FormControlLabel control={<Checkbox checked={event.isClosed} onChange={(e) => handleEventIsClosedChange(index, e.target.checked)} />} label="Closed all day" />
            </Paper>
          );
        })}
        <Button variant="contained" onClick={handleAddEvent} sx={{ mt: 1 }}>Add Holiday/Event</Button>
      </AccordionDetails>
    </Accordion>
  );

  const renderSummary = () => (
    <Paper sx={{ mt: 3, p: 2 }}>
      <Typography variant="h6">✅ Confirmed Summary</Typography>
      <Typography><strong>Time Zone:</strong> {form.timeZone}</Typography>
      {daysOfWeek.map(day => (
        <Typography key={day}>
          <strong>{day.toUpperCase()}:</strong> Office: {formatTimeRange(form.officeHours[day])}
          {form.takeLunchCalls && ` | Lunch: ${formatTimeRange(form.lunchHours[day])}`}
        </Typography>
      ))}
      {(form.specialEvents || []).length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Holidays & Special Events:</Typography>
          {(form.specialEvents || []).map((event, index) => (
            <Typography key={event.id || index} sx={{ pl: 2 }}>
              <strong>{event.name || 'Unnamed Event'} ({formatDateForDisplay(event.date)}):</strong> {event.isClosed ? 'Closed' : formatTimeRange(event.hours)}
            </Typography>
          ))}
        </>
      )}
    </Paper>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: darkMode ? '#121212' : '#f5f5f5', minHeight: '100vh', color: darkMode ? '#fff' : '#000' }}>
      <ClientInfoNavbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
          <Typography variant="h4" gutterBottom>New Company Information</Typography>
          <Divider sx={{ mb: 3 }} />

          <TextField label="Company Name *" name="company" fullWidth sx={{ mb: 2 }} value={form.company} onChange={handleInputChange} error={!!errors.company} helperText={errors.company} />
          <TextField label="Complex Name" name="complexName" fullWidth sx={{ mb: 2 }} value={form.complexName} onChange={handleInputChange} />
          <TextField label="Physical Address *" name="physicalAddress" fullWidth sx={{ mb: 2 }} value={form.physicalAddress} onChange={handleInputChange} error={!!errors.physicalAddress} helperText={errors.physicalAddress} />
          <TextField label="Billing Address" name="billingAddress" fullWidth sx={{ mb: 2 }} value={form.billingAddress} onChange={handleInputChange} />

          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.timeZone}>
            <InputLabel id="timezone-label">Time Zone *</InputLabel>
            <Select
              labelId="timezone-label"
              name="timeZone"
              value={form.timeZone}
              onChange={handleInputChange}
              label="Time Zone *"
            >
              <MenuItem value=""><em>Select Time Zone</em></MenuItem>
              <MenuItem value="EST">Eastern</MenuItem>
              <MenuItem value="CST">Central</MenuItem>
              <MenuItem value="MST">Mountain</MenuItem>
              <MenuItem value="PST">Pacific</MenuItem>
            </Select>
            {errors.timeZone && <FormHelperText>{errors.timeZone}</FormHelperText>}
          </FormControl>

          {renderHoursSection('Office Hours', 'officeHours', bulkOffice, setBulkOffice, bulkOfficeDays, setBulkOfficeDays)}

          <FormControlLabel
            control={<Checkbox checked={form.takeLunchCalls} onChange={handleTakeLunchCallsChange} />}
            label="Do you need us to take calls during your lunch hours?"
          />

          {form.takeLunchCalls && renderHoursSection('Lunch Breaks', 'lunchHours', bulkLunch, setBulkLunch, bulkLunchDays, setBulkLunchDays)}

          {renderSpecialEventsSection()}

          {renderSummary()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" onClick={handleSaveExit}>Save & Exit</Button>
            <Button variant="contained" onClick={handleContinue}>Continue</Button>
          </Box>
        </Paper>
      </Container>
      <ClientInfoFooter />
      <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={() => setShowSnackbar(false)}>
        <Alert severity="info">Changes saved</Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientSetUp;