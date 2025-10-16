import React from 'react';
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

const SYNC_FIELDS = ['name', 'title', 'phone', 'email'];

const PrimaryContactsSection = ({
  primary = {},
  billing = {},
  sameAs = false,
  onChange = () => {},
  errors = {},
}) => {
  const ensureObject = (value) => (value && typeof value === 'object' ? value : {});
  const primaryContact = ensureObject(primary);
  const billingContact = ensureObject(billing);
  const primaryErrors = ensureObject(errors.primaryContact);
  const billingErrors = ensureObject(errors.billingContact);

  const emit = (patch) => {
    if (typeof onChange === 'function') {
      onChange(patch);
    }
  };

  const applyMirror = (source, target) => {
    const next = { ...target };
    SYNC_FIELDS.forEach((field) => {
      if (source[field] !== undefined) {
        next[field] = source[field];
      }
    });
    return next;
  };

  const handlePrimaryChange = (field) => (event) => {
    const value = event.target.value;
    const nextPrimary = { ...primaryContact, [field]: value };
    const patch = { primaryContact: nextPrimary };
    if (sameAs) {
      patch.billingContact = applyMirror(nextPrimary, billingContact);
    }
    emit(patch);
  };

  const handleBillingChange = (field) => (event) => {
    const value = event.target.value;
    emit({ billingContact: { ...billingContact, [field]: value } });
  };

  const toggleSame = (event) => {
    const checked = event.target.checked;
    const patch = { billingSameAsPrimary: checked };
    if (checked) {
      patch.billingContact = applyMirror(primaryContact, billingContact);
    }
    emit(patch);
  };

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          Primary Contact
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Tell us who we should reach first when an urgent caller needs help.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Name"
              fullWidth
              value={primaryContact.name || ''}
              onChange={handlePrimaryChange('name')}
              error={Boolean(primaryErrors.name)}
              helperText={primaryErrors.name}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Direct Phone"
              fullWidth
              inputMode="tel"
              value={primaryContact.phone || ''}
              onChange={handlePrimaryChange('phone')}
              error={Boolean(primaryErrors.phone)}
              helperText={primaryErrors.phone}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              fullWidth
              inputMode="email"
              value={primaryContact.email || ''}
              onChange={handlePrimaryChange('email')}
              error={Boolean(primaryErrors.email)}
              helperText={primaryErrors.email}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Title / Role"
              fullWidth
              value={primaryContact.title || ''}
              onChange={handlePrimaryChange('title')}
              error={Boolean(primaryErrors.title)}
              helperText={primaryErrors.title}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider />

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Billing Contact
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(sameAs)}
                onChange={toggleSame}
              />
            }
            label="Same as primary contact"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          We’ll send invoices and payment questions here.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Name"
              fullWidth
              value={billingContact.name || ''}
              onChange={handleBillingChange('name')}
              disabled={sameAs}
              error={Boolean(billingErrors.name)}
              helperText={billingErrors.name}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone"
              fullWidth
              inputMode="tel"
              value={billingContact.phone || ''}
              onChange={handleBillingChange('phone')}
              disabled={sameAs}
              error={Boolean(billingErrors.phone)}
              helperText={billingErrors.phone}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              fullWidth
              inputMode="email"
              value={billingContact.email || ''}
              onChange={handleBillingChange('email')}
              disabled={sameAs}
              error={Boolean(billingErrors.email)}
              helperText={billingErrors.email}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Title / Role"
              fullWidth
              value={billingContact.title || ''}
              onChange={handleBillingChange('title')}
              disabled={sameAs}
              error={Boolean(billingErrors.title)}
              helperText={billingErrors.title}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PrimaryContactsSection;
