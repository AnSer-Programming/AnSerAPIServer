// src/pages/ClientInfo/ClientSetUp.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography, FormHelperText, Paper, Container, CircularProgress, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import { useWizard } from './WizardContext';
import { useHistory } from 'react-router-dom';
import ClientInfoNavbar from './ClientInfoNavbar';
import ClientInfoFooter from './ClientInfoFooter';
import PhoneMaskInput from './PhoneMaskInput';
import DayTimeRangePicker from './DayTimeRangePicker';

const ClientSetUp = () => {
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const { formData, updateSection } = useWizard();

  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(() => {
    const defaultState = {
      company: '',
      complexName: '',
      physicalAddress: '',
      billingAddress: '', // Corresponds to MAILING ADDRESS in PDF
      primaryOfficeLine: '',
      tollFree: '',
      secondaryBackLine: '',
      fax: '',
      officeEmail: '',
      website: '',
      officeHours: { mon: {}, tue: {}, wed: {}, thu: {}, fri: {}, sat: {}, sun: {} },
      lunchBreak: { mon: {}, tue: {}, wed: {}, thu: {}, fri: {}, sat: {}, sun: {} },
      plannedUsage: [],
      holidays: '',
      otherUsage: '',
      personnel: [{ name: '', title: '', email: '', office: '', cell: '', other: '' }],
      dailySummary: {
        email: '',
        fax: '',
        days: [],
        time: ''
      }
    };
    return { ...defaultState, ...(formData.companyInfo || {}) };
  });
  const [errors, setErrors] = useState({});

  const [plannedUsageOptions] = useState([
    '24/7/365',
    'Outside business hours',
    'Business hours overflow',
    'Lunch',
    'Emergency Times'
  ]);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/companies')
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : res.data.companies || [];
        setCompanyList(list);
      })
      .catch(err => {
        console.error('Error fetching company list:', err);
        setCompanyList([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    updateSection('companyInfo', form);
  }, [form]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (type, day, key, value) => {
    setForm(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [day]: {
          ...prev[type][day],
          [key]: value
        }
      }
    }));
  };

  const handlePlannedUsageToggle = (option) => {
    setForm(prev => {
      const current = new Set(prev.plannedUsage);
      current.has(option) ? current.delete(option) : current.add(option);
      return { ...prev, plannedUsage: Array.from(current) };
    });
  };

  const handlePersonnelChange = (index, e) => {
    const { name, value } = e.target;
    const list = [...form.personnel];
    list[index][name] = value;
    setForm(prev => ({ ...prev, personnel: list }));
  };

  const addPersonnel = () => {
    setForm(prev => ({ ...prev, personnel: [...prev.personnel, { name: '', title: '', email: '', office: '', cell: '', other: '' }] }));
  };

  const removePersonnel = (index) => {
    const list = [...form.personnel];
    list.splice(index, 1);
    setForm(prev => ({ ...prev, personnel: list }));
  };

  const handleSummaryChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      dailySummary: {
        ...prev.dailySummary,
        [name]: value
      }
    }));
  };

  const handleSummaryDayToggle = (day) => {
    setForm(prev => {
      const current = new Set(prev.dailySummary.days);
      current.has(day) ? current.delete(day) : current.add(day);
      return {
        ...prev,
        dailySummary: {
          ...prev.dailySummary,
          days: Array.from(current)
        }
      };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.company) newErrors.company = "Company selection is required.";
    if (!form.physicalAddress.trim()) newErrors.physicalAddress = "Physical address is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      updateSection('companyInfo', form);
      history.push('/ClientInfoReact/NewFormWizard/OfficeReach');
    }
  };
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <ClientInfoNavbar />
        <Container sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading Company Data...</Typography>
        </Container>
        <ClientInfoFooter />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ClientInfoNavbar />

      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Company Information
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please fill out the primary details for the new client. All fields marked with * are required.
          </Typography>

          {/* --- Company Details --- */}
          <Typography variant="h6" gutterBottom>Company Details</Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.company}>
                <InputLabel id="company-select-label">Select Company *</InputLabel>
                <Select
                  labelId="company-select-label"
                  name="company"
                  value={form.company}
                  label="Select Company *"
                  onChange={handleInputChange}
                >
                  {Array.isArray(companyList) && companyList.map((c, i) => (
                    <MenuItem key={i} value={c}>{c}</MenuItem>
                  ))}
                </Select>
                {errors.company && <FormHelperText>{errors.company}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Complex Name (if applicable)"
                name="complexName"
                fullWidth
                value={form.complexName}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* --- Address Information --- */}
          <Typography variant="h6" gutterBottom>Address Information</Typography>
          <TextField
            label="Physical Address"
            name="physicalAddress"
            required
            fullWidth
            value={form.physicalAddress}
            onChange={handleInputChange}
            error={!!errors.physicalAddress}
            helperText={errors.physicalAddress}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Billing Address"
            name="billingAddress"
            fullWidth
            value={form.billingAddress}
            onChange={handleInputChange}
          />

          <Divider sx={{ my: 4 }} />

          {/* --- Contact Information --- */}
          <Typography variant="h6" gutterBottom>Contact Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Primary Office Line"
                name="primaryOfficeLine"
                fullWidth
                value={form.primaryOfficeLine}
                onChange={handleInputChange}
                InputProps={{ inputComponent: PhoneMaskInput }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Toll Free"
                name="tollFree"
                fullWidth
                value={form.tollFree}
                onChange={handleInputChange}
                InputProps={{ inputComponent: PhoneMaskInput }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Secondary/Back Line"
                name="secondaryBackLine"
                fullWidth
                value={form.secondaryBackLine}
                onChange={handleInputChange}
                InputProps={{ inputComponent: PhoneMaskInput }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Fax"
                name="fax"
                fullWidth
                value={form.fax}
                onChange={handleInputChange}
                InputProps={{ inputComponent: PhoneMaskInput }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}><TextField label="Office Email" name="officeEmail" fullWidth value={form.officeEmail} onChange={handleInputChange} /></Grid>
            <Grid item xs={12} sm={6} md={4}><TextField label="Website" name="website" fullWidth value={form.website} onChange={handleInputChange} /></Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* --- Office Hours & Breaks --- */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Office Hours & Breaks</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1" gutterBottom>Office Hours</Typography>
              {Object.keys(form.officeHours).map((day) => (
                <DayTimeRangePicker
                  key={day}
                  day={day}
                  type="officeHours"
                  values={form.officeHours[day]}
                  onChange={handleTimeChange}
                />
              ))}
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>Lunch Break</Typography>
              {Object.keys(form.lunchBreak).map((day) => (
                <DayTimeRangePicker
                  key={`${day}-lunch`}
                  day={day}
                  type="lunchBreak"
                  values={form.lunchBreak[day]}
                  onChange={handleTimeChange}
                />
              ))}
            </AccordionDetails>
          </Accordion>

          <Divider sx={{ my: 4 }} />

          {/* --- Service Usage --- */}
          <Box>
            <Typography variant="h6" gutterBottom>Planned Service Usage</Typography>
            {plannedUsageOptions.map((opt, i) => (
              <FormControlLabel
                key={i}
                control={<Checkbox checked={form.plannedUsage.includes(opt)} onChange={() => handlePlannedUsageToggle(opt)} />}
                label={opt}
              />
            ))}
            <TextField label="Holidays (please list)" name="holidays" fullWidth value={form.holidays} onChange={handleInputChange} sx={{ mt: 1 }} />
            <TextField label="Other (please explain)" name="otherUsage" fullWidth value={form.otherUsage} onChange={handleInputChange} sx={{ mt: 2 }} />
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* --- Primary Office Personnel --- */}
          <Box>
            <Typography variant="h6" gutterBottom>Primary Office Personnel</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              List the main contacts at the office. This is not for on-call staff.
            </Typography>
            {form.personnel.map((p, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><TextField label="Name" name="name" fullWidth size="small" value={p.name} onChange={e => handlePersonnelChange(index, e)} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Title" name="title" fullWidth size="small" value={p.title} onChange={e => handlePersonnelChange(index, e)} /></Grid>
                  <Grid item xs={12}><TextField label="Email" name="email" fullWidth size="small" value={p.email} onChange={e => handlePersonnelChange(index, e)} /></Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Office Phone"
                      name="office"
                      fullWidth
                      size="small"
                      value={p.office}
                      onChange={e => handlePersonnelChange(index, e)}
                      InputProps={{ inputComponent: PhoneMaskInput }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Cell Phone"
                      name="cell"
                      fullWidth
                      size="small"
                      value={p.cell}
                      onChange={e => handlePersonnelChange(index, e)}
                      InputProps={{ inputComponent: PhoneMaskInput }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Other Phone"
                      name="other"
                      fullWidth
                      size="small"
                      value={p.other}
                      onChange={e => handlePersonnelChange(index, e)}
                      InputProps={{ inputComponent: PhoneMaskInput }}
                    />
                  </Grid>
                </Grid>
                {form.personnel.length > 1 && (
                  <Button variant="outlined" color="error" onClick={() => removePersonnel(index)} sx={{ mt: 2 }} size="small">
                    Remove Personnel
                  </Button>
                )}
              </Paper>
            ))}
            <Button variant="contained" onClick={addPersonnel} sx={{ mt: 1 }}>
              Add Personnel
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* --- Daily Message Summary --- */}
          <Box>
            <Typography variant="h6" gutterBottom>Daily Message Summary</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Configure where and when to send the daily summary of all messages.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><TextField label="Via Email Address(es)" name="email" fullWidth value={form.dailySummary.email} onChange={handleSummaryChange} /></Grid>
              <Grid item xs={12} sm={6}><TextField label="Via Fax Number" name="fax" fullWidth value={form.dailySummary.fax} onChange={handleSummaryChange} /></Grid>
            </Grid>
            <Typography variant="subtitle1" mt={2}>Days to receive summary:</Typography>
            <Box>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <FormControlLabel
                  key={day}
                  control={<Checkbox checked={form.dailySummary.days.includes(day)} onChange={() => handleSummaryDayToggle(day)} />}
                  label={day}
                />
              ))}
            </Box>
            <TextField
              label="Time (can be multiple times daily)"
              name="time"
              fullWidth
              value={form.dailySummary.time}
              onChange={handleSummaryChange}
              sx={{ mt: 1 }}
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* --- Navigation --- */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="contained" color="primary" size="large" onClick={handleContinue}>
              Continue to Office Reach
            </Button>
          </Box>
        </Paper>
      </Container>
      <ClientInfoFooter />
    </Box>
  );
};

export default ClientSetUp;
