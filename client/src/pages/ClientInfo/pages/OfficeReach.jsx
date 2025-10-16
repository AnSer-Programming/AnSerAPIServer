// src/pages/ClientInfo/pages/OfficeReach.jsx

import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Container, 
  Snackbar, 
  Alert, 
  Button,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Fade,
  useTheme,
  CircularProgress,
} from '@mui/material';
import {
  ScheduleOutlined,
  EventOutlined,
  WebOutlined,
  CheckCircleOutlined,
  NavigateNextRounded,
  NavigateBeforeRounded,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import ClientInfoNavbar from '../shared_layout_routing/ClientInfoNavbar';
import ClientInfoFooter from '../shared_layout_routing/ClientInfoFooter';
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';
import { createSharedStyles } from '../utils/sharedStyles';
import OfficeHoursSection from '../sections/OfficeHoursSection';
import WebsiteAccessSection from '../sections/WebsiteAccessSection';
import SpecialEventsSection from '../sections/SpecialEventsSection';

const OfficeReach = () => {
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const theme = useTheme();
  const sharedStyles = createSharedStyles(theme, darkMode);
  const { formData, validateSection, markStepVisited, updateSection } = useWizard();
  const [snack, setSnack] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Keep companyInfo reference to preserve holidays/specialEvents/officeHours/websiteAccess state
  const companyInfo = formData.companyInfo || {};
  const specialEvents = Array.isArray(companyInfo.specialEvents) ? companyInfo.specialEvents : [];
  const plannedTimes = companyInfo.plannedTimes || {};
  const holidays = (typeof plannedTimes.holidays === 'object' && plannedTimes.holidays) || {};
  const showSpecialEvents = !!(
    holidays.otherHolidays ||
    (Array.isArray(holidays.customDates) && holidays.customDates.length) ||
    specialEvents.length
  );

  const setEvents = (events) => updateSection('companyInfo', { specialEvents: events });

  const onNext = async () => {
    setSaving(true);
    markStepVisited('office-reach');
    
    // Simulate save delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const errs = validateSection('officeReach', companyInfo);
    
    // Show validation feedback but don't block navigation
    if (errs) {
      setErrors(errs);
      setSnack(true);
    } else {
      setErrors({});
    }
    
    setSaving(false);
    
    // Always proceed to next step
  history.push('/ClientInfoReact/NewFormWizard/answer-calls');
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const officeHours = companyInfo.officeHours || {};
    const websiteAccess = companyInfo.websiteAccess || {};
    
    const fields = [
      officeHours.monday?.open,
      officeHours.tuesday?.open,
      officeHours.wednesday?.open,
      officeHours.thursday?.open,
      officeHours.friday?.open,
      companyInfo.timeZone,
      websiteAccess.hasWebsite !== undefined,
    ];
    
    const completed = fields.filter(field => field !== undefined && field !== '').length;
    return Math.round((completed / fields.length) * 100);
  };

  const progress = getCompletionPercentage();
  const steps = ['Basic Info', 'What You Need', 'Call Handling', 'Review'];

  const sectionCards = [
    {
      id: 'hours',
      title: 'Office Hours',
      icon: <ScheduleOutlined />,
      description: 'When your office is open and available',
      component: (
        <OfficeHoursSection
          data={companyInfo}
          errors={errors.officeHours || {}}
          lunchErrors={errors.lunch || {}}
        />
      ),
    },
    ...(showSpecialEvents ? [{
      id: 'events',
      title: 'Special Events & Holidays',
      icon: <EventOutlined />,
      description: 'Holidays and special dates to remember',
      component: (
        <SpecialEventsSection
          events={specialEvents}
          onChange={setEvents}
          errors={errors.specialEvents || []}
        />
      ),
    }] : []),
    {
      id: 'website',
      title: 'Website Access',
      icon: <WebOutlined />,
      description: 'Online presence and digital accessibility',
      component: <WebsiteAccessSection errors={errors.websiteAccess || {}} />,
    },
  ];

  return (
    <Box sx={sharedStyles.layout.pageWrapper}>
      <ClientInfoNavbar />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {/* Header Section */}
        <Fade in timeout={600}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 3, md: 4 },
              mb: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
              border: `1px solid ${theme.palette.primary.main}20`,
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.primary.main,
                  mb: 1,
                }}
              >
                What is it that you want from us?
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Outline when you need us available and where expectations change throughout the day.
              </Typography>

              {/* Progress Stepper */}
              <Stepper activeStep={1} alternativeLabel sx={{ mb: 3 }}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontSize: '0.875rem',
                          fontWeight: index === 1 ? 600 : 400,
                        },
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Progress Bar */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
                      },
                    }}
                  />
                </Box>
                <Chip
                  icon={<CheckCircleOutlined />}
                  label={`${progress}% Complete`}
                  color={progress > 70 ? 'success' : progress > 30 ? 'warning' : 'default'}
                  size="small"
                />
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Section Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {sectionCards.map((section, index) => (
            <Grid item xs={12} key={section.id}>
              <Fade in timeout={800 + index * 200}>
                <Card
                  elevation={2}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: theme.shadows[6],
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    {/* Section Header */}
                    <Box
                      sx={{
                        p: 3,
                        pb: 2,
                        background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            color: theme.palette.primary.main,
                            '& svg': { fontSize: 28 },
                          }}
                        >
                          {section.icon}
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 0.5 }}
                          >
                            {section.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {section.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Section Content */}
                    <Box sx={{ p: 3 }}>
                      {section.component}
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* Navigation */}
        <Fade in timeout={1400}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: darkMode ? theme.palette.grey[900] : theme.palette.grey[50],
            }}
          >
            <Button
              variant="outlined"
              startIcon={<NavigateBeforeRounded />}
              onClick={() => history.push('/ClientInfoReact/NewFormWizard/company-info')}
              sx={{ minWidth: 120 }}
            >
              Back
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setSnack(true)}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button
                variant="contained"
                endIcon={saving ? <CircularProgress size={16} /> : <NavigateNextRounded />}
                onClick={onNext}
                disabled={saving}
                sx={{
                  minWidth: 180,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                {saving ? 'Processing...' : 'Next: Call Handling'}
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>

      <ClientInfoFooter />

      <Snackbar
        open={snack}
        autoHideDuration={3000}
        onClose={() => setSnack(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={Object.keys(errors).length ? 'warning' : 'success'}
          sx={{ width: '100%' }}
        >
          {Object.keys(errors).length
            ? 'Some fields need attention — you can continue and fix them later.'
            : 'Draft saved successfully!'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OfficeReach;
