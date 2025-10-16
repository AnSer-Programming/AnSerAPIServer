// src/pages/ClientInfo/pages/ClientSetUp.jsx

import React from 'react';
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
  BusinessOutlined,
  PeopleOutlined,
  ContactPhoneOutlined,
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

import PrimaryContactsSection from '../sections/PrimaryContactsSection';
import CompanyBasicsSection from '../sections/CompanyBasicsSection';
import OfficePersonnelSection from '../sections/OfficePersonnelSection';

const ClientSetUp = () => {
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const theme = useTheme();
  const sharedStyles = createSharedStyles(theme, darkMode);
  const { formData, updateSection, validateSection, markStepVisited } = useWizard();

  const ci = formData.companyInfo || {};

  const mirrorFields = {
    physicalLocation: 'mailingAddress',
    physicalCity: 'mailingCity',
    physicalState: 'mailingState',
    physicalPostalCode: 'mailingPostalCode',
    suiteOrUnit: 'mailingSuite',
  };

  const data = {
    businessName: ci.businessName ?? ci.company ?? '',
    company: ci.company ?? ci.businessName ?? '',
    physicalLocation: ci.physicalLocation ?? '',
    suiteOrUnit: ci.suiteOrUnit ?? '',
    physicalCity: ci.physicalCity ?? '',
    physicalState: ci.physicalState ?? '',
    physicalPostalCode: ci.physicalPostalCode ?? '',
    mailingAddress: ci.mailingAddress ?? '',
    mailingSuite: ci.mailingSuite ?? '',
    mailingCity: ci.mailingCity ?? '',
    mailingState: ci.mailingState ?? '',
    mailingPostalCode: ci.mailingPostalCode ?? '',
    mailingSameAsPhysical: ci.mailingSameAsPhysical ?? false,
    additionalLocations: Array.isArray(ci.additionalLocations) ? ci.additionalLocations : [],
    contactNumbers: {
      primaryOfficeLine: ci.contactNumbers?.primaryOfficeLine ?? '',
      tollFree: ci.contactNumbers?.tollFree ?? '',
      secondaryLine: ci.contactNumbers?.secondaryLine ?? '',
      fax: ci.contactNumbers?.fax ?? '',
      officeEmail: ci.contactNumbers?.officeEmail ?? '',
      website: ci.contactNumbers?.website ?? '',
    },
    contactChannels: Array.isArray(ci.contactChannels) ? ci.contactChannels : [],
    primaryContact: {
      name: ci.primaryContact?.name ?? '',
      title: ci.primaryContact?.title ?? '',
      phone: ci.primaryContact?.phone ?? '',
      email: ci.primaryContact?.email ?? '',
    },
    billingContact: {
      name: ci.billingContact?.name ?? '',
      email: ci.billingContact?.email ?? '',
      phone: ci.billingContact?.phone ?? '',
      title: ci.billingContact?.title ?? '',
      purchaseOrder: ci.billingContact?.purchaseOrder ?? '',
      notes: ci.billingContact?.notes ?? '',
    },
    billingSameAsPrimary: ci.billingSameAsPrimary ?? false,
    timeZone: ci.timeZone ?? '',
  };

  const [errors, setErrors] = React.useState({});
  const [snack, setSnack] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const merge = (patch) => updateSection('companyInfo', patch);

  const setBasics = (patch) => {
    const shouldMirror = ci.mailingSameAsPhysical ?? data.mailingSameAsPhysical;
    const nextPatch = { ...patch };

    if (shouldMirror) {
      Object.entries(mirrorFields).forEach(([source, target]) => {
        if (Object.prototype.hasOwnProperty.call(patch, source)) {
          nextPatch[target] = patch[source];
        }
      });
    }

    merge(nextPatch);
  };

  const handleMailingSameAsPhysicalChange = (checked) => {
    if (checked) {
      merge({
        mailingSameAsPhysical: true,
        mailingAddress: data.physicalLocation || '',
        mailingSuite: data.suiteOrUnit || '',
        mailingCity: data.physicalCity || '',
        mailingState: data.physicalState || '',
        mailingPostalCode: data.physicalPostalCode || '',
      });
      return;
    }

    merge({ mailingSameAsPhysical: false });
  };

  const handleAdditionalLocationsChange = (list) => {
    merge({ additionalLocations: list });
  };

  const handleSave = async () => {
    setSaving(true);
    markStepVisited('company-info');
    
    // Simulate save delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // validate with the most up-to-date data shape
    const errs = validateSection('companyInfo', { ...formData.companyInfo, ...data });
    
    // Show validation feedback but don't block navigation
    if (errs) {
      setErrors(errs);
      setSnack(true);
    } else {
      setErrors({});
    }
    
    setSaving(false);
    
    // Always proceed to next step
    history.push('/ClientInfoReact/NewFormWizard/office-reach');
  };

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const checks = [
      Boolean(data.businessName && data.businessName.trim()),
      Boolean(data.physicalLocation && data.physicalLocation.trim()),
      Boolean(data.physicalCity && data.physicalCity.trim()),
      Boolean(data.primaryContact.name && data.primaryContact.name.trim()),
      Boolean(data.primaryContact.phone && data.primaryContact.phone.trim()),
      data.billingSameAsPrimary
        ? true
        : Boolean(data.billingContact.email && data.billingContact.email.trim()),
      Array.isArray(data.contactChannels)
        ? data.contactChannels.some((channel) => channel && channel.value && channel.value.trim())
        : false,
    ];

    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  };

  const progress = getCompletionPercentage();

  const steps = ['Basic Info', 'What You Need', 'Call Handling', 'Review'];

  const sectionCards = [
    {
      id: 'contacts',
      title: 'Primary & Billing Contacts',
      icon: <ContactPhoneOutlined />,
      description: 'Who we reach for day-to-day decisions and invoices',
      component: (
        <PrimaryContactsSection
          primary={data.primaryContact}
          billing={data.billingContact}
          sameAs={data.billingSameAsPrimary}
          onChange={merge}
          errors={errors}
        />
      ),
    },
    {
      id: 'personnel',
      title: 'Additional Contacts',
      icon: <PeopleOutlined />,
      description: 'Add teammates we might need to loop in',
      component: <OfficePersonnelSection errors={errors} />,
    },
    {
      id: 'basics',
      title: 'Company Details',
      icon: <BusinessOutlined />,
      description: 'Business information and addresses callers reference',
      component: (
        <CompanyBasicsSection
          data={data}
          onChange={setBasics}
          errors={errors}
          mailingSameAsPhysical={data.mailingSameAsPhysical}
          onMailingSameAsPhysicalChange={handleMailingSameAsPhysicalChange}
          onAdditionalLocationsChange={handleAdditionalLocationsChange}
        />
      ),
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
                Basic Info
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Let’s start with the basics we need.
              </Typography>

              {/* Progress Stepper */}
              <Stepper activeStep={0} alternativeLabel sx={{ mb: 3 }}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label': {
                          fontSize: '0.875rem',
                          fontWeight: index === 0 ? 600 : 400,
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
              onClick={() => history.push('/ClientInfoReact')}
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
                onClick={handleSave}
                disabled={saving}
                sx={{
                  minWidth: 160,
                  py: 1.5,
                  fontWeight: 600,
                }}
              >
                {saving ? 'Processing...' : 'Save & Continue'}
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

export default ClientSetUp;
