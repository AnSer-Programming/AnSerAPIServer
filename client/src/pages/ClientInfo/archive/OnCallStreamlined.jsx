import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Container,
  Button,
  Typography,
  TextField,
  Grid,
  Stack,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  NavigateNext,
  NavigateBefore,
  ArrowForward,
  ArrowBack,
  CheckCircle,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';
import { createSharedStyles } from '../utils/sharedStyles';
import { WIZARD_ROUTES } from '../constants/routes';

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const CONTACT_METHODS = [
  'Cell Phone',
  'Home Phone',
  'Office Extension',
  'Email',
  'Text/SMS',
  'Pager',
  'Auto-Email System',
  'Hold Until Morning',
];

const ESCALATION_TRIGGERS = [
  'No answer after X attempts',
  'After X minutes',
  'Specific time of day',
  'Specific call types only',
  'Caller requests escalation',
  'On-call unavailable',
];

const OnCallStreamlined = () => {
  const theme = useTheme();
  const { darkMode } = useClientInfoTheme();
  const sharedStyles = createSharedStyles(theme, darkMode);
  const history = useHistory();
  const { getSection, updateSection, markStepVisited } = useWizard();

  // Get or initialize section
  const section = getSection('onCallStreamlined') || {
    teamMembers: [],
    currentPhase: 'define',
    currentConfigureIndex: 0,
  };

  const [currentPhase, setCurrentPhase] = useState(section.currentPhase || 'define');
  const [teamMembers, setTeamMembers] = useState(section.teamMembers || []);
  const [currentConfigureIndex, setCurrentConfigureIndex] = useState(section.currentConfigureIndex || 0);

  // Sync to context on changes
  useEffect(() => {
    updateSection('onCallStreamlined', {
      teamMembers,
      currentPhase,
      currentConfigureIndex,
    });
  }, [teamMembers, currentPhase, currentConfigureIndex]);

  useEffect(() => {
    const prev = document.title;
    document.title = 'On-Call Streamlined Setup — AnSer Communications';
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; created = true; }
    meta.content = 'Streamlined two-phase on-call configuration: define team → configure contact rules.';
    if (created) document.head.appendChild(meta);
    markStepVisited && markStepVisited('on-call-streamlined');
    return () => {
      document.title = prev;
      if (created && meta && meta.parentNode) meta.parentNode.removeChild(meta);
    };
  }, []);

  // Phase 1: Define Team Members
  const addTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      {
        id: makeId(),
        name: '',
        title: '',
        priority: teamMembers.length + 1,
        contactSteps: [],
      },
    ]);
  };

  const removeTeamMember = (id) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
  };

  const updateTeamMemberName = (id, name) => {
    setTeamMembers(
      teamMembers.map((m) => (m.id === id ? { ...m, name } : m))
    );
  };

  const updateTeamMemberTitle = (id, title) => {
    setTeamMembers(
      teamMembers.map((m) => (m.id === id ? { ...m, title } : m))
    );
  };

  // Phase 2: Configure Contact Rules
  const addContactStep = (memberId) => {
    setTeamMembers(
      teamMembers.map((m) =>
        m.id === memberId
          ? {
              ...m,
              contactSteps: [
                ...m.contactSteps,
                {
                  id: makeId(),
                  method: '',
                  target: '',
                  attempts: '1',
                  waitMinutes: '5',
                  escalateTo: '',
                },
              ],
            }
          : m
      )
    );
  };

  const removeContactStep = (memberId, stepId) => {
    setTeamMembers(
      teamMembers.map((m) =>
        m.id === memberId
          ? {
              ...m,
              contactSteps: m.contactSteps.filter((s) => s.id !== stepId),
            }
          : m
      )
    );
  };

  const updateContactStep = (memberId, stepId, field, value) => {
    setTeamMembers(
      teamMembers.map((m) =>
        m.id === memberId
          ? {
              ...m,
              contactSteps: m.contactSteps.map((s) =>
                s.id === stepId ? { ...s, [field]: value } : s
              ),
            }
          : m
      )
    );
  };

  // Navigation
  const canProceedToPhase2 = teamMembers.length > 0 && teamMembers.every((m) => m.name.trim());

  const startConfiguring = () => {
    if (canProceedToPhase2) {
      setCurrentPhase('configure');
      setCurrentConfigureIndex(0);
    }
  };

  const nextMember = () => {
    if (currentConfigureIndex < teamMembers.length - 1) {
      setCurrentConfigureIndex(currentConfigureIndex + 1);
    }
  };

  const prevMember = () => {
    if (currentConfigureIndex > 0) {
      setCurrentConfigureIndex(currentConfigureIndex - 1);
    }
  };

  const backToDefine = () => {
    setCurrentPhase('define');
    setCurrentConfigureIndex(0);
  };

  const finishConfiguration = () => {
    markStepVisited('on-call-streamlined');
    history.push(WIZARD_ROUTES.OFFICE_REACH);
  };

  const currentMember = teamMembers[currentConfigureIndex];
  const isLastMember = currentConfigureIndex === teamMembers.length - 1;

  return (
    <Box sx={sharedStyles.layout.pageWrapper}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* Header */}
        <Paper
          elevation={2}
          role="region"
          aria-labelledby="oncall-streamlined-title"
          sx={{
            p: { xs: 2, md: 3 },
            mb: 3,
            background: darkMode
              ? `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}06 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.main}06 0%, ${theme.palette.secondary.main}02 100%)`,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Typography
            id="oncall-streamlined-title"
            component="h1"
            variant="h5"
            tabIndex={-1}
            sx={{ fontWeight: 700, mb: 0.5, color: theme.palette.primary.main }}
          >
            🧪 Streamlined On-Call Setup
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Two-phase workflow: Define your team → Configure contact rules for each member
          </Typography>
        </Paper>

        {/* Phase Stepper */}
        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Stepper activeStep={currentPhase === 'define' ? 0 : 1} alternativeLabel>
            <Step completed={currentPhase === 'configure'}>
              <StepLabel>Define Team Members</StepLabel>
            </Step>
            <Step completed={false}>
              <StepLabel>Configure Contact Rules</StepLabel>
            </Step>
          </Stepper>
        </Paper>

        {/* Phase 1: Define Team Members */}
        {currentPhase === 'define' && (
          <Paper sx={sharedStyles.card('primary', 'outlined')}>
            <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 0.5 }}>
              Phase 1: Define Team Members
            </Typography>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', mb: 2 }}>
              Add all on-call team members who need contact rules configured. You'll set up their
              contact methods and escalation procedures in Phase 2.
            </Typography>

            {teamMembers.length === 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Start by adding your first on-call team member. You can add multiple members before
                proceeding to Phase 2.
              </Alert>
            )}

            <Stack spacing={2}>
              {teamMembers.map((member, index) => (
                <Card
                  key={member.id}
                  variant="outlined"
                  sx={{
                    borderLeft: `4px solid ${theme.palette.primary.main}`,
                    bgcolor: darkMode ? theme.palette.grey[900] : theme.palette.grey[50],
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        Team Member
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeTeamMember(member.id)}
                        color="error"
                        aria-label={`Remove ${member.name || 'team member'}`}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Name *"
                          placeholder="John Doe"
                          value={member.name}
                          onChange={(e) => updateTeamMemberName(member.id, e.target.value)}
                          size="small"
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Title / Role"
                          placeholder="Lead Technician"
                          value={member.title}
                          onChange={(e) => updateTeamMemberTitle(member.id, e.target.value)}
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addTeamMember}
                sx={{ alignSelf: 'flex-start' }}
              >
                Add Team Member
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Button
                variant="outlined"
                startIcon={<NavigateBefore />}
                onClick={() => history.push(WIZARD_ROUTES.ANSWER_CALLS)}
              >
                Back
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForward />}
                onClick={startConfiguring}
                disabled={!canProceedToPhase2}
              >
                Configure Contact Rules
              </Button>
            </Stack>

            {!canProceedToPhase2 && teamMembers.length > 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Please ensure all team members have a name before proceeding to Phase 2.
              </Alert>
            )}
          </Paper>
        )}

        {/* Phase 2: Configure Contact Rules */}
        {currentPhase === 'configure' && currentMember && (
          <Paper sx={sharedStyles.card('secondary', 'outlined')}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: 15, fontWeight: 700, flex: 1 }}>
                Phase 2: Configure Contact Rules
              </Typography>
              <Chip
                label={`${currentConfigureIndex + 1} of ${teamMembers.length}`}
                color="secondary"
                size="small"
              />
            </Stack>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Configuring: {currentMember.name} {currentMember.title && `(${currentMember.title})`}
              </Typography>
              <Typography variant="caption">
                Define the contact methods, attempt counts, and escalation rules for this team member.
              </Typography>
            </Alert>

            {/* Contact Steps */}
            <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 2 }}>
              Contact Steps
            </Typography>

            {currentMember.contactSteps.length === 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                No contact steps defined. Add at least one contact method to proceed.
              </Alert>
            )}

            <Stack spacing={2} sx={{ mb: 3 }}>
              {currentMember.contactSteps.map((step, stepIndex) => (
                <Card
                  key={step.id}
                  variant="outlined"
                  sx={{
                    borderLeft: `4px solid ${theme.palette.secondary.main}`,
                    bgcolor: darkMode ? theme.palette.grey[900] : theme.palette.grey[50],
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                      <Chip
                        label={`Step ${stepIndex + 1}`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
                        Contact Method
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => removeContactStep(currentMember.id, step.id)}
                        color="error"
                        aria-label={`Remove step ${stepIndex + 1}`}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Contact Method *</InputLabel>
                          <Select
                            value={step.method}
                            label="Contact Method *"
                            onChange={(e) =>
                              updateContactStep(currentMember.id, step.id, 'method', e.target.value)
                            }
                          >
                            {CONTACT_METHODS.map((method) => (
                              <MenuItem key={method} value={method}>
                                {method}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Contact Target"
                          placeholder="555-1234 or email@example.com"
                          value={step.target}
                          onChange={(e) =>
                            updateContactStep(currentMember.id, step.id, 'target', e.target.value)
                          }
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Attempts"
                          type="number"
                          value={step.attempts}
                          onChange={(e) =>
                            updateContactStep(currentMember.id, step.id, 'attempts', e.target.value)
                          }
                          size="small"
                          inputProps={{ min: 1, max: 10 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Wait (minutes)"
                          type="number"
                          value={step.waitMinutes}
                          onChange={(e) =>
                            updateContactStep(
                              currentMember.id,
                              step.id,
                              'waitMinutes',
                              e.target.value
                            )
                          }
                          size="small"
                          inputProps={{ min: 1, max: 120 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Escalate To"
                          placeholder="Next person/team"
                          value={step.escalateTo}
                          onChange={(e) =>
                            updateContactStep(
                              currentMember.id,
                              step.id,
                              'escalateTo',
                              e.target.value
                            )
                          }
                          size="small"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => addContactStep(currentMember.id)}
                sx={{ alignSelf: 'flex-start' }}
              >
                Add Contact Step
              </Button>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {/* Navigation */}
            <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
              <Button
                variant="outlined"
                size="small"
                onClick={backToDefine}
                startIcon={<ArrowBack />}
              >
                Back to Team List
              </Button>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  onClick={prevMember}
                  disabled={currentConfigureIndex === 0}
                  startIcon={<NavigateBefore />}
                >
                  Previous
                </Button>
                {!isLastMember ? (
                  <Button
                    variant="contained"
                    onClick={nextMember}
                    endIcon={<NavigateNext />}
                    color="secondary"
                  >
                    Next Member
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={finishConfiguration}
                    endIcon={<CheckCircle />}
                    color="success"
                  >
                    Complete Setup
                  </Button>
                )}
              </Stack>
            </Stack>

            {/* Progress Indicator */}
            <Box sx={{ mt: 3, p: 2, bgcolor: darkMode ? theme.palette.grey[900] : theme.palette.grey[50], borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Configuration Progress
              </Typography>
              <Stack direction="row" spacing={1}>
                {teamMembers.map((member, idx) => (
                  <Chip
                    key={member.id}
                    label={member.name.split(' ')[0] || `Member ${idx + 1}`}
                    size="small"
                    color={idx === currentConfigureIndex ? 'secondary' : idx < currentConfigureIndex ? 'success' : 'default'}
                    variant={idx === currentConfigureIndex ? 'filled' : 'outlined'}
                  />
                ))}
              </Stack>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default OnCallStreamlined;
