// src/pages/ClientInfo/AnswerCalls.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  RadioGroup,
  Radio,
  Paper,
  Container,
  Divider
} from '@mui/material';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import { useWizard } from './WizardContext';
import { useHistory } from 'react-router-dom';
import ClientInfoNavbar from './ClientInfoNavbar';
import ClientInfoFooter from './ClientInfoFooter';
const AnswerCalls = () => {
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const { formData, updateSection } = useWizard();

  const [form, setForm] = useState(() => {
    const defaultState = {
      useBasicPhrase: false,
      useCustomPhrase: false,
      customPhrase: '',
      useAutoGreeting: false,
      autoGreeting: '',
      useAutoAnswer: '',
      customAutoAnswer: '',
      callTypes: '',
      handleHangUps: '',
      specialInstructions: '',
    };
    return { ...defaultState, ...(formData.AnswerCalls || {}) };
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    updateSection('AnswerCalls', form);
  }, [form]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm(prev => {
      const newForm = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      // Ensure basic and custom phrases are mutually exclusive
      if (name === 'useBasicPhrase' && checked) {
        newForm.useCustomPhrase = false;
      }
      if (name === 'useCustomPhrase' && checked) {
        newForm.useBasicPhrase = false;
      }

      return newForm;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (form.useCustomPhrase && !form.customPhrase.trim()) {
      newErrors.customPhrase = "Custom phrase cannot be empty when this option is selected.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      updateSection('AnswerCalls', form);
      history.push('/ClientInfoReact/NewFormWizard/FinalDetails');
    }
  };

  const handleBack = () => {
    history.goBack();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ClientInfoNavbar />

      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" component="h1" gutterBottom>
            How to Answer Your Calls
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            These settings help us handle calls exactly to your preferences.
          </Typography>

          {/* --- Answering Phrase --- */}
          <Typography variant="h6" gutterBottom>Answering Phrase</Typography>
          <Box>
            <FormControlLabel
              control={<Checkbox checked={form.useBasicPhrase} onChange={handleChange} name="useBasicPhrase" />}
              label={<span>Use Live Agent basic phrase: <i>“Thank you for calling [Business Name]…”</i></span>}
            />
            <FormControlLabel
              control={<Checkbox checked={form.useCustomPhrase} onChange={handleChange} name="useCustomPhrase" />}
              label="Use Live Agent custom phrase"
            />
            {form.useCustomPhrase && (
              <TextField
                fullWidth
                name="customPhrase"
                value={form.customPhrase}
                onChange={handleChange}
                placeholder="Enter your custom greeting here"
                error={!!errors.customPhrase}
                helperText={errors.customPhrase}
                sx={{ mt: 1 }}
              />
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* --- Automated Greetings --- */}
          <Typography variant="h6" gutterBottom>Automated Greetings</Typography>
          <Box>
            <FormControlLabel
              control={<Checkbox checked={form.useAutoGreeting} onChange={handleChange} name="useAutoGreeting" />}
              label="Use Automated Greeting (for call screening or after hours)"
            />
            {form.useAutoGreeting && (
              <TextField
                fullWidth
                name="autoGreeting"
                value={form.autoGreeting}
                onChange={handleChange}
                placeholder="Enter custom automated greeting (optional)"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Use Auto Answer During Very Busy Times?</Typography>
            <RadioGroup row name="useAutoAnswer" value={form.useAutoAnswer} onChange={handleChange}>
              <FormControlLabel value="no" control={<Radio />} label="Do not use Auto Answer" />
              <FormControlLabel value="yes" control={<Radio />} label="Use Auto Answer after 3 rings" />
            </RadioGroup>
            {form.useAutoAnswer === 'yes' && (
              <TextField
                label="Customized Auto Answer (optional)"
                name="customAutoAnswer"
                value={form.customAutoAnswer}
                onChange={handleChange}
                multiline
                rows={3}
                fullWidth
                placeholder="If blank, the standard auto answer will be used."
                sx={{ mt: 1 }}
              />
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* --- Call Handling Rules --- */}
          <Typography variant="h6" gutterBottom>Call Handling Rules</Typography>
          <TextField
            label="List types of calls we will receive and information wanted for each"
            name="callTypes"
            value={form.callTypes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Report hang-ups, spam, etc. on your daily summary?</Typography>
            <RadioGroup row name="handleHangUps" value={form.handleHangUps} onChange={handleChange}>
              <FormControlLabel value="yes" control={<Radio />} label="Yes, make a message for all calls" />
              <FormControlLabel value="no" control={<Radio />} label="No, quickly discard these calls" />
            </RadioGroup>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* --- Special Instructions --- */}
          <Typography variant="h6" gutterBottom>Special Instructions</Typography>
          <TextField
            label="Special instructions (tone, escalation, legal language, etc.)"
            name="specialInstructions"
            value={form.specialInstructions}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />

          <Divider sx={{ my: 4 }} />

          {/* --- Navigation --- */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" color="secondary" size="large" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" color="primary" size="large" onClick={handleContinue}>
              Continue to Final Details
            </Button>
          </Box>
        </Paper>
      </Container>

      <ClientInfoFooter />
    </Box>
  );
};

export default AnswerCalls;
