// src/pages/ClientInfo/pages/OfficeReach.jsx

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Container, 
  Snackbar, 
  Alert, 
  Button,
  Typography,
  Stack,
  Fade,
  useTheme,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ScheduleOutlined,
  EventOutlined,
  AccessTime,
  WebOutlined,
  NavigateNextRounded,
  NavigateBeforeRounded,
  PhoneInTalk,
  FilterAlt,
  Summarize,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
// Navbar handled by WizardLayout
// Footer handled by WizardLayout
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';
import { createSharedStyles } from '../utils/sharedStyles';
import { WIZARD_ROUTES } from '../constants/routes';
import OfficeHoursSection from '../sections/OfficeHoursSection';
import PlannedServiceTimesSection from '../sections/PlannedServiceTimesSection';
import WebsiteAccessSection from '../sections/WebsiteAccessSection';
import SpecialEventsSection from '../sections/SpecialEventsSection';
import BusinessHoursOverflowSection from '../sections/BusinessHoursOverflowSection';
import CallFilteringSection from '../sections/CallFilteringSection';
import SummaryPreferencesSection from '../sections/SummaryPreferencesSection';

const OfficeReach = () => {
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const theme = useTheme();
  const sharedStyles = createSharedStyles(theme, darkMode);
  const { formData, validateSection, markStepVisited, updateSection } = useWizard();
  const [snack, setSnack] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const sectionHeaderBg = darkMode
    ? alpha(theme.palette.primary.main, 0.12)
    : alpha(theme.palette.primary.main, 0.06);
  const handleSectionToggle = (id) => (_event, isExpanded) => {
    setExpandedSections((prev) => ({ ...prev, [id]: isExpanded }));
  };

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Other Info - AnSer Communications';
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; created = true; }
    meta.content = 'Configure office hours, website access, and special events for your AnSer setup.';
    if (created) document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      if (created && meta && meta.parentNode) meta.parentNode.removeChild(meta);
    };
  }, []);

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

    // Always proceed to next step - new order: go to Final Details
    history.push(WIZARD_ROUTES.FINAL_DETAILS);
  };

  const sectionCards = [
    {
      id: 'hours',
      title: 'Office Hours',
      icon: <ScheduleOutlined />,
      description: 'When your office is open and available',
      component: <OfficeHoursSection />,
    },
    {
      id: 'planned-times',
      title: "Planned Times to Use AnSer's Services",
      icon: <AccessTime />,
      description: 'When you expect to use AnSer outside your standard hours',
      component: <PlannedServiceTimesSection />,
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
      id: 'summary-preferences',
      title: 'Daily Summary & Recap Preferences',
      icon: <Summarize />,
      description: 'Control delivery options and recap schedule preferences',
      component: <SummaryPreferencesSection errors={errors.summaryPreferences || {}} />,
    },
    {
      id: 'website',
      title: 'Website Access',
      icon: <WebOutlined />,
      description: 'Online presence and digital accessibility',
      component: <WebsiteAccessSection errors={errors.websiteAccess || {}} />,
    },
    {
      id: 'overflow',
      title: 'Business Hours Overflow',
      icon: <PhoneInTalk />,
      description: 'What happens when all lines are busy during business hours',
      component: <BusinessHoursOverflowSection errors={errors.businessHoursOverflow || {}} />,
    },
    {
      id: 'filtering',
      title: 'Call Filtering',
      icon: <FilterAlt />,
      description: 'Configure robo-call blocking, greetings, and check-in recordings',
      component: <CallFilteringSection errors={errors.callFiltering || {}} />,
    },
  ];

  return (
    <Box sx={sharedStyles.layout.pageWrapper}>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        <Fade in timeout={600}>
          <Paper
            elevation={2}
            role="region"
            aria-labelledby="other-info-title"
            sx={{
              p: { xs: 2, md: 3 },
              mb: 2,
              background: darkMode
                ? `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}06 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.main}06 0%, ${theme.palette.secondary.main}02 100%)`,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Typography id="other-info-title" component="h1" variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: theme.palette.primary.main }}>
              Other Info
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure office hours, website access, and special events for your AnSer setup.
            </Typography>
          </Paper>
        </Fade>

        {/* Section Cards */}
        <Stack spacing={3} sx={{ mb: 4 }}>
          {sectionCards.map((section, index) => (
            <Fade in timeout={800 + index * 150} key={section.id}>
              <Accordion
                expanded={!!expandedSections[section.id]}
                onChange={handleSectionToggle(section.id)}
                disableGutters
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: 'none',
                  overflow: 'hidden',
                  '&:before': { display: 'none' },
                  '&:hover': {
                    boxShadow: theme.shadows[3],
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    px: { xs: 2, md: 3 },
                    py: 2,
                    bgcolor: sectionHeaderBg,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '& .MuiAccordionSummary-content': {
                      my: 0,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        color: theme.palette.primary.main,
                        '& svg': { fontSize: 24 },
                      }}
                    >
                      {section.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {section.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {section.description}
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ p: { xs: 2, md: 3 } }}>
                  {section.component}
                </AccordionDetails>
              </Accordion>
            </Fade>
          ))}
        </Stack>

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
              onClick={() => history.push(WIZARD_ROUTES.CALL_ROUTING)}
              sx={{ minWidth: 120 }}
            >
              Back
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setSnack(true)}
                disabled={saving}
                aria-label={saving ? 'Saving draft' : 'Save draft'}
                aria-live="polite"
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button
                variant="contained"
                endIcon={saving ? <CircularProgress size={16} /> : <NavigateNextRounded />}
                onClick={onNext}
                disabled={saving}
                aria-label={saving ? 'Processing and continuing to final details' : 'Next: Final Details'}
                aria-busy={saving}
                aria-live="polite"
                sx={{
                  minWidth: 180,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                {saving ? 'Processing...' : 'Next: Final Details'}
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>


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
            ? 'Some fields need attention - you can continue and fix them later.'
            : 'Draft saved successfully!'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OfficeReach;
