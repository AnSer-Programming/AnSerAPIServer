// src/pages/ClientInfo/sections/WebsiteAccessSection.jsx

import React, { useMemo, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Paper,
  Button,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormHelperText,
} from '@mui/material';
import { useWizard } from '../context_API/WizardContext';

const defaultSite = {
  url: '',
  username: '',
  password: '',
  notes: '',
};

const defaultState = {
  required: false,            // show/hide the whole section
  difficulty: 'unknown',      // 'easy' | 'hard' | 'unknown'
  sites: [{ ...defaultSite }],
  requiresLogin: null,
  requiresMFA: null,
  hasMFA: false,
  hasCAPTCHA: false,
  autoLogoutAggressive: false,
  testComplete: false,
  missingInfo: false,
};

export default function WebsiteAccessSection({ errors = {} }) {
  const { formData, updateSection } = useWizard();
  const companyInfo = formData.companyInfo || {};
  const waRaw = companyInfo.websiteAccess || {};

  const wa = useMemo(() => {
    const merged = {
      ...defaultState,
      ...waRaw,
    };

    if (!Array.isArray(merged.sites) || merged.sites.length === 0) {
      merged.sites = [{ ...defaultSite }];
    } else {
      merged.sites = merged.sites.map((site) => ({ ...defaultSite, ...site }));
    }

    if (merged.requiresMFA === null || merged.requiresMFA === undefined) {
      merged.requiresMFA = merged.hasMFA ?? false;
    }

    return merged;
  }, [waRaw]);

  const setWA = useCallback(
    (patch) => updateSection('companyInfo', { websiteAccess: { ...wa, ...patch } }),
    [wa, updateSection]
  );

  const setSite = useCallback(
    (idx, patch) => {
      const next = wa.sites.map((s, i) => (i === idx ? { ...s, ...patch } : s));
      setWA({ sites: next });
    },
    [wa.sites, setWA]
  );

  const addSite = () => setWA({ sites: [...wa.sites, { ...defaultSite }] });
  const removeSite = (idx) => setWA({ sites: wa.sites.filter((_, i) => i !== idx) });

  // If website access is required, flag as "missing" until at least one URL is present
  const isMissingCore = useMemo(() => {
    if (!wa.required || wa.requiresLogin === false) return false;
    return wa.sites.some((s) => !s.url?.trim());
  }, [wa]);

  // Smart suggestion: if user hasn't picked a difficulty yet and checks hard flags, suggest "hard"
  useEffect(() => {
    if (!wa.required) return;
    const anyHardFlag = wa.requiresMFA || wa.hasMFA || wa.hasCAPTCHA || wa.autoLogoutAggressive;
    if (wa.difficulty === 'unknown' && anyHardFlag) {
      setWA({ difficulty: 'hard' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wa.required, wa.difficulty, wa.requiresMFA, wa.hasMFA, wa.hasCAPTCHA, wa.autoLogoutAggressive]);

  const siteErrors = Array.isArray(errors.sites) ? errors.sites : [];

  return (
    <Paper variant="outlined" sx={{ mt: 3, p: 2.5, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#b00', mb: 1 }}>
        WEBSITE ACCESS
        <Typography component="span" sx={{ ml: 1, fontWeight: 500, color: 'text.secondary' }}>
          (if your team uses a website during calls)
        </Typography>
      </Typography>

      {/* Master toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={!!wa.required}
              onChange={(e) => {
                const next = e.target.checked;
                setWA(
                  next
                    ? { required: true }
                    : {
                        required: false,
                        requiresLogin: null,
                        requiresMFA: null,
                        hasMFA: false,
                        hasCAPTCHA: false,
                        autoLogoutAggressive: false,
                        testComplete: false,
                        missingInfo: false,
                        difficulty: 'unknown',
                        sites: [{ ...defaultSite }],
                      }
                );
              }}
            />
          }
          label="Use a website during calls"
        />
      </Box>

      {/* When enabled, show details */}
      {wa.required && (
        <>
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel sx={{ fontWeight: 700 }}>Do we need to log in?</FormLabel>
            <RadioGroup
              row
              value={wa.requiresLogin === true ? 'yes' : wa.requiresLogin === false ? 'no' : ''}
              onChange={(e) => {
                const next = e.target.value === 'yes';
                setWA({
                  requiresLogin: next,
                  // If logging in is not required, clear login-specific data
                  ...(next
                    ? {}
                    : {
                        requiresMFA: false,
                        hasMFA: false,
                        hasCAPTCHA: false,
                        autoLogoutAggressive: false,
                        testComplete: false,
                        missingInfo: false,
                        sites: [{ ...defaultSite }],
                      }),
                });
              }}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
            {errors.requiresLogin && (
              <FormHelperText error>{errors.requiresLogin}</FormHelperText>
            )}
          </FormControl>

          {wa.requiresLogin && (
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel sx={{ fontWeight: 700 }}>Does the log-in require MFA?</FormLabel>
              <RadioGroup
                row
                value={wa.requiresMFA === true ? 'yes' : wa.requiresMFA === false ? 'no' : ''}
                onChange={(e) => {
                  const next = e.target.value === 'yes';
                  setWA({ requiresMFA: next, hasMFA: next });
                }}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
              {errors.requiresMFA && (
                <FormHelperText error>{errors.requiresMFA}</FormHelperText>
              )}
            </FormControl>
          )}

          {/* Handling complexity */}
          <FormControl sx={{ mb: 2 }}>
            <FormLabel sx={{ fontWeight: 700 }}>Website Handling Complexity</FormLabel>
            <RadioGroup
              row
              value={wa.difficulty}
              onChange={(e) => setWA({ difficulty: e.target.value })}
            >
              <FormControlLabel
                value="easy"
                control={<Radio />}
                label="Web Easy"
              />
              <FormControlLabel
                value="hard"
                control={<Radio />}
                label="Web Hard"
              />
              <FormControlLabel
                value="unknown"
                control={<Radio />}
                label="Not sure yet"
              />
            </RadioGroup>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              <b>Web Easy</b>: username & password only; no MFA/CAPTCHA; stable session.{' '}
              <b>Web Hard</b>: MFA, CAPTCHA, SSO/VPN, or short auto-logout/complex flows.
            </Typography>
          </FormControl>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add each website your team will access and any quick notes to help our agents log in.
          </Typography>

          {wa.requiresLogin ? (
            <>
              {/* Sites list */}
              <Box sx={{ display: 'grid', gap: 2 }}>
                {wa.sites.map((site, idx) => {
                  const siteError = siteErrors[idx] || {};
                  return (
                    <Paper key={idx} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={7}>
                          <TextField
                            label="Website URL"
                            value={site.url}
                            onChange={(e) => setSite(idx, { url: e.target.value })}
                            fullWidth
                            placeholder="https://example.com/portal"
                            error={Boolean(siteError.url)}
                            helperText={siteError.url || ''}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <TextField
                            label="Username"
                            value={site.username}
                            onChange={(e) => setSite(idx, { username: e.target.value })}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12} md={2}>
                          <TextField
                            label="Password"
                            type="password"
                            value={site.password}
                            onChange={(e) => setSite(idx, { password: e.target.value })}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Notes or login steps"
                            value={site.notes}
                            onChange={(e) => setSite(idx, { notes: e.target.value })}
                            fullWidth
                            multiline
                            minRows={2}
                            placeholder="e.g., click ‘Client Login’, accept banner, then go to Messages → All"
                          />
                        </Grid>
                      </Grid>

                      {wa.sites.length > 1 && (
                        <Button color="error" size="small" sx={{ mt: 1 }} onClick={() => removeSite(idx)}>
                          Remove site
                        </Button>
                      )}
                    </Paper>
                  );
                })}

                <Button variant="outlined" onClick={addSite}>Add another website</Button>
              </Box>

              <Divider sx={{ my: 2 }} />
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No login credentials required. Share any relevant notes above and we’ll follow the on-call instructions.
            </Typography>
          )}

          {/* Quick flags / status */}
          <Grid container spacing={2}>
            <Grid item xs={12} md="auto">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!wa.hasCAPTCHA}
                    onChange={(e) => setWA({ hasCAPTCHA: e.target.checked })}
                    disabled={!wa.requiresLogin}
                  />
                }
                label="CAPTCHA present"
              />
            </Grid>
            <Grid item xs={12} md="auto">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!wa.autoLogoutAggressive}
                    onChange={(e) => setWA({ autoLogoutAggressive: e.target.checked })}
                    disabled={!wa.requiresLogin}
                  />
                }
                label="Aggressive auto-logout"
              />
            </Grid>
            <Grid item xs={12} md="auto">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!wa.testComplete}
                    onChange={(e) => setWA({ testComplete: e.target.checked })}
                    disabled={!wa.requiresLogin}
                  />
                }
                label="Login test completed"
              />
            </Grid>
            <Grid item xs={12} md="auto">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!wa.missingInfo || isMissingCore}
                    onChange={(e) => setWA({ missingInfo: e.target.checked })}
                  />
                }
                label="Info still missing"
              />
            </Grid>
          </Grid>
        </>
      )}
    </Paper>
  );
}
