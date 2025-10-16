// src/pages/ClientInfo/sections/CompanyBasicsSection.jsx
import React, { useEffect, useState } from 'react';
import {
  TextField,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  Divider,
  Button,
  IconButton,
  Stack,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { AddCircleOutline, DeleteOutline } from '@mui/icons-material';

const cleanPhone = (v = '') => v.replace(/[^\d\-()+ ]/g, '').slice(0, 30);

const CONTACT_TYPE_OPTIONS = [
  { value: 'main', label: 'Main phone' },
  { value: 'toll-free', label: 'Toll-free phone' },
  { value: 'fax', label: 'Fax' },
  { value: 'other', label: 'Other phone' },
  { value: 'website', label: 'Website' },
];

const uid = () => `channel-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

const normalizeChannel = (channel) => {
  if (!channel || typeof channel !== 'object') {
    return { id: uid(), type: 'main', value: '' };
  }

  const allowed = CONTACT_TYPE_OPTIONS.some((option) => option.value === channel.type)
    ? channel.type
    : 'main';

  return {
    id: channel.id || uid(),
    type: allowed,
    value: channel.value ?? '',
  };
};

const fallbackFromContacts = (contacts = {}) => {
  const candidates = [];
  if (contacts.primaryOfficeLine) candidates.push({ type: 'main', value: contacts.primaryOfficeLine });
  if (contacts.secondaryLine) candidates.push({ type: 'other', value: contacts.secondaryLine });
  if (contacts.tollFree) candidates.push({ type: 'toll-free', value: contacts.tollFree });
  if (contacts.fax) candidates.push({ type: 'fax', value: contacts.fax });
  if (contacts.website) candidates.push({ type: 'website', value: contacts.website });

  if (!candidates.length) {
    candidates.push({ type: 'main', value: '' });
  }

  return candidates.map(normalizeChannel);
};

const hydrateChannels = (channels, contacts) => {
  if (Array.isArray(channels) && channels.length) {
    return channels.map(normalizeChannel);
  }
  return fallbackFromContacts(contacts);
};

const mailingMirrorMap = {
  physicalLocation: 'mailingAddress',
  physicalCity: 'mailingCity',
  physicalState: 'mailingState',
  physicalPostalCode: 'mailingPostalCode',
};

const CompanyBasicsSection = ({
  data = {},
  onChange,
  errors = {},
  mailingSameAsPhysical = false,
  onMailingSameAsPhysicalChange,
  onAdditionalLocationsChange,
}) => {
  const contacts = data.contactNumbers || {};
  const additionalLocations = Array.isArray(data.additionalLocations)
    ? data.additionalLocations
    : [];
  const additionalErrors = Array.isArray(errors.additionalLocations)
    ? errors.additionalLocations
    : [];

  const [channels, setChannels] = useState(() => hydrateChannels(data.contactChannels, contacts));

  useEffect(() => {
    setChannels(hydrateChannels(data.contactChannels, contacts));
  }, [data.contactChannels, contacts.primaryOfficeLine, contacts.tollFree, contacts.fax, contacts.secondaryLine, contacts.website]);

  const emit = (patch) => {
    if (typeof onChange === 'function') {
      onChange(patch);
    }
  };

  const syncChannels = (nextChannels) => {
    setChannels(nextChannels);
    const baseContacts = {
      ...contacts,
      primaryOfficeLine: '',
      tollFree: '',
      secondaryLine: '',
      fax: '',
      website: '',
      officeEmail: '',
    };

    nextChannels.forEach((channel) => {
      const value = channel.value || '';
      switch (channel.type) {
        case 'main':
          if (!baseContacts.primaryOfficeLine) {
            baseContacts.primaryOfficeLine = value;
          } else if (!baseContacts.secondaryLine) {
            baseContacts.secondaryLine = value;
          }
          break;
        case 'toll-free':
          baseContacts.tollFree = value;
          break;
        case 'fax':
          baseContacts.fax = value;
          break;
        case 'other':
          baseContacts.secondaryLine = value;
          break;
        case 'website':
          baseContacts.website = value;
          break;
        default:
          break;
      }
    });

    emit({
      contactChannels: nextChannels.map((channel) => ({ ...channel, value: channel.value || '' })),
      contactNumbers: baseContacts,
    });
  };

  const handleChannelValueChange = (index) => (event) => {
    const { value } = event.target;
    const current = channels[index];
    const sanitized = current?.type === 'website' ? value : cleanPhone(value);
    const next = channels.map((channel, idx) => (idx === index ? { ...channel, value: sanitized } : channel));
    syncChannels(next);
  };

  const handleChannelTypeChange = (index) => (event) => {
    const { value } = event.target;
    const next = channels.map((channel, idx) =>
      idx === index ? { ...channel, type: value } : channel
    );
    syncChannels(next);
  };

  const handleAddChannel = () => {
    syncChannels([...channels, normalizeChannel({ type: 'other', value: '' })]);
  };

  const handleRemoveChannel = (index) => {
    if (channels.length === 1) return;
    const next = channels.filter((_, idx) => idx !== index);
    syncChannels(next);
  };

  const setAdditionalLocations = (list) => {
    if (onAdditionalLocationsChange) {
      onAdditionalLocationsChange(list);
    } else {
      emit({ additionalLocations: list });
    }
  };

  const addLocation = () => {
    setAdditionalLocations([
      ...additionalLocations,
      { label: '', address: '', suite: '', city: '', state: '', postalCode: '' },
    ]);
  };

  const updateLocation = (index, patch) => {
    setAdditionalLocations(
      additionalLocations.map((loc, idx) =>
        idx === index ? { ...loc, ...patch } : loc,
      ),
    );
  };

  const removeLocation = (index) => {
    setAdditionalLocations(additionalLocations.filter((_, idx) => idx !== index));
  };

  const handleMailingToggle = (checked) => {
    onMailingSameAsPhysicalChange?.(checked);
    if (checked) {
      emit({
        mailingSameAsPhysical: true,
        mailingAddress: data.physicalLocation || '',
        mailingSuite: data.suiteOrUnit || '',
        mailingCity: data.physicalCity || '',
        mailingState: data.physicalState || '',
        mailingPostalCode: data.physicalPostalCode || '',
      });
    } else {
      emit({ mailingSameAsPhysical: false });
    }
  };

  const handlePhysicalField = (key) => (event) => {
    const value = event.target.value;
    const patch = { [key]: value };
    if (mailingSameAsPhysical && mailingMirrorMap[key]) {
      patch[mailingMirrorMap[key]] = value;
    }
    emit(patch);
  };

  const mailingField = (key) => (event) => {
    emit({ [key]: event.target.value });
  };

  return (
    <Box sx={{ p: { xs: 1, md: 2 }, display: 'grid', gap: 3 }}>
      <Box>
        <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700 }}>
          Company Details
        </Typography>
        <Divider />
      </Box>

      <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField
          label="Business Name"
          fullWidth
          value={data.businessName || data.company || ''}
          onChange={(e) => emit({ businessName: e.target.value, company: e.target.value })}
          error={Boolean(errors.businessName || errors.company)}
          helperText={errors.businessName || errors.company}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              label="Physical Street Address"
              fullWidth
              value={data.physicalLocation || ''}
              onChange={handlePhysicalField('physicalLocation')}
              error={Boolean(errors.physicalLocation)}
              helperText={errors.physicalLocation}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Suite / Unit (optional)"
              fullWidth
              value={data.suiteOrUnit || ''}
              onChange={(e) => emit({ suiteOrUnit: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="City"
              fullWidth
              value={data.physicalCity || ''}
              onChange={handlePhysicalField('physicalCity')}
              error={Boolean(errors.physicalCity)}
              helperText={errors.physicalCity}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="State / Province"
              fullWidth
              value={data.physicalState || ''}
              onChange={handlePhysicalField('physicalState')}
              error={Boolean(errors.physicalState)}
              helperText={errors.physicalState}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="ZIP / Postal Code"
              fullWidth
              value={data.physicalPostalCode || ''}
              onChange={handlePhysicalField('physicalPostalCode')}
              error={Boolean(errors.physicalPostalCode)}
              helperText={errors.physicalPostalCode}
            />
          </Grid>
        </Grid>

        <Box sx={{ pl: { xs: 0.5, md: 1 } }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(mailingSameAsPhysical)}
                onChange={(e) => handleMailingToggle(e.target.checked)}
              />
            }
            label="Mailing address is the same as physical location"
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              label="Mailing Street Address"
              fullWidth
              value={mailingSameAsPhysical ? (data.physicalLocation || '') : (data.mailingAddress || '')}
              onChange={mailingField('mailingAddress')}
              disabled={mailingSameAsPhysical}
              error={Boolean(errors.mailingAddress)}
              helperText={errors.mailingAddress}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Suite / Unit (optional)"
              fullWidth
              value={mailingSameAsPhysical ? (data.suiteOrUnit || '') : (data.mailingSuite || '')}
              onChange={mailingField('mailingSuite')}
              disabled={mailingSameAsPhysical}
              error={Boolean(errors.mailingSuite)}
              helperText={errors.mailingSuite}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="City"
              fullWidth
              value={mailingSameAsPhysical ? (data.physicalCity || '') : (data.mailingCity || '')}
              onChange={mailingField('mailingCity')}
              disabled={mailingSameAsPhysical}
              error={Boolean(errors.mailingCity)}
              helperText={errors.mailingCity}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="State / Province"
              fullWidth
              value={mailingSameAsPhysical ? (data.physicalState || '') : (data.mailingState || '')}
              onChange={mailingField('mailingState')}
              disabled={mailingSameAsPhysical}
              error={Boolean(errors.mailingState)}
              helperText={errors.mailingState}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="ZIP / Postal Code"
              fullWidth
              value={mailingSameAsPhysical ? (data.physicalPostalCode || '') : (data.mailingPostalCode || '')}
              onChange={mailingField('mailingPostalCode')}
              disabled={mailingSameAsPhysical}
              error={Boolean(errors.mailingPostalCode)}
              helperText={errors.mailingPostalCode}
            />
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Additional Locations
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Add any other offices or service areas your callers might mention.
        </Typography>

        <Stack spacing={2}>
          {additionalLocations.map((location, index) => {
            const fieldErrors = additionalErrors[index] || {};
            return (
              <Paper
                key={location.id || index}
                variant="outlined"
                sx={{ p: 2, borderRadius: 2, borderStyle: 'dashed' }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="Location Label"
                      fullWidth
                      value={location.label || ''}
                      onChange={(e) => updateLocation(index, { label: e.target.value })}
                      error={Boolean(fieldErrors.label)}
                      helperText={fieldErrors.label || 'e.g., Warehouse, Clinic, HQ Annex'}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Street Address"
                      fullWidth
                      value={location.address || ''}
                      onChange={(e) => updateLocation(index, { address: e.target.value })}
                      error={Boolean(fieldErrors.address)}
                      helperText={fieldErrors.address}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      label="City"
                      fullWidth
                      value={location.city || ''}
                      onChange={(e) => updateLocation(index, { city: e.target.value })}
                      error={Boolean(fieldErrors.city)}
                      helperText={fieldErrors.city}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      label="State"
                      fullWidth
                      value={location.state || ''}
                      onChange={(e) => updateLocation(index, { state: e.target.value })}
                      error={Boolean(fieldErrors.state)}
                      helperText={fieldErrors.state}
                    />
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <IconButton
                      color="error"
                      aria-label="Remove location"
                      onClick={() => removeLocation(index)}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Postal Code"
                      fullWidth
                      value={location.postalCode || ''}
                      onChange={(e) => updateLocation(index, { postalCode: e.target.value })}
                      error={Boolean(fieldErrors.postalCode)}
                      helperText={fieldErrors.postalCode}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      label="Suite / Unit (optional)"
                      fullWidth
                      value={location.suite || ''}
                      onChange={(e) => updateLocation(index, { suite: e.target.value })}
                      error={Boolean(fieldErrors.suite)}
                      helperText={fieldErrors.suite}
                    />
                  </Grid>
                </Grid>
              </Paper>
            );
          })}

          {!additionalLocations.length && (
            <Paper
              variant="outlined"
              sx={{ p: 2, borderRadius: 2, borderStyle: 'dashed', color: 'text.secondary' }}
            >
              You haven’t added any additional locations yet.
            </Paper>
          )}

          <Box>
            <Button
              startIcon={<AddCircleOutline />}
              variant="outlined"
              onClick={addLocation}
            >
              Add Another Location
            </Button>
          </Box>
        </Stack>
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Contact Channels
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Pick the contact types we should reference and add numbers or links for each.
        </Typography>

        <Stack spacing={2}>
          {channels.map((channel, index) => {
            const channelError = Array.isArray(errors.contactChannels) ? errors.contactChannels[index] || {} : {};
            const typeOptions = CONTACT_TYPE_OPTIONS;
            const isWebsite = channel.type === 'website';

            return (
              <Grid container spacing={2} key={channel.id || index} alignItems="flex-end">
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id={`contact-type-${channel.id}`}>Type</InputLabel>
                    <Select
                      labelId={`contact-type-${channel.id}`}
                      label="Type"
                      value={channel.type}
                      onChange={handleChannelTypeChange(index)}
                    >
                      {typeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={7}>
                  <TextField
                    label={isWebsite ? 'Link' : 'Number'}
                    fullWidth
                    value={channel.value}
                    onChange={handleChannelValueChange(index)}
                    inputMode={isWebsite ? 'url' : 'tel'}
                    error={Boolean(channelError.value)}
                    helperText={channelError.value}
                  />
                </Grid>
                <Grid item xs={12} md={1}>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveChannel(index)}
                    disabled={channels.length === 1}
                    aria-label="Remove contact method"
                  >
                    <DeleteOutline />
                  </IconButton>
                </Grid>
              </Grid>
            );
          })}

          <Box>
            <Button variant="outlined" startIcon={<AddCircleOutline />} onClick={handleAddChannel}>
              Add Contact Method
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default CompanyBasicsSection;
