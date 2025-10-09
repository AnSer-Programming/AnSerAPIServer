import React from 'react';
import {
  Typography,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup
} from '@mui/material';
import { useWizard } from '../context_API/WizardContext';

const LEARN_SOURCES = [
  'Internet',
  'Word of Mouth',
  'Was Customer',
  'Company uses Services',
  'Social Media'
];

const AccountPreferencesSection = ({ errors = {} }) => {
  const { formData, updateSection } = useWizard();
  const prefs = formData.accountPreferences || {
    callVolume: '',
    callFrequency: 'Daily',
    learnSources: {},
    referral: '',
    reasonSwitch: '',
    otherLocations: 'No',
    spamVolume: 'No',
    marketingOptIn: 'No'
  };

  const setPrefs = (patch) => {
    updateSection('accountPreferences', { ...prefs, ...patch });
  };

  const toggleSource = (source) => {
    setPrefs({ learnSources: { ...prefs.learnSources, [source]: !prefs.learnSources[source] } });
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Account Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        These answers help us tailor staffing, reporting, and follow-up so your callers always receive the right experience.
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Anticipated Call Volume"
            fullWidth
            value={prefs.callVolume}
            onChange={(e) => setPrefs({ callVolume: e.target.value })}
            error={!!errors.callVolume}
            helperText={errors.callVolume || 'Example: 40-60 calls per day, heavier on Mondays.'}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <FormControl component="fieldset">
            <FormLabel component="legend">How often should we deliver summary updates?</FormLabel>
            <RadioGroup
              row
              value={prefs.callFrequency}
              onChange={(e) => setPrefs({ callFrequency: e.target.value })}
            >
              <FormControlLabel value="Daily" control={<Radio />} label="Daily" />
              <FormControlLabel value="Weekly" control={<Radio />} label="Weekly" />
              <FormControlLabel value="Monthly" control={<Radio />} label="Monthly" />
            </RadioGroup>
            <FormHelperText sx={{ mt: -0.5 }}>Choose the cadence that keeps your team informed without overwhelming inboxes.</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl component="fieldset" error={!!errors.learnSources} fullWidth>
            <FormLabel component="legend">How did you learn about AnSer?</FormLabel>
            <FormGroup row>
              {LEARN_SOURCES.map((src) => (
                <FormControlLabel
                  key={src}
                  control={
                    <Checkbox
                      checked={!!prefs.learnSources[src]}
                      onChange={() => toggleSource(src)}
                    />
                  }
                  label={src}
                />
              ))}
            </FormGroup>
            <FormHelperText>{errors.learnSources}</FormHelperText>
          </FormControl>
          <TextField
            label="Referral (who we should thank)"
            fullWidth
            value={prefs.referral}
            onChange={(e) => setPrefs({ referral: e.target.value })}
            sx={{ mt: 1 }}
            helperText="Optional — include a name so we can follow up with appreciation."
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Reason for Partnering with AnSer"
            fullWidth
            multiline
            rows={3}
            value={prefs.reasonSwitch}
            onChange={(e) => setPrefs({ reasonSwitch: e.target.value })}
            error={!!errors.reasonSwitch}
            helperText={errors.reasonSwitch || 'Share what success looks like so we can measure it with you.'}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Do you have other locations?</FormLabel>
            <RadioGroup
              row
              value={prefs.otherLocations}
              onChange={(e) => setPrefs({ otherLocations: e.target.value })}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Do you receive many spam/robocalls?</FormLabel>
            <RadioGroup
              row
              value={prefs.spamVolume}
              onChange={(e) => setPrefs({ spamVolume: e.target.value })}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Would you like occasional service updates from AnSer?</FormLabel>
            <RadioGroup
              row
              value={prefs.marketingOptIn}
              onChange={(e) => setPrefs({ marketingOptIn: e.target.value })}
            >
              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        You can update these preferences with us at any time — we're here to grow alongside your team.
      </Typography>
    </>
  );
};

export default AccountPreferencesSection;