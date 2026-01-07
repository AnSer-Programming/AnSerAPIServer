// src/pages/ClientInfo/sections/OnCallScheduleSection.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Stack,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  Divider,
  Button,
  IconButton,
  TextField,
  Grid,
  Alert,
  alpha,
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useWizard } from '../context_API/WizardContext';
import FieldRow from '../components/FieldRow';

const createOrderEntryId = () => `order-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const OnCallScheduleSection = ({ errors = {}, onCall: onCallProp, setOnCall: setOnCallProp }) => {
  const { formData, updateSection } = useWizard();
  const theme = useTheme();
  const onCall = onCallProp || formData.onCall || {};
  const scheduleType = onCall.scheduleType || 'no-schedule';
  const fixedOrder = onCall.fixedOrder || [];
  const teamMembers = Array.isArray(onCall.team) ? onCall.team : [];

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const rawErrors = errors ?? {};
  const errorsIsArray = Array.isArray(rawErrors);
  const scheduleErrors = !errorsIsArray && typeof rawErrors === 'object' ? rawErrors : {};
  const fixedOrderErrors = errorsIsArray
    ? rawErrors
    : Array.isArray(scheduleErrors.fixedOrderItems)
      ? scheduleErrors.fixedOrderItems
      : Array.isArray(scheduleErrors.fixedOrder)
        ? scheduleErrors.fixedOrder
        : [];
  const scheduleTypeError = errorsIsArray ? undefined : scheduleErrors.scheduleType;
  const fixedOrderMessage = !errorsIsArray && typeof scheduleErrors.fixedOrder === 'string'
    ? scheduleErrors.fixedOrder
    : '';

  const assignedMemberIds = new Set(
    fixedOrder
      .map((entry) => entry?.memberId)
      .filter((memberId) => memberId && typeof memberId === 'string')
  );

  const availableMembers = teamMembers.filter((member) => !assignedMemberIds.has(member.id));

  useEffect(() => {
    if (!selectedMemberId) return;
    const stillAvailable = availableMembers.some((member) => member.id === selectedMemberId);
    if (!stillAvailable) {
      setSelectedMemberId('');
    }
  }, [availableMembers, selectedMemberId]);

  const setOnCall = (patch) => {
    if (typeof setOnCallProp === 'function') {
      setOnCallProp(patch);
      return;
    }

    updateSection('onCall', { ...onCall, ...patch });
  };

  const handleScheduleTypeChange = (event) => {
    setOnCall({ scheduleType: event.target.value });
  };

  const updateFixedOrderEntry = (index, updates) => {
    const newOrder = fixedOrder.map((entry, idx) =>
      idx === index ? { ...entry, ...updates } : entry
    );
    setOnCall({ fixedOrder: newOrder });
  };

  const getTeamMemberById = (memberId) => teamMembers.find((member) => member?.id === memberId);

  const formatMemberDetails = (member) => {
    if (!member) return '';

    const safeList = (value) => (Array.isArray(value) ? value : [value]);
    const pickFirst = (list) => safeList(list).find((entry) => (entry || '').trim());

    const title = member.title?.trim() || '';
    const phone = pickFirst(member.cellPhone)?.trim() || '';
    const email = pickFirst(member.email)?.trim() || '';

    return [title, phone, email].filter(Boolean).join(' • ');
  };

  const handleAddOrderEntry = (member) => {
    const newEntry = {
      id: createOrderEntryId(),
      memberId: member?.id || '',
      name: member?.name || '',
      role: member?.title || '',
    };
    setOnCall({ fixedOrder: [...fixedOrder, newEntry] });
  };

  const handleSelectExistingMember = (index, memberId) => {
    if (!memberId || memberId === 'custom') {
      updateFixedOrderEntry(index, { memberId: '' });
      return;
    }

    const rosterMember = getTeamMemberById(memberId);
    if (rosterMember) {
      updateFixedOrderEntry(index, {
        memberId,
        name: rosterMember.name || '',
        role: rosterMember.title || '',
      });
    } else {
      updateFixedOrderEntry(index, { memberId: '' });
    }
  };

  const handleAddSelectedMember = () => {
    if (!selectedMemberId) return;
    const rosterMember = getTeamMemberById(selectedMemberId);
    handleAddOrderEntry(rosterMember);
    setSelectedMemberId('');
  };

  const handleRemoveFromFixedOrder = (index) => {
    const newOrder = fixedOrder.filter((_, idx) => idx !== index);
    setOnCall({ fixedOrder: newOrder });
  };

  const handleDragStart = (event, index) => {
    event.dataTransfer.effectAllowed = 'move';
    setDraggedIndex(index);
  };

  const handleDragOver = (event, index) => {
    event.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newOrder = [...fixedOrder];
    const draggedPerson = newOrder[draggedIndex];
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedPerson);
    setDraggedIndex(index);
    setOnCall({ fixedOrder: newOrder });
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const cardBg = alpha(theme.palette.primary.main, 0.04);
  const cardBorder = alpha(theme.palette.primary.main, 0.15);

  return (
    <Paper sx={{ p: 3, borderRadius: 2, border: `1px solid ${cardBorder}`, backgroundColor: cardBg }}>
      <Stack spacing={3}>
        {/* Title */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            On-Call Schedule
          </Typography>
          <Typography variant="body2" color="text.secondary">
            How is your after-hours coverage organized?
          </Typography>
        </Box>

        <Divider />

        {/* Schedule Type Selection */}
        <Box>
          <RadioGroup value={scheduleType} onChange={handleScheduleTypeChange}>
            <FormControlLabel
              value="rotating"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Rotating on-call schedule
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Dynamic rotation based on a schedule (IIS schedule integration available)
                  </Typography>
                </Box>
              }
              sx={{ mb: 2, alignItems: 'flex-start' }}
            />
            <FormControlLabel
              value="fixed"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Fixed / permanent order
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Static list: always Joe → Cristian → Adam, etc.
                  </Typography>
                </Box>
              }
              sx={{ mb: 2, alignItems: 'flex-start' }}
            />
            <FormControlLabel
              value="no-schedule"
              control={<Radio />}
              label={
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    No schedule — we always reach the same person/people
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Primary contact is always the first to be reached
                  </Typography>
                </Box>
              }
              sx={{ alignItems: 'flex-start' }}
            />
          </RadioGroup>
            {scheduleTypeError && (
              <FormHelperText error sx={{ mt: 1 }}>
                {scheduleTypeError}
              </FormHelperText>
            )}
        </Box>

        <Divider />

        {/* Rotating Schedule - Info Message */}
        {scheduleType === 'rotating' && (
          <Alert severity="info">
            Rotating on-call schedule builder is available with IIS integration. Configure your team members and escalation steps above first.
          </Alert>
        )}

        {/* Fixed Order - Draggable List */}
        {scheduleType === 'fixed' && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Escalation Order
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Drag to reorder. We'll reach these people in this order.
            </Typography>

            {fixedOrder.length === 0 ? (
              <Alert severity={fixedOrderMessage ? 'error' : 'info'} sx={{ mb: 2 }}>
                {fixedOrderMessage || 'No contacts added to the fixed order yet. Add contacts below.'}
              </Alert>
            ) : (
              <Stack spacing={1} sx={{ mb: 2 }}>
                {fixedOrder.map((person, index) => {
                  const rosterMember = person.memberId ? getTeamMemberById(person.memberId) : null;
                  const rowError = Array.isArray(fixedOrderErrors) ? fixedOrderErrors[index] : undefined;
                  const helperMessage = typeof rowError === 'string'
                    ? rowError
                    : rowError?.memberId || rowError?.name || rowError?.role || '';
                  const detailSummary = person.memberId ? formatMemberDetails(rosterMember) : '';

                  return (
                    <Paper
                      key={person.id}
                      variant="outlined"
                      draggable
                      onDragStart={(event) => handleDragStart(event, index)}
                      onDragOver={(event) => handleDragOver(event, index)}
                      onDragEnd={handleDragEnd}
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        cursor: draggedIndex === index ? 'grabbing' : 'grab',
                        opacity: draggedIndex === index ? 0.5 : 1,
                        backgroundColor: draggedIndex === index ? alpha(theme.palette.primary.main, 0.1) : 'background.paper',
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 1,
                        },
                      }}
                    >
                      <Box sx={{ pt: 0.5, color: 'text.secondary' }}>
                        <DragIcon />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Contact #{index + 1}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth size="small" error={Boolean(helperMessage)}>
                              <InputLabel id={`fixed-order-${person.id}-member-label`}>
                                Team Member
                              </InputLabel>
                              <Select
                                labelId={`fixed-order-${person.id}-member-label`}
                                label="Team Member"
                                value={person.memberId || 'custom'}
                                onChange={(event) => handleSelectExistingMember(index, event.target.value)}
                              >
                                <MenuItem value="custom">
                                  <em>Custom contact</em>
                                </MenuItem>
                                {teamMembers.map((member) => {
                                  const alreadyAssigned = fixedOrder.some(
                                    (entry, entryIndex) => entryIndex !== index && entry.memberId === member.id
                                  );
                                  const optionLabel = [member.name || '(No name)', member.title || '']
                                    .filter(Boolean)
                                    .join(' — ');
                                  return (
                                    <MenuItem key={member.id} value={member.id} disabled={alreadyAssigned}>
                                      {optionLabel}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                              {helperMessage && <FormHelperText>{helperMessage}</FormHelperText>}
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FieldRow>
                              <TextField
                                label="Display Name"
                                value={person.name || ''}
                                onChange={(event) => updateFixedOrderEntry(index, { name: event.target.value })}
                                size="small"
                                fullWidth
                              />
                            </FieldRow>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FieldRow>
                              <TextField
                                label="Role / Team"
                                value={person.role || ''}
                                onChange={(event) => updateFixedOrderEntry(index, { role: event.target.value })}
                                size="small"
                                fullWidth
                              />
                            </FieldRow>
                          </Grid>
                        </Grid>
                        {detailSummary && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {detailSummary}
                          </Typography>
                        )}
                      </Box>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFromFixedOrder(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Paper>
                  );
                })}
              </Stack>
            )}

            <Box sx={{ border: `1px dashed ${cardBorder}`, p: 2, borderRadius: 1, mb: 2 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Add from your team
                  </Typography>
                  {teamMembers.length === 0 ? (
                    <Alert severity="info">
                      Add on-call team members above to enable quick selection here.
                    </Alert>
                  ) : availableMembers.length === 0 ? (
                    <Alert severity="success">
                      Everyone on your team is already assigned to this order.
                    </Alert>
                  ) : (
                    <Stack spacing={1}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="add-fixed-order-member-label">Team Member</InputLabel>
                        <Select
                          labelId="add-fixed-order-member-label"
                          label="Team Member"
                          value={selectedMemberId}
                          onChange={(event) => setSelectedMemberId(event.target.value)}
                        >
                          <MenuItem value="">
                            <em>Select a team member</em>
                          </MenuItem>
                          {availableMembers.map((member) => {
                            const optionLabel = [member.name || '(No name)', member.title || '']
                              .filter(Boolean)
                              .join(' — ');
                            return (
                              <MenuItem key={member.id} value={member.id}>
                                {optionLabel}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={handleAddSelectedMember}
                        disabled={!selectedMemberId}
                      >
                        Add Selected Member
                      </Button>
                    </Stack>
                  )}
                </Box>

                <Divider flexItem sx={{ my: 1 }} />

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Need someone else?
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddOrderEntry()}
                  >
                    Add Custom Contact
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Box>
        )}

        {/* No Schedule - Info */}
        {scheduleType === 'no-schedule' && (
          <Alert severity="info">
            We'll always reach your primary contact first. After-hours contact details will come from the team members you've configured above.
          </Alert>
        )}
      </Stack>
    </Paper>
  );
};

OnCallScheduleSection.propTypes = {
  errors: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.any),
  ]),
  onCall: PropTypes.shape({
    scheduleType: PropTypes.oneOf(['rotating', 'fixed', 'no-schedule']),
    fixedOrder: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        memberId: PropTypes.string,
        name: PropTypes.string,
        role: PropTypes.string,
      })
    ),
    team: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        title: PropTypes.string,
        email: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        cellPhone: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
      })
    ),
  }),
  setOnCall: PropTypes.func,
};

export default OnCallScheduleSection;
