import React, { useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
  AddCircleOutline,
  ArrowBack,
  ArrowForward,
  CreditCard,
  DeleteOutline,
  EventAvailable,
  FlashOn,
  GroupOutlined,
  Notes,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';

// Navbar handled by WizardLayout
// Footer handled by WizardLayout
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';
import { WIZARD_ROUTES } from '../constants/routes';
import { isValidEmail, getEmailError } from '../utils/emailValidation';

const CARD_BRANDS = ['Visa', 'Mastercard', 'American Express', 'Discover', 'Other'];
const MEETING_PLATFORMS = [
  { value: 'teams', label: 'Microsoft Teams' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'google-meet', label: 'Google Meet' },
  { value: 'other', label: 'Other (specify in notes)' },
];

const defaultContact = (index) => ({
  id: `fast-track-contact-${Date.now()}-${index}`,
  name: '',
  role: '',
  phone: '',
  email: '',
  availability: index === 0 ? 'Primary contact (Week 1 days)' : index === 1 ? 'Evenings / Weekend support' : '',
});

const FastTrack = () => {
  const theme = useTheme();
  const history = useHistory();
  const { darkMode } = useClientInfoTheme();
  const { getSection, updateSection, validateSection, markStepVisited } = useWizard();

  const fastTrack = getSection('fastTrack');
  const payment = fastTrack.payment || {};
  const contacts = Array.isArray(fastTrack.onCallContacts) ? fastTrack.onCallContacts : [];
  const callTypeSlots = Array.isArray(fastTrack.callTypeSlots) ? fastTrack.callTypeSlots : [];
  const meeting = fastTrack.meeting || {};
  const highCallVolumeExpected = Boolean(fastTrack.highCallVolumeExpected);

  const [errors, setErrors] = useState({});
  const [emailErrors, setEmailErrors] = useState({});
  const [snackState, setSnackState] = useState({ open: false, message: '', severity: 'error' });

  const validateEmailAtIndex = (index, email) => {
    const error = getEmailError(email);
    setEmailErrors(prev => {
      if (error) {
        return { ...prev, [index]: error };
      } else {
        const next = { ...prev };
        delete next[index];
        return next;
      }
    });
  };

  const setFastTrack = (patch) => updateSection('fastTrack', patch);

  const handlePaymentChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFastTrack({ payment: { ...payment, [field]: value } });
  };

  const handleContactChange = (index, field) => (event) => {
    const value = event.target.value;
    const nextContacts = contacts.map((contact, idx) =>
      idx === index ? { ...contact, [field]: value } : contact
    );
    setFastTrack({ onCallContacts: nextContacts });
  };

  const addContact = () => {
    const next = contacts.concat([defaultContact(contacts.length)]);
    setFastTrack({ onCallContacts: next });
  };

  const removeContact = (index) => {
    if (contacts.length <= 2) return;
    const next = contacts.filter((_, idx) => idx !== index);
    setFastTrack({ onCallContacts: next });
  };

  const handleSlotChange = (index, field) => (event) => {
    const value = event.target.value;
    const nextSlots = callTypeSlots.map((slot, idx) =>
      idx === index ? { ...slot, [field]: value } : slot
    );
    setFastTrack({ callTypeSlots: nextSlots });
  };

  const handleMeetingChange = (field) => (event) => {
    const value = event.target.value;
    setFastTrack({ meeting: { ...meeting, [field]: value } });
  };

  const handleHighVolumeExpectedChange = (event) => {
    setFastTrack({ highCallVolumeExpected: event.target.checked });
  };

  const toggleFastTrack = (event) => {
    const enabled = event.target.checked;
    setFastTrack({ enabled });
    if (!enabled) {
      setErrors({});
      setSnackState({ open: true, message: 'Fast Track disabled. You can continue with the standard setup.', severity: 'info' });
    }
  };

  const handleSubmit = () => {
    if (!fastTrack.enabled) {
      setSnackState({ open: true, message: 'Enable Fast Track to continue with the expedited launch.', severity: 'warning' });
      return;
    }

    const validation = validateSection('fastTrack', fastTrack);
    if (validation) {
      setErrors(validation);
      setSnackState({ open: true, message: 'Please review the highlighted fields before continuing.', severity: 'error' });
      return;
    }

    setErrors({});
    markStepVisited('fast-track');
    setSnackState({ open: true, message: 'Fast Track details saved. Let’s review everything.', severity: 'success' });
    setTimeout(() => {
      history.push(WIZARD_ROUTES.REVIEW);
    }, 250);
  };

  const contactErrors = errors?.onCallContacts || {};

  const callTypeError = Array.isArray(errors?.callTypeSlots) ? errors.callTypeSlots : [];
  const meetingErrors = errors?.meeting || {};
  const paymentErrors = errors?.payment || {};

  const renderFieldError = (errorValue) => {
    if (!errorValue) return null;
    return (
      <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 0.5 }}>
        {errorValue}
      </Typography>
    );
  };
  const featureFastTrackEnabled = process.env.REACT_APP_FASTTRACK_ENABLED === 'true';

  if (!featureFastTrackEnabled) {
    // Render a small informative placeholder so the component remains present for data integrity,
    // but the full Fast Track UI is hidden unless the feature flag is enabled.
    return (
      <Box sx={{ minHeight: '40vh', p: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Fast Track (disabled)</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Fast Track has been temporarily disabled for this environment. Existing fast-track data is preserved and can be re-enabled via configuration.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" disabled>Fast Track (disabled)</Button>
          </Box>
        </Paper>
      </Box>
    );
  }
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Fast Track — AnSer Communications';
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; created = true; }
    meta.content = 'Provide expedited onboarding details for Fast Track activation with AnSer.';
    if (created) document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      if (created && meta && meta.parentNode) meta.parentNode.removeChild(meta);
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: darkMode ? 'background.default' : '#f4f6fb' }}>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Paper role="region" aria-labelledby="fasttrack-title"
            elevation={0}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              bgcolor: darkMode ? 'background.paper' : '#ffffff',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
              backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Box sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 72,
                height: 72,
              }}>
                <FlashOn fontSize="large" />
              </Box>

              <Box sx={{ flexGrow: 1 }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }}>
                  <Typography id="fasttrack-title" component="h1" variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    Fast Track Launch Checklist
                  </Typography>
                  <Chip label="72 Hour Activation" color="secondary" variant="filled" sx={{ fontWeight: 600 }} />
                </Stack>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  Share billing authorization, primary contacts, rapid call handling instructions, and your kickoff meeting preferences so we can launch within three business days.
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={fastTrack.enabled}
                    onChange={toggleFastTrack}
                    color="primary"
                  />
                }
                label={fastTrack.enabled ? 'Fast Track Enabled' : 'Enable Fast Track'}
              />
            </Stack>
          </Paper>

          {!fastTrack.enabled && (
            <Alert severity="info" variant="outlined">
              Fast Track is currently disabled. You can continue to the standard onboarding flow or enable Fast Track to provide rapid-launch details.
            </Alert>
          )}

          {fastTrack.enabled && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.25)}`,
                bgcolor: darkMode ? alpha(theme.palette.secondary.main, 0.15) : alpha(theme.palette.secondary.main, 0.06),
              }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.secondary.main, 0.18),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: theme.palette.secondary.main,
                  }}
                >
                  <Notes />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Expecting a surge in calls?
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    Let our launch team know if you anticipate unusually high call volume so we can stage extra coverage during the fast-track window.
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={highCallVolumeExpected}
                        onChange={handleHighVolumeExpectedChange}
                        color="secondary"
                      />
                    }
                    label="Yes, prepare for heavier-than-normal call volume while we ramp up."
                  />
                </Box>
              </Stack>
            </Paper>
          )}

          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.primary.main,
              }}>
                <CreditCard />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Payment Authorization</Typography>
                <Typography variant="body2" color="text.secondary">
                  Provide billing confirmation so we can process the $100 rush fee and activate service quickly.
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Cardholder Name"
                  fullWidth
                  value={payment.cardholderName || ''}
                  onChange={handlePaymentChange('cardholderName')}
                  error={Boolean(paymentErrors.cardholderName)}
                  helperText={paymentErrors.cardholderName}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="Card Brand"
                  fullWidth
                  value={payment.cardBrand || ''}
                  onChange={handlePaymentChange('cardBrand')}
                >
                  {CARD_BRANDS.map((brand) => (
                    <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Last 4 Digits"
                  fullWidth
                  value={payment.cardLast4 || ''}
                  onChange={handlePaymentChange('cardLast4')}
                  inputProps={{ maxLength: 4, inputMode: 'numeric', pattern: '[0-9]*' }}
                  error={Boolean(paymentErrors.cardLast4)}
                  helperText={paymentErrors.cardLast4 || 'Numeric only'}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Billing ZIP / Postal"
                  fullWidth
                  value={payment.billingZip || ''}
                  onChange={handlePaymentChange('billingZip')}
                  error={Boolean(paymentErrors.billingZip)}
                  helperText={paymentErrors.billingZip}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Payment Notes (optional)"
                  fullWidth
                  value={payment.notes || ''}
                  onChange={handlePaymentChange('notes')}
                  multiline
                  minRows={2}
                  helperText={paymentErrors.notes}
                  error={Boolean(paymentErrors.notes)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(payment.rushFeeAccepted)}
                      onChange={handlePaymentChange('rushFeeAccepted')}
                      color="primary"
                    />
                  }
                  label="I accept the $100 rush activation fee"
                />
                {renderFieldError(paymentErrors.rushFeeAccepted)}
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={Boolean(payment.authorization)}
                      onChange={handlePaymentChange('authorization')}
                      color="primary"
                    />
                  }
                  label="Authorize AnSer to process the card for the first invoice"
                />
                {renderFieldError(paymentErrors.authorization)}
              </Grid>
            </Grid>
          </Paper>

          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.primary.main,
              }}>
                <GroupOutlined />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Fast Track Contacts</Typography>
                <Typography variant="body2" color="text.secondary">
                  Share the people we should call during your first weeks of coverage. We recommend at least two contacts.
                </Typography>
              </Box>
            </Stack>

            {contactErrors.base && (
              <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
                {contactErrors.base}
              </Alert>
            )}

            <Stack spacing={2}>
              {contacts.map((contact, index) => (
                <Paper
                  key={contact.id || index}
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    position: 'relative',
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Contact {index + 1}
                    </Typography>
                    <Chip
                      size="small"
                      label={contact.availability ? contact.availability : 'Availability not set'}
                      variant="outlined"
                    />
                    {contacts.length > 2 && (
                      <Tooltip title="Remove contact">
                        <IconButton onClick={() => removeContact(index)} size="small" sx={{ ml: 'auto' }}>
                          <DeleteOutline />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Name"
                        fullWidth
                        value={contact.name || ''}
                        onChange={handleContactChange(index, 'name')}
                        error={Boolean(contactErrors.rows?.[index]?.name)}
                        helperText={contactErrors.rows?.[index]?.name}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Role / Title"
                        fullWidth
                        value={contact.role || ''}
                        onChange={handleContactChange(index, 'role')}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        label="Direct Phone"
                        fullWidth
                        value={contact.phone || ''}
                        onChange={handleContactChange(index, 'phone')}
                        error={Boolean(contactErrors.rows?.[index]?.phone)}
                        helperText={contactErrors.rows?.[index]?.phone}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Email"
                        fullWidth
                        type="email"
                        value={contact.email || ''}
                        onChange={(e) => {
                          handleContactChange(index, 'email')(e);
                          if (emailErrors[index] && isValidEmail(e.target.value)) {
                            validateEmailAtIndex(index, e.target.value);
                          }
                        }}
                        onBlur={(e) => validateEmailAtIndex(index, e.target.value)}
                        error={Boolean(emailErrors[index] || contactErrors.rows?.[index]?.email)}
                        helperText={emailErrors[index] || contactErrors.rows?.[index]?.email}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Availability Notes"
                        fullWidth
                        value={contact.availability || ''}
                        onChange={handleContactChange(index, 'availability')}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Stack>

            <Button
              startIcon={<AddCircleOutline />}
              onClick={addContact}
              sx={{ mt: 2 }}
            >
              Add Another Contact
            </Button>
          </Paper>

          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.primary.main,
              }}>
                <Notes />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Rapid Call Handling</Typography>
                <Typography variant="body2" color="text.secondary">
                  Provide high-level instructions so our agents can cover your urgent, routine, backup, and custom call types while the full script is finalized.
                </Typography>
              </Box>
            </Stack>

            <Stack spacing={2}>
              {callTypeSlots.map((slot, index) => (
                <Paper
                  key={slot.id || index}
                  variant="outlined"
                  sx={{ p: 3, borderRadius: 2, borderColor: alpha(theme.palette.primary.main, 0.2) }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {slot.label}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Instructions"
                        fullWidth
                        multiline
                        minRows={2}
                        value={slot.instructions || ''}
                        onChange={handleSlotChange(index, 'instructions')}
                        error={Boolean(callTypeError?.[index]?.instructions)}
                        helperText={callTypeError?.[index]?.instructions}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="After-hours notes (optional)"
                        fullWidth
                        multiline
                        minRows={2}
                        value={slot.afterHoursNotes || ''}
                        onChange={handleSlotChange(index, 'afterHoursNotes')}
                        error={Boolean(callTypeError?.[index]?.afterHoursNotes)}
                        helperText={callTypeError?.[index]?.afterHoursNotes}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.primary.main,
              }}>
                <EventAvailable />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Kickoff Meeting Preference</Typography>
                <Typography variant="body2" color="text.secondary">
                  Let us know the best time to confirm details and ensure your launch stays on track.
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Meeting Platform"
                  fullWidth
                  value={meeting.platform || ''}
                  onChange={handleMeetingChange('platform')}
                  error={Boolean(meetingErrors.platform)}
                  helperText={meetingErrors.platform}
                >
                  {MEETING_PLATFORMS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  type="date"
                  label="Preferred Date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={meeting.date || ''}
                  onChange={handleMeetingChange('date')}
                  error={Boolean(meetingErrors.date)}
                  helperText={meetingErrors.date}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  type="time"
                  label="Preferred Time"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={meeting.time || ''}
                  onChange={handleMeetingChange('time')}
                  error={Boolean(meetingErrors.time)}
                  helperText={meetingErrors.time}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Timezone"
                  fullWidth
                  value={meeting.timezone || ''}
                  onChange={handleMeetingChange('timezone')}
                  helperText={meetingErrors.timezone}
                  error={Boolean(meetingErrors.timezone)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Additional Notes"
                  fullWidth
                  multiline
                  minRows={2}
                  value={meeting.notes || ''}
                  onChange={handleMeetingChange('notes')}
                  helperText={meetingErrors.notes}
                  error={Boolean(meetingErrors.notes)}
                />
              </Grid>
            </Grid>
          </Paper>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => history.push(WIZARD_ROUTES.BASE)}
            >
              Back to start page
            </Button>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="text"
                onClick={() => history.push(WIZARD_ROUTES.COMPANY_INFO)}
              >
                Continue to full setup
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={handleSubmit}
                disabled={!fastTrack.enabled}
              >
                Save Fast Track & Review
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Container>


      <Snackbar
        open={snackState.open}
        autoHideDuration={4000}
        onClose={() => setSnackState((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackState((prev) => ({ ...prev, open: false }))}
          severity={snackState.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackState.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FastTrack;
