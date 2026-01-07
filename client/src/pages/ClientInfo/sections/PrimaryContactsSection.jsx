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
import { useTheme, alpha } from '@mui/material/styles';
import FieldRow from '../components/FieldRow';

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

  const theme = useTheme();

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
          Who is authorized to make all final decisions for this account?
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          This is the ultimate approver for setup choices, escalations, and exceptions.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FieldRow helperText={primaryErrors.name}>
              <TextField
                label="Name"
                fullWidth
                value={primaryContact.name || ''}
                onChange={handlePrimaryChange('name')}
                error={Boolean(primaryErrors.name)}
              />
            </FieldRow>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldRow helperText={primaryErrors.phone}>
              <TextField
                label="Direct Phone"
                fullWidth
                inputMode="tel"
                value={primaryContact.phone || ''}
                onChange={handlePrimaryChange('phone')}
                error={Boolean(primaryErrors.phone)}
              />
            </FieldRow>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldRow helperText={primaryErrors.email}>
              <TextField
                label="Email"
                fullWidth
                inputMode="email"
                value={primaryContact.email || ''}
                onChange={handlePrimaryChange('email')}
                error={Boolean(primaryErrors.email)}
              />
            </FieldRow>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldRow helperText={primaryErrors.title}>
              <TextField
                label="Title / Role"
                fullWidth
                value={primaryContact.title || ''}
                onChange={handlePrimaryChange('title')}
                error={Boolean(primaryErrors.title)}
              />
            </FieldRow>
          </Grid>
        </Grid>
      </Box>

  <Divider sx={{ my: 1, borderColor: alpha(theme.palette.divider, 0.85) }} />

      {/* Same-as-primary toggle placed directly under Primary Contact for clearer flow */}
      <Box sx={{ mt: 1, mb: 0 }}>
        <FormControlLabel
          control={<Checkbox checked={Boolean(sameAs)} onChange={toggleSame} />}
          label="Same as primary contact"
          sx={{ ml: 0 }}
          aria-label="Use primary contact as billing contact"
        />
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Billing Contact
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          We’ll send invoices and payment questions here.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FieldRow helperText={billingErrors.name}>
              <TextField
                label="Name"
                fullWidth
                value={billingContact.name || ''}
                onChange={handleBillingChange('name')}
                disabled={sameAs}
                error={Boolean(billingErrors.name)}
              />
            </FieldRow>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldRow helperText={billingErrors.phone}>
              <TextField
                label="Phone"
                fullWidth
                inputMode="tel"
                value={billingContact.phone || ''}
                onChange={handleBillingChange('phone')}
                disabled={sameAs}
                error={Boolean(billingErrors.phone)}
              />
            </FieldRow>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldRow helperText={billingErrors.email}>
              <TextField
                label="Email"
                fullWidth
                inputMode="email"
                value={billingContact.email || ''}
                onChange={handleBillingChange('email')}
                disabled={sameAs}
                error={Boolean(billingErrors.email)}
              />
            </FieldRow>
          </Grid>
          <Grid item xs={12} md={6}>
            <FieldRow helperText={billingErrors.title}>
              <TextField
                label="Title / Role"
                fullWidth
                value={billingContact.title || ''}
                onChange={handleBillingChange('title')}
                disabled={sameAs}
                error={Boolean(billingErrors.title)}
              />
            </FieldRow>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default PrimaryContactsSection;
