// src/pages/ClientInfo/ClientSetUp.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Checkbox, FormControl, FormControlLabel,
  Grid, InputLabel, MenuItem, Select, TextField, Typography
} from '@mui/material';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import ClientInfoNavbar from './ClientInfoNavbar';
import './ClientInfoReact.css';

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = ['00', '15', '30', '45'];
const ampm = ['AM', 'PM'];

const ClientSetUp = () => {
  const { darkMode } = useClientInfoTheme();

  const [companyList, setCompanyList] = useState([]);
  const [form, setForm] = useState({
    company: '',
    billingAddress: '',
    physicalAddress: '',
    isBillingContact: false,
    isOfficeContact: false,
    officeHours: {
      mon: {}, tue: {}, wed: {}, thu: {}, fri: {}, sat: {}, sun: {}
    },
    services: [],
    notes: '',
  });

  const [availableServices] = useState([
    'Emergency Dispatch',
    'Appointment Scheduling',
    'Overflow Call Handling',
    'After Hours Support'
  ]);

  useEffect(() => {
    axios.get('/api/companies')
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : res.data.companies || [];
        setCompanyList(list);
      })
      .catch(err => {
        console.error('Error fetching company list:', err);
        setCompanyList([]);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (day, key, value) => {
    setForm(prev => ({
      ...prev,
      officeHours: {
        ...prev.officeHours,
        [day]: {
          ...prev.officeHours[day],
          [key]: value
        }
      }
    }));
  };

  const handleCheckboxToggle = (key) => {
    setForm(prev => ({
      ...prev,
      [key]: !prev[key],
      ...(key === 'isBillingContact' ? { isOfficeContact: false } : {}),
      ...(key === 'isOfficeContact' ? { isBillingContact: false } : {})
    }));
  };

  const handleServiceToggle = (service) => {
    setForm(prev => {
      const current = new Set(prev.services);
      current.has(service) ? current.delete(service) : current.add(service);
      return { ...prev, services: Array.from(current) };
    });
  };

  const handleSubmit = () => {
    console.log('Submitted Form:', form);
    // Add backend submission logic here
  };

  return (
    <Box className={`client-info-react-container ${darkMode ? 'dark' : 'light'}`}>
      <ClientInfoNavbar />

      <Typography variant="h4" sx={{ my: 2 }}>Company Information</Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Select Company</InputLabel>
        <Select
          name="company"
          value={form.company}
          label="Select Company"
          onChange={handleInputChange}
        >
          {Array.isArray(companyList) && companyList.map((c, i) => (
            <MenuItem key={i} value={c}>{c}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Physical Address"
        name="physicalAddress"
        fullWidth
        margin="normal"
        value={form.physicalAddress}
        onChange={handleInputChange}
      />
      <TextField
        label="Billing Address"
        name="billingAddress"
        fullWidth
        margin="normal"
        value={form.billingAddress}
        onChange={handleInputChange}
      />

      <Typography variant="h6" mt={4}>Office Hours</Typography>
      {Object.keys(form.officeHours).map(day => (
        <Grid container spacing={1} alignItems="center" key={day} sx={{ mb: 2 }}>
          <Grid item xs={1.5}><Typography>{day.charAt(0).toUpperCase() + day.slice(1)}</Typography></Grid>

          {["startHour", "startMinute", "startAmPm", "endHour", "endMinute", "endAmPm"].map((fieldKey) => (
            <Grid item xs={1.5} key={`${day}-${fieldKey}`}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  {fieldKey.includes('Hour') ? (fieldKey.includes('start') ? 'Start Hour' : 'End Hour') :
                    fieldKey.includes('Minute') ? 'Minute' : 'AM/PM'}
                </InputLabel>
                <Select
                  value={form.officeHours[day][fieldKey] || ''}
                  onChange={(e) => handleTimeChange(day, fieldKey, e.target.value)}
                >
                  {(fieldKey.includes('Hour') ? hours :
                    fieldKey.includes('Minute') ? minutes : ampm).map(opt => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          ))}
        </Grid>
      ))}

      <Box mt={2}>
        <FormControlLabel
          control={<Checkbox checked={form.isOfficeContact} onChange={() => handleCheckboxToggle('isOfficeContact')} />}
          label="Office Contact"
        />
        <FormControlLabel
          control={<Checkbox checked={form.isBillingContact} onChange={() => handleCheckboxToggle('isBillingContact')} />}
          label="Billing Contact"
        />
      </Box>

      <Box mt={2}>
        <Typography variant="h6">Services Offered</Typography>
        {availableServices.map((svc, i) => (
          <FormControlLabel
            key={i}
            control={<Checkbox checked={form.services.includes(svc)} onChange={() => handleServiceToggle(svc)} />}
            label={svc}
          />
        ))}
      </Box>

      <TextField
        label="Business Notes"
        name="notes"
        fullWidth
        multiline
        rows={4}
        margin="normal"
        value={form.notes}
        onChange={handleInputChange}
      />

      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 3 }}>
        Submit & Continue
      </Button>
    </Box>
  );
};

export default ClientSetUp;
