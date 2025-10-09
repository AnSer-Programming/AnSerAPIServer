import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { useWizard } from '../context_API/WizardContext';

const BillingContactSection = ({ errors = {}, data }) => {
  const { formData, updateSection } = useWizard();

  const bc = data || {
    name: formData.companyInfo?.billingContact?.name || '',
    title: formData.companyInfo?.billingContact?.title || '',
    email: formData.companyInfo?.billingContact?.email || '',
    phone: formData.companyInfo?.billingContact?.phone || '',
    purchaseOrder:
      formData.companyInfo?.billingContact?.purchaseOrder ??
      formData.companyInfo?.billingContact?.po ??
      '',
    notes: formData.companyInfo?.billingContact?.notes || '',
  };

  const setField = (key, value) => {
    updateSection('companyInfo', {
      billingContact: { ...bc, [key]: value },
    });
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Billing Contact
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Full Name *"
            value={bc.name}
            onChange={(e) => setField('name', e.target.value)}
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Title / Role"
            value={bc.title}
            onChange={(e) => setField('title', e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Email *"
            type="email"
            inputMode="email"
            value={bc.email}
            onChange={(e) => setField('email', e.target.value)}
            fullWidth
            required
            error={!!errors.email}
            helperText={errors.email}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            inputMode="tel"
            value={bc.phone}
            onChange={(e) => setField('phone', e.target.value)}
            fullWidth
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Purchase Order (Optional)"
            value={bc.purchaseOrder}
            onChange={(e) => setField('purchaseOrder', e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Notes"
            value={bc.notes}
            onChange={(e) => setField('notes', e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default BillingContactSection;
