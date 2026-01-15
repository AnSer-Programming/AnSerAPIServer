import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Chip,
  Button,
  TextField,
  Grid,
  Container,
  Paper,
  Fade,
  Snackbar,
  Alert,
  MenuItem,
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  CalendarToday,
  CheckCircleOutline,
  VideoCall,
  Phone,
  LocationOn
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
// Navbar handled by WizardLayout
// Footer handled by WizardLayout
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';
import { WIZARD_ROUTES } from '../constants/routes';
import AttachmentsSection from '../sections/AttachmentsSection';
import { isValidEmail, getEmailError } from '../utils/emailValidation';

// Available time slots for selection
const timeSlots = [
  '9:00 AM',
  '10:00 AM', 
  '11:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM'
];

// Helper function to check if date is a weekend
const isWeekend = (date) => {
  const day = new Date(date).getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

// Helper function to get minimum date (tomorrow)
const getMinDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

const meetingTypes = [
  { value: 'video', label: 'Video Call', icon: 'VideoCall', description: 'Microsoft Teams or Zoom' },
  { value: 'phone', label: 'Phone Call', icon: 'Phone', description: 'Traditional phone consultation' },
  { value: 'in-person', label: 'In-Person', icon: 'LocationOn', description: 'Meet at our office' },
];

const FinalDetails = () => {
  const theme = useTheme();
  const { darkMode } = useClientInfoTheme();
  const history = useHistory();
  const { formData, updateSection, validateSection, markStepVisited } = useWizard();
  const [snack, setSnack] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState('');
  const [errors, setErrors] = React.useState({});
  const [attachmentErrors, setAttachmentErrors] = React.useState(null);
  const [emailError, setEmailError] = useState('');

  const showSnackMessage = (message) => {
    setSnackMessage(message);
    setSnack(true);
  };

  const validateEmail = (email) => {
    setEmailError(getEmailError(email));
  };

  const companyInfo = formData.companyInfo || {};
  const consultationMeeting = companyInfo.consultationMeeting || {
    selectedDateTimes: [], // Array of {date, time} objects
    meetingType: 'video',
    notes: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  };
  const attachments = formData.attachments || [];

  const setCompany = (patch) => updateSection('companyInfo', { ...companyInfo, ...patch });
  const setConsultation = (patch) => setCompany({ consultationMeeting: { ...consultationMeeting, ...patch } });
  const setAttachments = (next) => {
    updateSection('attachments', next);
    setAttachmentErrors(null);
  };

  const [currentDate, setCurrentDate] = React.useState('');
  const [currentTime, setCurrentTime] = React.useState('');

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev || prev[field] == null) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    if (isWeekend(selectedDate)) {
      showSnackMessage('Weekends are not available for consultations. Please select a weekday.');
      return;
    }
    setCurrentDate(selectedDate);
    setCurrentTime(''); // Reset time when date changes
    clearError('selectedDateTimes');
  };

  const addDateTimeSlot = () => {
    if (!currentDate || !currentTime) return;
    
    const newSlot = { 
      date: currentDate, 
      time: currentTime,
      id: `${currentDate}-${currentTime}`
    };
    
    // Check if this combination already exists
    const exists = consultationMeeting.selectedDateTimes.some(
      slot => slot.date === currentDate && slot.time === currentTime
    );
    
    if (!exists) {
      const updatedSlots = [...consultationMeeting.selectedDateTimes, newSlot];
      setConsultation({ selectedDateTimes: updatedSlots });
      setCurrentDate('');
      setCurrentTime('');
      clearError('selectedDateTimes');
    }
  };

  const removeDateTimeSlot = (slotId) => {
    const updatedSlots = consultationMeeting.selectedDateTimes.filter(slot => slot.id !== slotId);
    setConsultation({ selectedDateTimes: updatedSlots });
    clearError('selectedDateTimes');
  };

  // Back now goes to Other Info (previous step in the wizard).
  const onBack = () => history.push(WIZARD_ROUTES.OFFICE_REACH);

  const deriveValidationMessage = (validationErrors) => {
    if (!validationErrors) return '';
    if (typeof validationErrors.selectedDateTimes === 'string') return validationErrors.selectedDateTimes;
    if (Array.isArray(validationErrors.selectedDateTimes)) return 'Please review each availability entry for missing details.';
    return (
      validationErrors.contactEmail ||
      validationErrors.contactPhone ||
      validationErrors.meetingType ||
      'Please review the consultation meeting details before continuing.'
    );
  };

  const onSubmit = () => {
    markStepVisited('final-details');
    const validationErrors = validateSection('companyInfo.consultationMeeting', consultationMeeting);
    const attachmentsValidation = validateSection('attachments', attachments);

    if (validationErrors || attachmentsValidation) {
      if (validationErrors) {
        setErrors(validationErrors);
      } else {
        setErrors({});
      }

      if (attachmentsValidation) {
        setAttachmentErrors(attachmentsValidation);
      } else {
        setAttachmentErrors(null);
      }

      const messageParts = [];
      if (validationErrors) {
        messageParts.push(deriveValidationMessage(validationErrors));
      }
      if (attachmentsValidation) {
        messageParts.push('Please review the attachments before continuing.');
      }

      showSnackMessage(messageParts.filter(Boolean).join(' '));
      return;
    }

    setErrors({});
    setAttachmentErrors(null);
    history.push(WIZARD_ROUTES.REVIEW);
  };

  const getIconComponent = (iconName) => {
    switch(iconName) {
      case 'VideoCall': return <VideoCall />;
      case 'Phone': return <Phone />;
      case 'LocationOn': return <LocationOn />;
      default: return <VideoCall />;
    }
  };

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Final details — AnSer Communications';
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; created = true; }
    meta.content = 'Provide your final availability options and attachments to complete the AnSer setup.';
    if (created) document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      if (created && meta && meta.parentNode) meta.parentNode.removeChild(meta);
    };
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: darkMode ? 'background.default' : '#f8fafc' }}>
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Fade in={true} timeout={600}>
          <Paper role="region" aria-labelledby="finaldetails-title"
            elevation={0}
            sx={{ 
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              bgcolor: darkMode ? 'background.paper' : '#ffffff',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            {/* Enhanced Header Section */}
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.15),
                color: theme.palette.primary.main 
              }}>
                <CalendarToday fontSize="large" />
              </Box>
              <Box>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography id="finaldetails-title" component="h1" variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    Your Availability Options
                  </Typography>
                  <Chip 
                    label="Almost done" 
                    color="primary" 
                    size="small" 
                    variant="outlined"
                    icon={<CheckCircleOutline />}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Please provide at least 3 date and time options when you're available to meet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We'll review your preferences and send a confirmation with the selected time shortly after this form is submitted.
                </Typography>
              </Box>
            </Stack>

            {/* Date and Time Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Add Your Available Times
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select a date and time, then click "Add" to include it in your availability list. Minimum 3 options required.
              </Typography>
              
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Date Selection */}
                <Grid item xs={12} md={4}>
                  <TextField
                    type="date"
                    label="Choose Date"
                    value={currentDate}
                    onChange={handleDateChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ 
                      min: getMinDate()
                    }}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>

                {/* Time Selection */}
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    value={currentTime}
                    onChange={(e) => setCurrentTime(e.target.value)}
                    fullWidth
                    label="Choose Time"
                    disabled={!currentDate}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  >
                    {timeSlots.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Add Button */}
                <Grid item xs={12} md={4}>
                  <Button
                    variant="contained"
                    onClick={addDateTimeSlot}
                    disabled={!currentDate || !currentTime}
                    fullWidth
                    sx={{ 
                      height: '56px',
                      borderRadius: 2,
                      bgcolor: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.9)
                      }
                    }}
                  >
                    Add Time Slot
                  </Button>
                </Grid>
              </Grid>

              {/* Selected Times List */}
              {consultationMeeting.selectedDateTimes.length > 0 && (
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  bgcolor: alpha(theme.palette.background.paper, 0.5),
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  mb: 3
                }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Your Available Times
                    </Typography>
                    <Chip 
                      label={`${consultationMeeting.selectedDateTimes.length}/3+ selected`}
                      color={consultationMeeting.selectedDateTimes.length >= 3 ? "success" : "warning"}
                      size="small"
                    />
                  </Stack>
                  
                  <Grid container spacing={2}>
                    {consultationMeeting.selectedDateTimes.map((slot, index) => (
                      <Grid item xs={12} sm={6} md={4} key={slot.id}>
                        <Box sx={{ 
                          p: 2, 
                          borderRadius: 2, 
                          bgcolor: 'background.paper',
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          position: 'relative'
                        }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Option {index + 1}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(slot.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {slot.time}
                          </Typography>
                          {Array.isArray(errors.selectedDateTimes) && errors.selectedDateTimes[index] && (
                            <Typography variant="caption" color="error.main" sx={{ display: 'block', mt: 0.75 }}>
                              {Object.values(errors.selectedDateTimes[index]).join(' • ')}
                            </Typography>
                          )}
                          
                          <Button
                            size="small"
                            color="error"
                            onClick={() => removeDateTimeSlot(slot.id)}
                            sx={{ 
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              minWidth: 'auto',
                              px: 1
                            }}
                          >
                            ×
                          </Button>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  
                  {consultationMeeting.selectedDateTimes.length < 3 && (
                    <Typography variant="body2" color="warning.main" sx={{ mt: 2, textAlign: 'center' }}>
                      Please add {3 - consultationMeeting.selectedDateTimes.length} more time option(s) to meet the minimum requirement
                    </Typography>
                  )}
                  {typeof errors.selectedDateTimes === 'string' && (
                    <Typography variant="body2" color="error.main" sx={{ mt: 2, textAlign: 'center' }}>
                      {errors.selectedDateTimes}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>

            {/* Meeting Type Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Preferred Meeting Type
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  value={consultationMeeting.meetingType}
                  onChange={(e) => {
                    clearError('meetingType');
                    setConsultation({ meetingType: e.target.value });
                  }}
                  row
                >
                  {meetingTypes.map((type) => (
                    <FormControlLabel
                      key={type.value}
                      value={type.value}
                      control={<Radio />}
                      label={
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {getIconComponent(type.icon)}
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {type.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </Stack>
                      }
                      sx={{ 
                        mx: 1,
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                        bgcolor: consultationMeeting.meetingType === type.value 
                          ? alpha(theme.palette.primary.main, 0.05) 
                          : 'transparent',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    />
                  ))}
                </RadioGroup>
                {errors.meetingType && (
                  <Typography variant="caption" color="error.main" sx={{ mt: 1 }}>
                    {errors.meetingType}
                  </Typography>
                )}
              </FormControl>
            </Box>

            {/* Contact Information */}
            <Box sx={{ 
              p: 3, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.background.paper, 0.5),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              mb: 3 
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Contact Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Primary Contact Person"
                    value={consultationMeeting.contactPerson}
                    onChange={(e) => {
                      clearError('contactPerson');
                      setConsultation({ contactPerson: e.target.value });
                    }}
                    fullWidth
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    type="email"
                    value={consultationMeeting.contactEmail}
                    onChange={(e) => {
                      clearError('contactEmail');
                      setConsultation({ contactEmail: e.target.value });
                      // Clear error as user types if they've fixed it
                      if (emailError && isValidEmail(e.target.value)) {
                        setEmailError('');
                      }
                    }}
                    onBlur={(e) => validateEmail(e.target.value)}
                    fullWidth
                    error={Boolean(emailError || errors.contactEmail)}
                    helperText={emailError || errors.contactEmail || ''}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    value={consultationMeeting.contactPhone}
                    onChange={(e) => {
                      clearError('contactPhone');
                      setConsultation({ contactPhone: e.target.value });
                    }}
                    fullWidth
                    error={Boolean(errors.contactPhone)}
                    helperText={errors.contactPhone || ''}
                    sx={{ 
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <TextField
                label="Notes or Special Requests"
                value={consultationMeeting.notes}
                onChange={(e) => {
                  clearError('notes');
                  setConsultation({ notes: e.target.value });
                }}
                fullWidth 
                multiline 
                minRows={3}
                placeholder="Any specific topics you'd like to discuss, special requirements, or questions you have..."
                sx={{ 
                  mt: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Box>

            {/* Attachments */}
            <Box sx={{ mb: 4 }}>
              <AttachmentsSection
                attachments={attachments}
                onChange={setAttachments}
                errors={attachmentErrors}
              />
            </Box>

            {/* Navigation Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              pt: 2,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}>
              <Button 
                variant="outlined" 
                onClick={onBack}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1
                }}
              >
                Back to Other Info
              </Button>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="outlined" 
                  color="success"
                  onClick={() => showSnackMessage('Progress saved!')}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1
                  }}
                >
                  Save Progress
                </Button>
                <Button 
                  variant="contained" 
                  color="success"
                  onClick={onSubmit}
                  aria-label="Complete setup"
                  aria-live="polite"
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${alpha(theme.palette.success.main, 0.8)})`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.9)}, ${alpha(theme.palette.success.main, 0.7)})`,
                    }
                  }}
                >
                  Complete Setup →
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Fade>
      </Container>
      <Snackbar open={snack} autoHideDuration={4000} onClose={() => setSnack(false)}>
        <Alert severity="warning" sx={{ width: '100%' }}>
          {snackMessage || 'Please complete the required fields.'}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FinalDetails;
