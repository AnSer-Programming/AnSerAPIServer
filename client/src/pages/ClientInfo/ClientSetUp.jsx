import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import {
  Box, Button, Snackbar, Alert, Checkbox, FormControlLabel, Typography, Paper,
  Container, Divider, Accordion, AccordionSummary, AccordionDetails, FormControl, Select, MenuItem, TextField
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

const ClientSetUp = () => {
  const history = useHistory();
  const { formData, updateSection } = useWizard();
  const { darkMode } = useClientInfoTheme();

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [form, setForm] = useState(() => {
    const initialOfficeHours = {};
    const initialLunchHours = {};
    daysOfWeek.forEach(day => {
      initialOfficeHours[day] = {};
      initialLunchHours[day] = {};
    });
    return {
      company: '',
      complexName: '',
      physicalAddress: '',
      billingAddress: '',
      timeZone: '',
      takeLunchCalls: false,
      officeHours: initialOfficeHours,
      lunchHours: initialLunchHours,
      ...formData.companyInfo
    };
  });

  const [bulkOffice, setBulkOffice] = useState({ start: {}, end: {} });
  const [bulkOfficeDays, setBulkOfficeDays] = useState([]);
  const [bulkLunch, setBulkLunch] = useState({ start: {}, end: {} });
  const [bulkLunchDays, setBulkLunchDays] = useState([]);

  const [errors, setErrors] = useState({});

  const debouncedUpdate = debounce(data => updateSection('companyInfo', data), 300);
  useEffect(() => { debouncedUpdate(form); }, [form]);

  const handleInputChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleTakeLunchCallsChange = e => setForm({ ...form, takeLunchCalls: e.target.checked });

  const handleApplyBulk = (type, time, days) => {
    const timeObj = {
      startHour: time.start.hour,
      startMinute: time.start.minute,
      startMeridiem: time.start.meridiem,
      endHour: time.end.hour,
      endMinute: time.end.minute,
      endMeridiem: time.end.meridiem
    };
    setForm(prev => {
      const updated = { ...prev[type] };
      days.forEach(day => {
        updated[day] = { ...timeObj };
      });
      return { ...prev, [type]: updated };
    });
    if (type === 'officeHours') {
      setBulkOffice({ start: {}, end: {} });
      setBulkOfficeDays([]);
    } else {
      setBulkLunch({ start: {}, end: {} });
      setBulkLunchDays([]);
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.company.trim()) errs.company = 'Company Name is required';
    if (!form.physicalAddress.trim()) errs.physicalAddress = 'Physical Address is required';
    if (!form.timeZone) errs.timeZone = 'Time Zone is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveExit = () => {
    if (!validate()) return;
    localStorage.setItem('ClientWizardDraft', JSON.stringify(form));
    setShowSnackbar(true);
  };

  const handleContinue = () => {
    if (!validate()) return;
    history.push('/ClientInfoReact/NewFormWizard/OfficeReach');
  };

  const renderSummary = () => (
    <Paper sx={{ mt: 3, p: 2 }}>
      <Typography variant="h6">✅ Confirmed Summary</Typography>
      <Typography><strong>Time Zone:</strong> {form.timeZone}</Typography>
      {daysOfWeek.map(day => {
        const office = form.officeHours[day];
        const lunch = form.lunchHours[day];
        return (
          <Typography key={day}>
            {day.toUpperCase()} - Start: {office.startHour}:{office.startMinute} {office.startMeridiem} 
            , End: {office.endHour}:{office.endMinute} {office.endMeridiem}
            {form.takeLunchCalls && lunch.startHour && ` | Lunch: ${lunch.startHour}:${lunch.startMinute} ${lunch.startMeridiem} - ${lunch.endHour}:${lunch.endMinute} ${lunch.endMeridiem}`}
          </Typography>
        );
      })}
    </Paper>
  );

  const renderTimeSelects = (label, time, setTime, which) => (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
      <Typography variant="caption" sx={{ minWidth: 50 }}>{label}</Typography>
      <FormControl size="small">
        <Select value={time[which].hour || ''} onChange={e => setTime(prev => ({ ...prev, [which]: { ...prev[which], hour: e.target.value } }))} displayEmpty>
          <MenuItem value="">Hr</MenuItem>
          {hours.map(h => <MenuItem key={h} value={h}>{h}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl size="small">
        <Select value={time[which].minute || ''} onChange={e => setTime(prev => ({ ...prev, [which]: { ...prev[which], minute: e.target.value } }))} displayEmpty>
          <MenuItem value="">Min</MenuItem>
          {minutes.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </Select>
      </FormControl>
      <FormControl size="small">
        <Select value={time[which].meridiem || ''} onChange={e => setTime(prev => ({ ...prev, [which]: { ...prev[which], meridiem: e.target.value } }))} displayEmpty>
          <MenuItem value="">AM/PM</MenuItem>
          {meridiems.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
  );

  const renderBulkSelector = (label, time, setTime, days, setDays, type) => (
    <>
      <Typography variant="subtitle2" sx={{ mt: 1 }}>{label} - Bulk Apply</Typography>
      {renderTimeSelects("Start", time, setTime, "start")}
      {renderTimeSelects("End", time, setTime, "end")}
      <Button sx={{ mt:1 }} size="small" variant="contained" onClick={() => handleApplyBulk(type, time, days)}>Apply</Button>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {daysOfWeek.map(day => (
          <FormControlLabel
            key={day}
            control={<Checkbox
              checked={days.includes(day)}
              onChange={e => {
                setDays(prev => e.target.checked ? [...prev, day] : prev.filter(d => d !== day));
              }}
            />}
            label={day.toUpperCase()}
          />
        ))}
      </Box>
      <Divider sx={{ my: 2 }} />
    </>
  );

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      bgcolor: darkMode ? '#121212' : '#f5f5f5',
      minHeight: '100vh',
      color: darkMode ? '#fff' : '#000'
    }}>
      <ClientInfoNavbar />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, bgcolor: darkMode ? '#1e1e1e' : '#fff' }}>
          <Typography variant="h4" gutterBottom>New Company Information</Typography>
          <Divider sx={{ mb: 3 }} />

          <TextField label="Company Name *" name="company" error={!!errors.company} helperText={errors.company} fullWidth sx={{ mb: 2 }} value={form.company} onChange={handleInputChange} />
          <TextField label="Complex Name" name="complexName" fullWidth sx={{ mb: 2 }} value={form.complexName} onChange={handleInputChange} />
          <TextField label="Physical Address *" name="physicalAddress" error={!!errors.physicalAddress} helperText={errors.physicalAddress} fullWidth sx={{ mb: 2 }} value={form.physicalAddress} onChange={handleInputChange} />
          <TextField label="Billing Address" name="billingAddress" fullWidth sx={{ mb: 2 }} value={form.billingAddress} onChange={handleInputChange} />
          
          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.timeZone}>
            <Typography variant="caption">Time Zone *</Typography>
            <Select name="timeZone" value={form.timeZone} onChange={handleInputChange}>
              <MenuItem value="">Select Time Zone</MenuItem>
              <MenuItem value="EST">Eastern</MenuItem>
              <MenuItem value="CST">Central</MenuItem>
              <MenuItem value="MST">Mountain</MenuItem>
              <MenuItem value="PST">Pacific</MenuItem>
            </Select>
            {errors.timeZone && <Typography variant="caption" color="error">{errors.timeZone}</Typography>}
          </FormControl>

          {/* Office Hours */}
          <Accordion defaultExpanded sx={{ mt: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Office Hours</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {renderBulkSelector('Office Hours', bulkOffice, setBulkOffice, bulkOfficeDays, setBulkOfficeDays, 'officeHours')}
              {daysOfWeek.map((day, idx) => (
                <DayTimeRangePicker
                  key={`office-${day}`}
                  day={day}
                  type="officeHours"
                  values={form.officeHours[day]}
                  onChange={(type, d, k, v) => {
                    setForm(prev => ({
                      ...prev,
                      [type]: { ...prev[type], [day]: { ...prev[type][day], [k]: v } }
                    }));
                  }}
                  showHeader={idx === 0}
                />
              ))}
            </AccordionDetails>
          </Accordion>

          <FormControlLabel
            sx={{ mt: 3 }}
            control={<Checkbox checked={form.takeLunchCalls} onChange={handleTakeLunchCallsChange} />}
            label="Do you need us to take calls during your lunch hours?"
          />

          {form.takeLunchCalls && (
            <Accordion defaultExpanded sx={{ mt: 3 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Lunch Breaks</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {renderBulkSelector('Lunch Breaks', bulkLunch, setBulkLunch, bulkLunchDays, setBulkLunchDays, 'lunchHours')}
                {daysOfWeek.map((day, idx) => (
                  <DayTimeRangePicker
                    key={`lunch-${day}`}
                    day={day}
                    type="lunchHours"
                    values={form.lunchHours[day]}
                    onChange={(type, d, k, v) => {
                      setForm(prev => ({
                        ...prev,
                        [type]: { ...prev[type], [day]: { ...prev[type][day], [k]: v } }
                      }));
                    }}
                    showHeader={idx === 0}
                  />
                ))}
              </AccordionDetails>
            </Accordion>
          )}

          {renderSummary()}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" onClick={handleSaveExit}>Save & Exit</Button>
            <Button variant="contained" onClick={handleContinue}>Continue</Button>
          </Box>
        </Paper>
      </Container>
      <ClientInfoFooter />
      <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={() => setShowSnackbar(false)}>
        <Alert onClose={() => setShowSnackbar(false)} severity="info">Changes saved</Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientSetUp;
