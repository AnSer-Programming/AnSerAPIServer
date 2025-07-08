// src/pages/ClientInfo/FinalDetails.jsx
import React, { useEffect, useState } from 'react';
import {
  Typography, TextField, Box, Button, RadioGroup, FormControlLabel, Radio, Grid, Paper, Container, Divider, Checkbox, FormGroup, FormControl, FormHelperText
} from '@mui/material';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import { useWizard } from './WizardContext';
import { useHistory } from 'react-router-dom';
import ClientInfoNavbar from './ClientInfoNavbar';
import ClientInfoFooter from './ClientInfoFooter';

const FinalDetails = () => {
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const { formData, updateSection } = useWizard();

  const [form, setForm] = useState(() => {
    const defaultState = {
      additionalInfo: '',
      callVolume: '',
      callVolumePeriod: 'Daily',
      howDidYouHear: [],
      howDidYouHearOther: '',
      reasonForChange: '',
      otherLocations: '',
      spamCallers: '',
      marketingPermission: '',
    };
    return { ...defaultState, ...(formData.finalDetails || {}) };
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    updateSection('finalDetails', form);
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setForm(prev => {
        const current = new Set(prev.howDidYouHear);
        if (checked) {
            current.add(name);
        } else {
            current.delete(name);
        }
        return { ...prev, howDidYouHear: Array.from(current) };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.callVolume) newErrors.callVolume = "Anticipated call volume is required.";
    if (form.howDidYouHear.length === 0) newErrors.howDidYouHear = "Please select at least one option.";
    if ((form.howDidYouHear.includes('Referral') || form.howDidYouHear.includes('Other')) && !form.howDidYouHearOther.trim()) {
        newErrors.howDidYouHearOther = "Please provide details for Referral/Other.";
    }
    if (!form.reasonForChange.trim()) newErrors.reasonForChange = "This field is required.";
    if (!form.otherLocations) newErrors.otherLocations = "Please select an option.";
    if (!form.spamCallers) newErrors.spamCallers = "Please select an option.";
    if (!form.marketingPermission) newErrors.marketingPermission = "Please select an option.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      updateSection('finalDetails', form);
      history.push('/ClientInfoReact/NewFormWizard/Review');
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
            Miscellaneous Information
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            A few final questions to complete your account setup.
          </Typography>

          {/* --- Additional Info --- */}
          <Typography variant="h6" gutterBottom>Additional Account Information</Typography>
          <TextField
            label="Please include any other information we need to know about your business and procedures."
            name="additionalInfo"
            value={form.additionalInfo}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
          />

          <Divider sx={{ my: 4 }} />

          {/* --- Call Volume & Marketing --- */}
          <Typography variant="h6" gutterBottom>Call Volume & Marketing</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Anticipated Call Volume"
                    name="callVolume"
                    type="number"
                    value={form.callVolume}
                    onChange={handleChange}
                    error={!!errors.callVolume}
                    helperText={errors.callVolume}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <RadioGroup row name="callVolumePeriod" value={form.callVolumePeriod} onChange={handleChange}>
                    <FormControlLabel value="Daily" control={<Radio />} label="Daily" />
                    <FormControlLabel value="Weekly" control={<Radio />} label="Weekly" />
                    <FormControlLabel value="Monthly" control={<Radio />} label="Monthly" />
                </RadioGroup>
            </Grid>
          </Grid>

          <FormControl component="fieldset" error={!!errors.howDidYouHear} sx={{ mt: 2, width: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>How did you learn about AnSer’s services?</Typography>
            <FormGroup>
                <FormControlLabel control={<Checkbox name="Internet" checked={form.howDidYouHear.includes('Internet')} onChange={handleCheckboxChange} />} label="Internet" />
                <FormControlLabel control={<Checkbox name="Word of Mouth" checked={form.howDidYouHear.includes('Word of Mouth')} onChange={handleCheckboxChange} />} label="Word of Mouth" />
                <FormControlLabel control={<Checkbox name="Was Customer" checked={form.howDidYouHear.includes('Was Customer')} onChange={handleCheckboxChange} />} label="Was Customer" />
                <FormControlLabel control={<Checkbox name="Company uses Services" checked={form.howDidYouHear.includes('Company uses Services')} onChange={handleCheckboxChange} />} label="Company uses Services" />
                <FormControlLabel control={<Checkbox name="Social Media" checked={form.howDidYouHear.includes('Social Media')} onChange={handleCheckboxChange} />} label="Social Media" />
                <FormControlLabel control={<Checkbox name="Referral" checked={form.howDidYouHear.includes('Referral')} onChange={handleCheckboxChange} />} label="Referral" />
                <FormControlLabel control={<Checkbox name="Other" checked={form.howDidYouHear.includes('Other')} onChange={handleCheckboxChange} />} label="Other" />
            </FormGroup>
            {errors.howDidYouHear && <FormHelperText>{errors.howDidYouHear}</FormHelperText>}
            {(form.howDidYouHear.includes('Referral') || form.howDidYouHear.includes('Other')) && (
                <TextField
                    label="Please specify Referral or Other"
                    name="howDidYouHearOther"
                    value={form.howDidYouHearOther}
                    onChange={handleChange}
                    error={!!errors.howDidYouHearOther}
                    helperText={errors.howDidYouHearOther}
                    fullWidth
                    sx={{ mt: 1 }}
                />
            )}
          </FormControl>

          <TextField
            label="What is your reason for making the change to AnSer?"
            name="reasonForChange"
            value={form.reasonForChange}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            required
            sx={{ mt: 2 }}
            error={!!errors.reasonForChange}
            helperText={errors.reasonForChange}
          />

          <Divider sx={{ my: 4 }} />

          {/* --- Final Questions --- */}
          <Typography variant="h6" gutterBottom>Final Questions</Typography>
          <FormControl component="fieldset" error={!!errors.otherLocations} sx={{ width: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>Do you have other locations or divisions not currently using our services?</Typography>
            <RadioGroup row name="otherLocations" value={form.otherLocations} onChange={handleChange}>
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
            {errors.otherLocations && <FormHelperText>{errors.otherLocations}</FormHelperText>}
          </FormControl>
          <FormControl component="fieldset" error={!!errors.spamCallers} sx={{ mt: 2, width: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>Do you receive many robo, spam, or other unwanted callers?</Typography>
            <RadioGroup row name="spamCallers" value={form.spamCallers} onChange={handleChange}>
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
            {errors.spamCallers && <FormHelperText>{errors.spamCallers}</FormHelperText>}
          </FormControl>
          <FormControl component="fieldset" error={!!errors.marketingPermission} sx={{ mt: 2, width: '100%' }}>
            <Typography variant="subtitle1" gutterBottom>Do we have permission to send you info from our marketing department?</Typography>
            <RadioGroup row name="marketingPermission" value={form.marketingPermission} onChange={handleChange}>
                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
            {errors.marketingPermission && <FormHelperText>{errors.marketingPermission}</FormHelperText>}
          </FormControl>

          <Divider sx={{ my: 4 }} />

          {/* --- Navigation --- */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" color="secondary" size="large" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" color="primary" size="large" onClick={handleContinue}>
              Continue to Review
            </Button>
          </Box>
        </Paper>
      </Container>
      <ClientInfoFooter />
    </Box>
  );
};

export default FinalDetails;
