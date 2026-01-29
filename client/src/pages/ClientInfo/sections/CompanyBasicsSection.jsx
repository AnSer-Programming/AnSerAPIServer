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
  ListSubheader,
  FormHelperText,
} from '@mui/material';
import FieldRow from '../components/FieldRow';
import PhoneMaskInput from '../components/PhoneMaskInput';
import { AddCircleOutline, DeleteOutline } from '@mui/icons-material';
import { US_STATES, CANADIAN_PROVINCES } from '../constants/statesProvinces';
import { isValidPostalCode, getPostalCodeError, formatPostalCode } from '../utils/phonePostalValidation';
import { isValidPhone, getPhoneError } from '../utils/phonePostalValidation';

const cleanPhone = (v = '') => v.replace(/[^\d\-()+ ]/g, '').slice(0, 30);

const CONTACT_TYPE_OPTIONS = [
  { value: 'phone', label: 'Phone' },
  { value: 'toll-free', label: 'Toll-Free Phone' },
  { value: 'fax', label: 'Fax' },
  { value: 'website', label: 'Website' },
  { value: 'group-email', label: 'Group Email (distribution)' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'x-twitter', label: 'X (Twitter)' },
  { value: 'instagram', label: 'Instagram' },
];

const uid = () => `channel-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

const normalizeChannel = (channel) => {
  if (!channel || typeof channel !== 'object') {
    return { id: uid(), type: 'main', value: '' };
  }

  const allowed = CONTACT_TYPE_OPTIONS.some((option) => option.value === channel.type)
    ? channel.type
    : 'main';

  // Defensive: if the incoming channel.value accidentally equals the human
  // label for the selected type (e.g., value === 'WhatsApp'), treat it as
  // an empty value instead of using the label as the stored value.
  const option = CONTACT_TYPE_OPTIONS.find((o) => o.value === allowed);
  const label = option ? option.label : '';
  const incomingValue = channel.value ?? '';
  const value = (typeof incomingValue === 'string' && incomingValue.trim())
    ? (incomingValue.trim().toLowerCase() === (label || '').toLowerCase() ? '' : incomingValue)
    : (incomingValue || '');

  return {
    id: channel.id || uid(),
    type: allowed,
    value,
  };
};

const fallbackFromContacts = (contacts = {}) => {
  const candidates = [];
  if (contacts.primaryOfficeLine) candidates.push({ type: 'phone', value: contacts.primaryOfficeLine });
  if (contacts.secondaryLine) candidates.push({ type: 'phone', value: contacts.secondaryLine });
  if (contacts.tollFree) candidates.push({ type: 'toll-free', value: contacts.tollFree });
  if (contacts.fax) candidates.push({ type: 'fax', value: contacts.fax });
  if (contacts.website) candidates.push({ type: 'website', value: contacts.website });

  if (!candidates.length) {
    candidates.push({ type: 'phone', value: '' });
  }

  return candidates.map(normalizeChannel);
};

const hydrateChannels = (channels, contacts) => {
  if (Array.isArray(channels) && channels.length) {
    return channels.map(normalizeChannel);
  }
  return fallbackFromContacts(contacts);
};

const billingMirrorMap = {
  physicalLocation: 'billingAddress',
  physicalCity: 'billingCity',
  physicalState: 'billingState',
  physicalPostalCode: 'billingPostalCode',
};

const CompanyBasicsSection = ({
  data = {},
  onChange,
  errors = {},
  billingSameAsPhysical = false,
  onBillingSameAsPhysicalChange,
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
  // transient helper text messages for channels after normalization (e.g., "Added leading @")
  const [channelNotes, setChannelNotes] = useState({});
  // track which channel input is currently focused to avoid overwriting while editing
  const [focusedChannelId, setFocusedChannelId] = useState(null);
  // Postal code validation errors
  const [postalErrors, setPostalErrors] = useState({
    physical: '',
    billing: '',
  });
  // Additional locations postal errors (keyed by index)
  const [additionalPostalErrors, setAdditionalPostalErrors] = useState({});
  // Channel phone validation errors (keyed by channel id)
  const [channelPhoneErrors, setChannelPhoneErrors] = useState({});

  // Validate postal code on blur
  const validatePostalCode = (field, value) => {
    const error = getPostalCodeError(value);
    setPostalErrors(prev => ({ ...prev, [field]: error }));
  };

  // Handle billing same as physical toggle
  const handleBillingToggle = (checked) => {
    onBillingSameAsPhysicalChange?.(checked);
    if (checked) {
      emit({
        billingSameAsPhysical: true,
        billingAddress: data.physicalLocation || '',
        billingSuite: data.suiteOrUnit || '',
        billingCity: data.physicalCity || '',
        billingState: data.physicalState || '',
        billingPostalCode: data.physicalPostalCode || '',
      });
    } else {
      emit({ billingSameAsPhysical: false });
    }
  };

  const billingField = (key) => (event) => {
    emit({ [key]: event.target.value });
  };

  // Validate additional location postal code
  const validateAdditionalPostal = (index, value) => {
    const error = getPostalCodeError(value);
    setAdditionalPostalErrors(prev => {
      if (error) {
        return { ...prev, [index]: error };
      } else {
        const next = { ...prev };
        delete next[index];
        return next;
      }
    });
  };

  // Handle postal code change with formatting
  const handlePostalCodeChange = (field, billingField = null) => (event) => {
    const raw = event.target.value;
    const formatted = formatPostalCode(raw);
    
    const patch = { [field]: formatted };
    if (billingSameAsPhysical && billingField) {
      patch[billingField] = formatted;
    }
    emit(patch);
    
    // Clear error if now valid
    const fieldKey = field.includes('billing') ? 'billing' : 'physical';
    if (postalErrors[fieldKey] && isValidPostalCode(formatted)) {
      setPostalErrors(prev => ({ ...prev, [fieldKey]: '' }));
    }
  };

  useEffect(() => {
    // Only update local channels state when the hydrated result differs from
    // the current channels to avoid overwriting user edits during typing.
    try {
      const hydrated = hydrateChannels(data.contactChannels, contacts);

      // If a channel is currently focused, preserve its local value into the
      // hydrated result so we do not clobber user input.
      if (focusedChannelId && Array.isArray(hydrated)) {
        for (let i = 0; i < hydrated.length; i++) {
          const h = hydrated[i];
          const local = channels[i];
          if (h && local && h.id === focusedChannelId) {
            hydrated[i] = { ...h, value: local.value };
            break;
          }
        }
      }

      const same = (() => {
        if (!Array.isArray(hydrated) || !Array.isArray(channels)) return false;
        if (hydrated.length !== channels.length) return false;
        for (let i = 0; i < hydrated.length; i++) {
          const a = hydrated[i];
          const b = channels[i];
          if ((a.id || '') !== (b.id || '')) return false;
          if ((a.type || '') !== (b.type || '')) return false;
          if ((a.value || '') !== (b.value || '')) return false;
        }
        return true;
      })();
      if (!same) setChannels(hydrated);
    } catch (e) {
      setChannels(hydrateChannels(data.contactChannels, contacts));
    }
  }, [data.contactChannels, contacts.primaryOfficeLine, contacts.tollFree, contacts.fax, contacts.secondaryLine, contacts.website, focusedChannelId]);

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
        case 'phone':
        case 'whatsapp':
          // Treat phone-like channels similarly: prefer primaryOfficeLine, then secondaryLine
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
        case 'group-email':
          baseContacts.officeEmail = value;
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
    // Allow immediate typing of any characters; normalization occurs on blur.
    const sanitized = value;
    const next = channels.map((channel, idx) => (idx === index ? { ...channel, value: sanitized } : channel));
    syncChannels(next);
    // clear any transient note for this channel while the user is editing
    try {
      const id = current?.id || `channel-${index}`;
      setChannelNotes((prev) => {
        if (!prev || !prev[id]) return prev;
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (e) {
      // noop
    }
  };

  const handleChannelBlur = (index) => (event) => {
    const channel = channels[index] || {};
    const { normalizeContactValue } = require('../utils/contactValidators');
    const { value } = event.target;
    const channelId = channel.id || `channel-${index}`;
    
    // Phone validation for phone-type channels
    const isPhoneType = ['phone', 'toll-free', 'fax', 'whatsapp'].includes(channel.type);
    if (isPhoneType && value && value.trim()) {
      const phoneError = getPhoneError(value);
      if (phoneError) {
        setChannelPhoneErrors(prev => ({ ...prev, [channelId]: phoneError }));
      } else {
        setChannelPhoneErrors(prev => {
          const next = { ...prev };
          delete next[channelId];
          return next;
        });
      }
    } else if (isPhoneType) {
      // Clear error if field is empty
      setChannelPhoneErrors(prev => {
        const next = { ...prev };
        delete next[channelId];
        return next;
      });
    }
    
    const { value: normalized, changed } = normalizeContactValue(channel.type, value);
    if (changed) {
      const next = channels.map((c, idx) => (idx === index ? { ...c, value: normalized } : c));
      syncChannels(next);
      // show a transient helper message for this channel to inform what changed
      const selectedType = CONTACT_TYPE_OPTIONS.find((o) => o.value === channel.type);
      const labelText = selectedType ? selectedType.label : (channel.type || 'Value');
      let msg = '';
      if (normalized.startsWith('@')) {
        msg = `Added leading @ for ${labelText} handle`;
      } else if (/^https?:\/\//i.test(normalized) && !/^https?:\/\//i.test(value.trim())) {
        msg = `Added https:// to ${labelText}`;
      } else {
        msg = `Normalized ${labelText}`;
      }
      setChannelNotes((prev) => ({ ...(prev || {}), [channelId]: msg }));
      // clear the note after a short delay
      setTimeout(() => {
        setChannelNotes((prev) => {
          if (!prev) return prev;
          const copy = { ...prev };
          delete copy[channelId];
          return copy;
        });
      }, 4000);
    }
  };

  const handleChannelTypeChange = (index) => (event) => {
    const { value } = event.target;
    const selectedOption = CONTACT_TYPE_OPTIONS.find((o) => o.value === value);
    const selectedLabel = selectedOption ? selectedOption.label : '';
    const next = channels.map((channel, idx) => {
      if (idx !== index) return channel;
      // If the current value equals the new type's label (or was empty), clear it
      const currentVal = channel?.value || '';
      const newVal = (currentVal && currentVal.trim().toLowerCase() === selectedLabel.toLowerCase()) ? '' : currentVal;
      return { ...channel, type: value, value: newVal };
    });
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

  const handlePhysicalField = (key) => (event) => {
    const value = event.target.value;
    const patch = { [key]: value };
    if (billingSameAsPhysical && billingMirrorMap[key]) {
      patch[billingMirrorMap[key]] = value;
    }
    emit(patch);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 2 }, display: 'grid', gap: 3 }}>
      <Box>
        <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700 }}>
          Basic Company Details
        </Typography>
        <Divider />
      </Box>

      <Box sx={{ display: 'grid', gap: 2 }}>
        <FieldRow helperText={errors.businessName || errors.company}>
          <TextField
            label="Business Name *"
            fullWidth
            required
            value={data.businessName || data.company || ''}
            onChange={(e) => emit({ businessName: e.target.value, company: e.target.value })}
            error={Boolean(errors.businessName || errors.company)}
          />
        </FieldRow>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <FieldRow helperText={errors.physicalLocation}>
              <TextField
                label="Physical Street Address *"
                fullWidth
                required
                value={data.physicalLocation || ''}
                onChange={handlePhysicalField('physicalLocation')}
                error={Boolean(errors.physicalLocation)}
              />
            </FieldRow>
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
              label="City *"
              fullWidth
              required
              value={data.physicalCity || ''}
              onChange={handlePhysicalField('physicalCity')}
              error={Boolean(errors.physicalCity)}
              helperText={errors.physicalCity}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required error={Boolean(errors.physicalState)}>
              <InputLabel id="physical-state-label">State / Province *</InputLabel>
              <Select
                labelId="physical-state-label"
                label="State / Province *"
                value={data.physicalState || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  const patch = { physicalState: value };
                  if (billingSameAsPhysical) {
                    patch.billingState = value;
                  }
                  emit(patch);
                }}
              >
                <ListSubheader>United States</ListSubheader>
                {US_STATES.map((state) => (
                  <MenuItem key={state.code} value={state.code}>
                    {state.name}
                  </MenuItem>
                ))}
                <ListSubheader>Canada</ListSubheader>
                {CANADIAN_PROVINCES.map((prov) => (
                  <MenuItem key={prov.code} value={prov.code}>
                    {prov.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.physicalState && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.physicalState}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Zip / Postal Code *"
              fullWidth
              required
              value={data.physicalPostalCode || ''}
              onChange={handlePostalCodeChange('physicalPostalCode', 'billingPostalCode')}
              onBlur={(e) => validatePostalCode('physical', e.target.value)}
              error={Boolean(postalErrors.physical || errors.physicalPostalCode)}
              helperText={postalErrors.physical || errors.physicalPostalCode}
              inputProps={{ maxLength: 10 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Billing Address Section */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Billing Address
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            We'll send invoices here.
          </Typography>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(billingSameAsPhysical)}
                  onChange={(e) => handleBillingToggle(e.target.checked)}
                />
              }
              label="Same as physical address"
              sx={{ ml: 0 }}
            />
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <FieldRow helperText={errors.billingAddress}>
              <TextField
                label="Billing Street Address"
                fullWidth
                value={billingSameAsPhysical ? (data.physicalLocation || '') : (data.billingAddress || '')}
                onChange={billingField('billingAddress')}
                disabled={billingSameAsPhysical}
                error={Boolean(errors.billingAddress)}
              />
            </FieldRow>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Suite / Unit (optional)"
              fullWidth
              value={billingSameAsPhysical ? (data.suiteOrUnit || '') : (data.billingSuite || '')}
              onChange={billingField('billingSuite')}
              disabled={billingSameAsPhysical}
              error={Boolean(errors.billingSuite)}
              helperText={errors.billingSuite}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="City"
              fullWidth
              value={billingSameAsPhysical ? (data.physicalCity || '') : (data.billingCity || '')}
              onChange={billingField('billingCity')}
              disabled={billingSameAsPhysical}
              error={Boolean(errors.billingCity)}
              helperText={errors.billingCity}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={Boolean(errors.billingState)} disabled={billingSameAsPhysical}>
              <InputLabel id="billing-state-label">State / Province</InputLabel>
              <Select
                labelId="billing-state-label"
                label="State / Province"
                value={billingSameAsPhysical ? (data.physicalState || '') : (data.billingState || '')}
                onChange={(e) => emit({ billingState: e.target.value })}
              >
                <ListSubheader>United States</ListSubheader>
                {US_STATES.map((state) => (
                  <MenuItem key={state.code} value={state.code}>
                    {state.name}
                  </MenuItem>
                ))}
                <ListSubheader>Canada</ListSubheader>
                {CANADIAN_PROVINCES.map((prov) => (
                  <MenuItem key={prov.code} value={prov.code}>
                    {prov.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.billingState && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.billingState}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Zip / Postal Code"
              fullWidth
              value={billingSameAsPhysical ? (data.physicalPostalCode || '') : (data.billingPostalCode || '')}
              onChange={(e) => {
                const formatted = formatPostalCode(e.target.value);
                emit({ billingPostalCode: formatted });
                if (postalErrors.billing && isValidPostalCode(formatted)) {
                  setPostalErrors(prev => ({ ...prev, billing: '' }));
                }
              }}
              onBlur={(e) => validatePostalCode('billing', e.target.value)}
              disabled={billingSameAsPhysical}
              error={Boolean(postalErrors.billing || errors.billingPostalCode)}
              helperText={postalErrors.billing || errors.billingPostalCode}
              inputProps={{ maxLength: 10 }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Additional Locations
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Add any other offices or service areas your callers might mention. Examples: Billing, Mailing, Warehouse.
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
                    <FormControl fullWidth error={Boolean(fieldErrors.state)}>
                      <InputLabel id={`location-${index}-state-label`}>State</InputLabel>
                      <Select
                        labelId={`location-${index}-state-label`}
                        value={location.state || ''}
                        onChange={(e) => updateLocation(index, { state: e.target.value })}
                        label="State"
                      >
                        <MenuItem value="">
                          <em>Select...</em>
                        </MenuItem>
                        <ListSubheader>United States</ListSubheader>
                        {US_STATES.map((state) => (
                          <MenuItem key={state.code} value={state.code}>
                            {state.name}
                          </MenuItem>
                        ))}
                        <ListSubheader>Canada</ListSubheader>
                        {CANADIAN_PROVINCES.map((province) => (
                          <MenuItem key={province.code} value={province.code}>
                            {province.name}
                          </MenuItem>
                        ))}
                      </Select>
                      {fieldErrors.state && (
                        <FormHelperText>{fieldErrors.state}</FormHelperText>
                      )}
                    </FormControl>
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
                      label="Zip / Postal Code"
                      fullWidth
                      value={location.postalCode || ''}
                      onChange={(e) => {
                        const formatted = formatPostalCode(e.target.value);
                        updateLocation(index, { postalCode: formatted });
                        // Clear error as user types if now valid
                        if (additionalPostalErrors[index] && isValidPostalCode(formatted)) {
                          setAdditionalPostalErrors(prev => {
                            const next = { ...prev };
                            delete next[index];
                            return next;
                          });
                        }
                      }}
                      onBlur={() => validateAdditionalPostal(index, location.postalCode)}
                      error={Boolean(fieldErrors.postalCode || additionalPostalErrors[index])}
                      helperText={fieldErrors.postalCode || additionalPostalErrors[index]}
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
          Public Contact Channels *
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Public-facing business channels (as published on your website/Google). <strong>At least one phone number is required.</strong> Examples: main phone, toll-free, group email, website, and official social profiles.
        </Typography>

        {errors.contactNumbers?.primaryOfficeLine && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {errors.contactNumbers.primaryOfficeLine}
          </Typography>
        )}

        <Stack spacing={2}>
          {channels.map((channel, index) => {
            const channelError = Array.isArray(errors.contactChannels) ? errors.contactChannels[index] || {} : {};
            const typeOptions = CONTACT_TYPE_OPTIONS;
            const isWebsite = channel.type === 'website';
            const selectedType = typeOptions.find((o) => o.value === channel.type);
            const labelText = selectedType ? selectedType.label : (isWebsite ? 'Link' : 'Value');
            const channelId = channel.id || `channel-${index}`;
            const isPhoneType = ['phone', 'toll-free', 'fax', 'whatsapp'].includes(channel.type);
            const phoneError = channelPhoneErrors[channelId] || '';

            return (
              <Grid container spacing={2} key={channel.id || index} alignItems="flex-end">
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel id={`contact-type-${channel.id}`}>Type</InputLabel>
                    <Select
                      labelId={`contact-type-${channel.id}`}
                      label="Type"
                      value={channel.type}
                      onChange={(e) => {
                        handleChannelTypeChange(index)(e);
                        // Clear phone error when type changes
                        setChannelPhoneErrors(prev => {
                          const next = { ...prev };
                          delete next[channelId];
                          return next;
                        });
                      }}
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
                    label={labelText}
                    placeholder={labelText}
                    fullWidth
                    value={(() => {
                      // If the stored value accidentally equals the human label, render empty
                      const v = channel.value || '';
                      if (v.trim() && v.trim().toLowerCase() === labelText.toLowerCase()) return '';
                      return v;
                    })()}
                    onChange={(e) => {
                      handleChannelValueChange(index)(e);
                      // Clear phone error if now valid
                      if (isPhoneType && phoneError && isValidPhone(e.target.value)) {
                        setChannelPhoneErrors(prev => {
                          const next = { ...prev };
                          delete next[channelId];
                          return next;
                        });
                      }
                    }}
                    onBlur={(e) => { handleChannelBlur(index)(e); setFocusedChannelId(null); }}
                    onFocus={() => setFocusedChannelId(channel.id || `channel-${index}`)}
                    // Use text input mode for alphanumeric support; websites keep 'url'
                    inputMode={isWebsite ? 'url' : 'text'}
                    error={Boolean(channelError.value || phoneError)}
                    helperText={phoneError || channelNotes[channel.id] || channelError.value}
                    InputProps={
                      ['phone', 'toll-free', 'fax'].includes(channel.type)
                        ? {
                            inputComponent: PhoneMaskInput,
                            inputProps: { type: 'phone' },
                          }
                        : ['whatsapp'].includes(channel.type)
                        ? {
                            inputComponent: PhoneMaskInput,
                            inputProps: { type: 'whatsapp' },
                          }
                        : ['x-twitter', 'facebook', 'instagram', 'linkedin'].includes(channel.type)
                        ? {
                            inputComponent: PhoneMaskInput,
                            inputProps: { type: channel.type.replace('x-twitter', 'xTwitter') },
                          }
                        : undefined
                    }
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
