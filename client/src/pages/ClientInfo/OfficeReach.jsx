// src/pages/ClientInfo/OfficeReach.jsx
import React, { useEffect, useState } from 'react';
import { Typography, TextField, Box, Button } from '@mui/material';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import { useWizard } from './WizardContext';
import { useHistory } from 'react-router-dom';
import ClientInfoNavbar from './ClientInfoNavbar';
import ClientInfoFooter from './ClientInfoFooter';
import Breadcrumb from './Breadcrumb';
import './ClientInfoReact.css';

const OfficeReach = () => {
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const { formData, updateSection } = useWizard();

  const [form, setForm] = useState(() =>
    formData.officeReach || {
      regularHours: '',
      noAlertTimes: '',
      holidayRules: ''
    }
  );

  useEffect(() => {
    updateSection('officeReach', form);
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContinue = () => {
    updateSection('officeReach', form);
    history.push('/ClientInfoReact/NewFormWizard/AnswerCalls');
  };

  return (
    <div className={`client-info-react-container d-flex flex-column min-vh-100 ${darkMode ? 'dark' : 'light'}`}>
      <ClientInfoNavbar />

      <div className="container flex-grow-1 mt-4 mb-5">
        <Breadcrumb />

        <div className="pageTitle mb-4">
          <Typography variant="h4">Office Reach Information</Typography>
          <Typography variant="body1" className="text-muted mt-2">
            The questions below help define where and how a message gets delivered depending on the day and time.
            This is useful when determining availability and routing needs.
          </Typography>
        </div>

        <Box className="card p-4">
          <TextField
            label="What are your regular office hours?"
            name="regularHours"
            value={form.regularHours}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            margin="normal"
            placeholder="e.g., Mon–Fri 9am–5pm"
          />

          <TextField
            label="Are there times when calls should go directly to voicemail or skip alerting staff?"
            name="noAlertTimes"
            value={form.noAlertTimes}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            margin="normal"
            placeholder="e.g., after 10pm on weekdays, all day Sunday"
          />

          <TextField
            label="Holiday or exception rules?"
            name="holidayRules"
            value={form.holidayRules}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            margin="normal"
            placeholder="e.g., Do not alert staff on major holidays unless emergency"
          />

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleContinue}>
              Continue to Call Answering
            </Button>
          </Box>
        </Box>
      </div>

      <ClientInfoFooter />
    </div>
  );
};

export default OfficeReach;
