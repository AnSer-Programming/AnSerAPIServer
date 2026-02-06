// src/pages/ClientInfo/pages/ClientSetUp.jsx

import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Container,
  Snackbar,
  Alert,
  Button,
  Typography,
  Grid,
  Fade,
  useTheme,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  BusinessOutlined,
  PeopleOutlined,
  ContactPhoneOutlined,
  NavigateNextRounded,
  NavigateBeforeRounded,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { WIZARD_ROUTES } from '../constants/routes';

// Navbar handled by WizardLayout
// Footer handled by WizardLayout
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

  const billingMirrorFields = {
    physicalLocation: 'billingAddress',
    physicalCity: 'billingCity',
    physicalState: 'billingState',
    physicalPostalCode: 'billingPostalCode',
    suiteOrUnit: 'billingSuite',
  };

  const data = {
    businessName: ci.businessName ?? ci.company ?? '',
    company: ci.company ?? ci.businessName ?? '',
    physicalLocation: ci.physicalLocation ?? '',
    suiteOrUnit: ci.suiteOrUnit ?? '',
    physicalCity: ci.physicalCity ?? '',
    physicalState: ci.physicalState ?? '',
    physicalPostalCode: ci.physicalPostalCode ?? '',
    billingAddress: ci.billingAddress ?? '',
    billingSuite: ci.billingSuite ?? '',
    billingCity: ci.billingCity ?? '',
    billingState: ci.billingState ?? '',
    billingPostalCode: ci.billingPostalCode ?? '',
    billingSameAsPhysical: ci.billingSameAsPhysical ?? false,
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

  const ALLOWED_ERROR_KEYS = new Set([
    'businessName',
    'company',
    'physicalLocation',
    'suiteOrUnit',
    'physicalCity',
    'physicalState',
    'physicalPostalCode',
    'billingAddress',
    'billingSuite',
    'billingCity',
    'billingState',
    'billingPostalCode',
    'billingSameAsPhysical',
    'additionalLocations',
    'contactNumbers',
    'contactChannels',
    'primaryContact',
    'billingContact',
    'officePersonnel',
    'timeZone',
  ]);

  const ALLOWED_NESTED_KEYS = {
    primaryContact: new Set(['name', 'title', 'phone', 'email']),
    billingContact: new Set(['name', 'title', 'phone', 'email', 'purchaseOrder', 'notes']),
    contactNumbers: new Set(['primaryOfficeLine', 'tollFree', 'secondaryLine', 'fax', 'officeEmail', 'website']),
  };

  const filterCompanySetupErrors = (errs) => {
    if (!errs || typeof errs !== 'object') return errs;
    const filtered = {};

    Object.entries(errs).forEach(([key, value]) => {
      if (!ALLOWED_ERROR_KEYS.has(key)) return;

      const allowedNested = ALLOWED_NESTED_KEYS[key];
      if (allowedNested && value && typeof value === 'object' && !Array.isArray(value)) {
        const nested = Object.fromEntries(
          Object.entries(value).filter(([nestedKey]) => allowedNested.has(nestedKey))
        );
        if (Object.keys(nested).length > 0) {
          filtered[key] = nested;
        }
        return;
      }

      filtered[key] = value;
    });

    return Object.keys(filtered).length ? filtered : null;
  };

  const FIELD_LABELS = {
    businessName: 'Business Name',
    company: 'Business Name',
    physicalLocation: 'Physical Address',
    physicalCity: 'Physical City',
    physicalState: 'Physical State',
    physicalPostalCode: 'Physical Postal Code',
    'primaryContact.name': 'Primary Contact Name',
    'primaryContact.phone': 'Primary Contact Phone',
    'primaryContact.email': 'Primary Contact Email',
    'billingContact.name': 'Billing Contact Name',
    'billingContact.email': 'Billing Contact Email',
    'contactNumbers.primaryOfficeLine': 'Primary Office Line',
    contactChannels: 'Public Contact Channels',
    additionalLocations: 'Additional Locations',
  };

  const normalizeErrorPath = (path) => path.replace(/\.\d+/g, '').replace(/\[\d+\]/g, '');

  const collectErrorPaths = (value, prefix = '') => {
    if (!value) return [];
    if (typeof value === 'string') return [prefix];
    if (Array.isArray(value)) {
      return value.flatMap((item, index) =>
        collectErrorPaths(item, prefix ? `${prefix}.${index}` : `${index}`)
      );
    }
    if (typeof value === 'object') {
      return Object.entries(value).flatMap(([key, child]) =>
        collectErrorPaths(child, prefix ? `${prefix}.${key}` : key)
      );
    }
    return [prefix];
  };

  const getMissingFields = (errs = {}) => {
    const paths = collectErrorPaths(errs).filter(Boolean);
    const labels = paths.map((path) => {
      const normalized = normalizeErrorPath(path);
      if (normalized.startsWith('contactChannels')) return FIELD_LABELS.contactChannels;
      if (normalized.startsWith('additionalLocations')) return FIELD_LABELS.additionalLocations;
      return FIELD_LABELS[normalized] || FIELD_LABELS[path] || normalized;
    });
    return Array.from(new Set(labels)).filter(Boolean);
  };

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Client setup — AnSer Communications';
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; created = true; }
    meta.content = 'Provide company basics, contacts, and addresses to begin setup with AnSer.';
    if (created) document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      if (created && meta && meta.parentNode) meta.parentNode.removeChild(meta);
    };
  }, []);

  // Move focus to the main heading on mount for better keyboard/a11y
  useEffect(() => {
    const el = document.getElementById('clientsetup-title');
    if (el && typeof el.focus === 'function') el.focus();
  }, []);

  const merge = (patch) => updateSection('companyInfo', patch);

  const setBasics = (patch) => {
    const shouldMirrorBilling = ci.billingSameAsPhysical ?? data.billingSameAsPhysical;
    const nextPatch = { ...patch };

    if (shouldMirrorBilling) {
      Object.entries(billingMirrorFields).forEach(([source, target]) => {
        if (Object.prototype.hasOwnProperty.call(patch, source)) {
          nextPatch[target] = patch[source];
        }
      });
    }

    merge(nextPatch);
  };

  const handleBillingSameAsPhysicalChange = (checked) => {
    if (checked) {
      merge({
        billingSameAsPhysical: true,
        billingAddress: data.physicalLocation || '',
        billingSuite: data.suiteOrUnit || '',
        billingCity: data.physicalCity || '',
        billingState: data.physicalState || '',
        billingPostalCode: data.physicalPostalCode || '',
      });
      return;
    }

    merge({ billingSameAsPhysical: false });
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
    const rawErrors = validateSection('companyInfo', { ...formData.companyInfo, ...data });
    const errs = filterCompanySetupErrors(rawErrors);

    setSaving(false);

    // Block navigation if required fields are missing
    if (errs) {
      setErrors(errs);
      setSnack(true);
      return; // Don't proceed if there are validation errors
    }

    setErrors({});
    // Only proceed to next step if validation passes
    history.push(WIZARD_ROUTES.ANSWER_CALLS);
  };

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
          billingSameAsPhysical={data.billingSameAsPhysical}
          onBillingSameAsPhysicalChange={handleBillingSameAsPhysicalChange}
          onAdditionalLocationsChange={handleAdditionalLocationsChange}
        />
      ),
    },
  ];

  return (
    <Box sx={sharedStyles.layout.pageWrapper}>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {/* Section Accordions */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {sectionCards.map((section, index) => (
            <Grid item xs={12} key={section.id}>
              <Fade in timeout={800 + index * 200}>
                <Accordion
                  defaultExpanded={false}
                  elevation={2}
                  sx={{
                    bgcolor: theme.palette.background.paper,
                    '&:before': { display: 'none' },
                    '& .MuiAccordion-root': { boxShadow: 'none' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${section.id}-content`}
                    id={`${section.id}-header`}
                    sx={{
                      p: 2,
                      background: darkMode
                        ? theme.palette.background.paper
                        : `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      '& .MuiAccordionSummary-expandIconWrapper': {
                        color: theme.palette.text.secondary,
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Box sx={{ color: darkMode ? theme.palette.info.main : theme.palette.primary.main, '& svg': { fontSize: 28 } }}>
                        {section.icon}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: theme.palette.text.primary }}>
                          {section.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {section.description}
                        </Typography>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 3 }}>
                    {section.component}
                  </AccordionDetails>
                </Accordion>
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
              onClick={() => history.push(WIZARD_ROUTES.BASE)}
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
                onClick={handleSave}
                disabled={saving}
                aria-label={saving ? 'Processing and continuing' : 'Save & Continue'}
                aria-busy={saving}
                aria-live="polite"
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

      {/* SEO meta handled in component useEffect */}


      <Snackbar
        open={snack}
        autoHideDuration={6000}
        onClose={() => setSnack(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={Object.keys(errors).length ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {Object.keys(errors).length ? (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Please complete all required fields before continuing.
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {getMissingFields(errors).map((label) => (
                  <li key={label}>
                    <Typography variant="body2">{label}</Typography>
                  </li>
                ))}
              </Box>
            </Box>
          ) : (
            'Draft saved successfully!'
          )}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientSetUp;
