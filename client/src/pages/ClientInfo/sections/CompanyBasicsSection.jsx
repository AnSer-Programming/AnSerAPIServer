// src/pages/ClientInfo/sections/CompanyBasicsSection.jsx
import React from 'react';
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
} from '@mui/material';
import { AddCircleOutline, DeleteOutline } from '@mui/icons-material';

const cleanPhone = (v = '') => v.replace(/[^\d\-()+ ]/g, '').slice(0, 30);

const CompanyBasicsSection = ({
  data = {},
  onChange,
  errors = {},
  mailingSameAsPhysical = false,
  onMailingSameAsPhysicalChange,
  onAdditionalLocationsChange,
}) => {
  const contacts = data.contactNumbers || {};
  const contactErrors = errors.contactNumbers || {};
  const additionalLocations = Array.isArray(data.additionalLocations)
    ? data.additionalLocations
    : [];
  const additionalErrors = Array.isArray(errors.additionalLocations)
    ? errors.additionalLocations
    : [];

  const setContact = (patch) =>
    onChange?.({ contactNumbers: { ...contacts, ...patch } });

  const setAdditionalLocations = (list) => {
    if (onAdditionalLocationsChange) {
      onAdditionalLocationsChange(list);
    } else {
      onChange?.({ additionalLocations: list });
    }
  };

  const handlePhysicalChange = (val) => {
    if (mailingSameAsPhysical) {
      onChange?.({ physicalLocation: val, mailingAddress: val });
    } else {
      onChange?.({ physicalLocation: val });
    }
  };

  const handleMailingToggle = (checked) => {
    onMailingSameAsPhysicalChange?.(checked);
    if (checked) {
      onChange?.({ mailingAddress: data.physicalLocation || '' });
    }
  };

  const addLocation = () => {
    setAdditionalLocations([
      ...additionalLocations,
      { label: '', address: '', suite: '' },
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

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Company Information
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        We'll use this information in your caller greetings, billing, and documentation, so please enter it exactly how you'd like it displayed.
      </Typography>

      {/* Basics */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
        <TextField
          label="Business Name"
          fullWidth
          value={data.businessName || data.company || ''}
          onChange={(e) =>
            onChange?.({ businessName: e.target.value, company: e.target.value })
          }
          error={!!errors.businessName || !!errors.company}
          helperText={errors.businessName || errors.company || 'Legal or main operating name.'}
        />

        <TextField
          label="Complex Name"
          fullWidth
          value={data.complexName || ''}
          onChange={(e) => onChange?.({ complexName: e.target.value })}
          helperText="If business is part of a plaza/complex, enter the name. (Optional)"
        />

        <TextField
          label="Suite or Unit (optional)"
          fullWidth
          value={data.suiteOrUnit || ''}
          onChange={(e) => onChange?.({ suiteOrUnit: e.target.value })}
          helperText="Include the suite, unit, or floor if callers or invoices should reference it."
        />

        <TextField
          label="Physical Location"
          fullWidth
          value={data.physicalLocation || ''}
          onChange={(e) => handlePhysicalChange(e.target.value)}
          helperText="Street address where visitors arrive or deliveries should go."
        />

        {/* Checkbox between Physical and Mailing */}
        <Box sx={{ pl: { xs: 0.5, md: 1 }, mt: -0.5 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={!!mailingSameAsPhysical}
                onChange={(e) => handleMailingToggle(e.target.checked)}
              />
            }
            label="Mailing address is the same as physical location"
          />
        </Box>

        <TextField
          label="Mailing Address"
          fullWidth
          value={
            mailingSameAsPhysical
              ? (data.physicalLocation || '')
              : (data.mailingAddress || '')
          }
          onChange={(e) => onChange?.({ mailingAddress: e.target.value })}
          disabled={mailingSameAsPhysical}
          error={!!errors.mailingAddress}
          helperText={
            errors.mailingAddress ||
            (mailingSameAsPhysical
              ? 'Using Physical Location as Mailing Address.'
              : 'Where you receive mail, if different from your physical location.')
          }
        />
      </Box>

      {/* Additional Locations */}
      <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 700 }}>
        Additional Locations
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add other offices, warehouses, or service areas that callers might reference. We'll include them in your account notes.
      </Typography>

      <Stack spacing={2} sx={{ mb: 2 }}>
        {additionalLocations.map((location, index) => {
          const fieldErrors = additionalErrors[index] || {};
          return (
            <Paper
              key={index}
              variant="outlined"
              sx={{ p: 2, borderRadius: 2, borderStyle: 'dashed' }}
            >
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <TextField
                    label="Location Label"
                    fullWidth
                    value={location.label || ''}
                    onChange={(e) => updateLocation(index, { label: e.target.value })}
                    helperText={fieldErrors.label || 'e.g., North Clinic, Warehouse, HQ Annex'}
                    error={!!fieldErrors.label}
                  />
                  <TextField
                    label="Suite / Unit (optional)"
                    fullWidth
                    value={location.suite || ''}
                    onChange={(e) => updateLocation(index, { suite: e.target.value })}
                    helperText={fieldErrors.suite}
                    error={!!fieldErrors.suite}
                  />
                  <IconButton
                    color="error"
                    aria-label="Remove location"
                    onClick={() => removeLocation(index)}
                    sx={{ alignSelf: { xs: 'flex-start', sm: 'center' } }}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Box>
                <TextField
                  label="Address"
                  fullWidth
                  value={location.address || ''}
                  onChange={(e) => updateLocation(index, { address: e.target.value })}
                  helperText={fieldErrors.address || 'Include full street address and city/state if applicable.'}
                  error={!!fieldErrors.address}
                  multiline
                  minRows={2}
                />
              </Stack>
            </Paper>
          );
        })}

        {!additionalLocations.length && (
          <Paper
            variant="outlined"
            sx={{ p: 2, borderRadius: 2, borderStyle: 'dashed', color: 'text.secondary' }}
          >
            You haven’t added any additional locations yet. Use the button below if you operate from multiple places.
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

      {/* Contact details */}
      <Typography variant="subtitle1" sx={{ mt: 1.5, mb: 1, fontWeight: 700 }}>
        Contact Details
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        These numbers and email addresses help us reach your team and appear on caller instructions when appropriate.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        <TextField
          label="Primary Office Line"
          type="tel"
          value={contacts.primaryOfficeLine || ''}
          onChange={(e) => setContact({ primaryOfficeLine: cleanPhone(e.target.value) })}
          error={!!contactErrors.primaryOfficeLine}
          helperText={contactErrors.primaryOfficeLine || 'Main number callers dial most often.'}
          inputProps={{ inputMode: 'tel' }}
        />

        <TextField
          label="Toll-Free"
          type="tel"
          value={contacts.tollFree || ''}
          onChange={(e) => setContact({ tollFree: cleanPhone(e.target.value) })}
          error={!!contactErrors.tollFree}
          helperText={contactErrors.tollFree || 'Provide if you advertise a toll-free line.'}
          inputProps={{ inputMode: 'tel' }}
        />

        <TextField
          label="Secondary / Back Line"
          type="tel"
          value={contacts.secondaryLine || ''}
          onChange={(e) => setContact({ secondaryLine: cleanPhone(e.target.value) })}
          error={!!contactErrors.secondaryLine}
          helperText={contactErrors.secondaryLine || 'Use for alternate lines, after-hours ring groups, or backups.'}
          inputProps={{ inputMode: 'tel' }}
        />

        <TextField
          label="Fax"
          type="tel"
          value={contacts.fax || ''}
          onChange={(e) => setContact({ fax: cleanPhone(e.target.value) })}
          error={!!contactErrors.fax}
          helperText={contactErrors.fax || 'Optional — include only if you still monitor this inbox.'}
          inputProps={{ inputMode: 'tel' }}
        />

        <TextField
          label="Office Email"
          type="email"
          value={contacts.officeEmail || ''}
          onChange={(e) => setContact({ officeEmail: e.target.value })}
          error={!!contactErrors.officeEmail}
          helperText={contactErrors.officeEmail || 'Shared inbox we can use for confirmations and summary emails.'}
          inputProps={{ inputMode: 'email' }}
        />

        <TextField
          label="Website"
          type="url"
          value={contacts.website || ''}
          onChange={(e) => setContact({ website: e.target.value })}
          error={!!contactErrors.website}
          helperText={contactErrors.website || 'Optional — we reference this if callers ask for more info.'}
          placeholder="https://example.com"
        />
      </Box>
    </Box>
  );
};

export default CompanyBasicsSection;
