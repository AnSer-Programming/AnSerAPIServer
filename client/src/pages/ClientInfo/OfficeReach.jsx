// src/pages/ClientInfo/OfficeReach.jsx
import React, { useEffect, useState } from 'react';
import {
  Typography, TextField, Box, Button, RadioGroup, FormControlLabel, Radio, Grid, Paper, Container, Divider
} from '@mui/material';
import { useClientInfoTheme } from './ClientInfoThemeContext';
import { useWizard } from './WizardContext';
import { useHistory } from 'react-router-dom';
import ClientInfoNavbar from './ClientInfoNavbar';
import ClientInfoFooter from './ClientInfoFooter';
import PhoneMaskInput from './PhoneMaskInput';
const OfficeReach = () => {
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const { formData, updateSection } = useWizard();

  const [form, setForm] = useState(() => {
    const defaultState = {
      onCallDepartments: '',
      notificationMethod: '',
      onCallRotation: '',
      onCallRotationOther: '',
      onCallChangeTime: '',
      onCallChangeDay: '',
      whenToContact: '',
      whenToContactDefine: '',
      onCallProcedures: '',
      businessHoursProcedures: '',
      onCallTeam: [{ name: '', title: '', email: '', cell: '', home: '', other: '' }],
    };
    return { ...defaultState, ...(formData.officeReach || {}) };
  });

  useEffect(() => {
    updateSection('officeReach', form);
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleOnCallTeamChange = (index, e) => {
    const { name, value } = e.target;
    const list = [...form.onCallTeam];
    list[index][name] = value;
    setForm(prev => ({ ...prev, onCallTeam: list }));
  };

  const addOnCallMember = () => {
    setForm(prev => ({ ...prev, onCallTeam: [...prev.onCallTeam, { name: '', title: '', email: '', cell: '', home: '', other: '' }] }));
  };

  const removeOnCallMember = (index) => {
    const list = [...form.onCallTeam];
    list.splice(index, 1);
    setForm(prev => ({ ...prev, onCallTeam: list }));
  };

  const handleContinue = () => {
    updateSection('officeReach', form);
    history.push('/ClientInfoReact/NewFormWizard/AnswerCalls');
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
            Office Reach & On-Call Information
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please provide details about your on-call teams and procedures.
          </Typography>

          {/* --- On-Call Setup --- */}
          <Typography variant="h6" gutterBottom>On-Call Setup</Typography>
          <TextField
            label="On-Call Departments (If more than one, please list all)"
            name="onCallDepartments"
            value={form.onCallDepartments}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1" gutterBottom>How will you notify us of on-call changes?</Typography>
          <RadioGroup row name="notificationMethod" value={form.notificationMethod} onChange={handleChange}>
            <FormControlLabel value="portal" control={<Radio />} label="Web Portal" />
            <FormControlLabel value="email" control={<Radio />} label="Email to super@anser.com" />
            <FormControlLabel value="phone" control={<Radio />} label="Phone Call to Supervisor" />
          </RadioGroup>

          <Divider sx={{ my: 4 }} />

          {/* --- On-Call Rotation --- */}
          <Typography variant="h6" gutterBottom>On-Call Rotation</Typography>
          <Typography variant="subtitle1" gutterBottom>Rotation Schedule</Typography>
          <RadioGroup row name="onCallRotation" value={form.onCallRotation} onChange={handleChange}>
            <FormControlLabel value="no_change" control={<Radio />} label="On-Call does not change" />
            <FormControlLabel value="daily" control={<Radio />} label="Daily" />
            <FormControlLabel value="weekly" control={<Radio />} label="Weekly" />
            <FormControlLabel value="monthly" control={<Radio />} label="Monthly" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
          {form.onCallRotation === 'other' && (
            <TextField label="Please explain 'Other'" name="onCallRotationOther" value={form.onCallRotationOther} onChange={handleChange} fullWidth sx={{ mt: 1 }} />
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}><TextField label="On-Call change begins at (Time)" name="onCallChangeTime" value={form.onCallChangeTime} onChange={handleChange} fullWidth /></Grid>
            <Grid item xs={12} sm={6}><TextField label="Day of Week or Date of Month" name="onCallChangeDay" value={form.onCallChangeDay} onChange={handleChange} fullWidth /></Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* --- Contact Procedures --- */}
          <Typography variant="h6" gutterBottom>Contact Procedures</Typography>
          <Typography variant="subtitle1" gutterBottom>When should AnSer contact your On-Call staff?</Typography>
          <RadioGroup row name="whenToContact" value={form.whenToContact} onChange={handleChange}>
            <FormControlLabel value="all_calls" control={<Radio />} label="All calls" />
            <FormControlLabel value="caller_says_wait" control={<Radio />} label="Caller says it cannot wait" />
            <FormControlLabel value="hold_all" control={<Radio />} label="Hold all calls" />
            <FormControlLabel value="emergency_only" control={<Radio />} label="Emergency Only" />
            <FormControlLabel value="specific_types" control={<Radio />} label="Specific Call Types" />
          </RadioGroup>
          {(form.whenToContact === 'emergency_only' || form.whenToContact === 'specific_types') && (
            <TextField label="Please define what constitutes an emergency or the specific call types" name="whenToContactDefine" value={form.whenToContactDefine} onChange={handleChange} multiline rows={3} fullWidth sx={{ mt: 1 }} />
          )}

          <TextField
            label="On-Call Procedures (Outline notification order and escalation)"
            name="onCallProcedures"
            value={form.onCallProcedures}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            sx={{ mt: 2 }}
          />

          <TextField
            label="Notification Procedures for Business Hours (if different from above)"
            name="businessHoursProcedures"
            value={form.businessHoursProcedures}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            sx={{ mt: 2 }}
          />

          <Divider sx={{ my: 4 }} />

          {/* --- On-Call Team --- */}
          <Box>
            <Typography variant="h6" gutterBottom>On-Call Team</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              List the members of the on-call team.
            </Typography>
            {form.onCallTeam.map((p, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><TextField label="Name" name="name" fullWidth size="small" value={p.name} onChange={e => handleOnCallTeamChange(index, e)} /></Grid>
                  <Grid item xs={12} sm={6}><TextField label="Title" name="title" fullWidth size="small" value={p.title} onChange={e => handleOnCallTeamChange(index, e)} /></Grid>
                  <Grid item xs={12}><TextField label="Email" name="email" fullWidth size="small" value={p.email} onChange={e => handleOnCallTeamChange(index, e)} /></Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Cell Phone"
                      name="cell"
                      fullWidth
                      size="small"
                      value={p.cell}
                      onChange={e => handleOnCallTeamChange(index, e)}
                      InputProps={{ inputComponent: PhoneMaskInput }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="Home Phone"
                      name="home"
                      fullWidth
                      size="small"
                      value={p.home}
                      onChange={e => handleOnCallTeamChange(index, e)}
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
                      onChange={e => handleOnCallTeamChange(index, e)}
                      InputProps={{ inputComponent: PhoneMaskInput }}
                    />
                  </Grid>
                </Grid>
                {form.onCallTeam.length > 1 && (
                  <Button variant="outlined" color="error" onClick={() => removeOnCallMember(index)} sx={{ mt: 2 }} size="small">
                    Remove Team Member
                  </Button>
                )}
              </Paper>
            ))}
            <Button variant="contained" onClick={addOnCallMember} sx={{ mt: 1 }}>
              Add Team Member
            </Button>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* --- Navigation --- */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" color="secondary" size="large" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" color="primary" size="large" onClick={handleContinue}>
              Continue to Call Answering
            </Button>
          </Box>
        </Paper>
      </Container>
      <ClientInfoFooter />
    </Box>
  );
};

export default OfficeReach;
