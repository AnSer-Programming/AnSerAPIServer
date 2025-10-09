import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useWizard } from '../context_API/WizardContext';
import { Box, CircularProgress, Typography, Button, Paper } from '@mui/material';
import { getInviteByToken } from '../context_API/mockInviteService';

export default function InviteLinkHandler() {
  const { token } = useParams();
  const history = useHistory();
  const { initializeFromInvite } = useWizard();
  const [status, setStatus] = useState('loading'); // loading | success | invalid
  const [inviteMeta, setInviteMeta] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchMeta() {
      try {
        const res = await getInviteByToken(token);
        if (!mounted) return;
        if (!res.ok) {
          setStatus('invalid');
          return;
        }
        setInviteMeta(res.data);
        setStatus('show');
      } catch (err) {
        if (!mounted) return;
        setStatus('invalid');
      }
    }
    fetchMeta();
    return () => {
      mounted = false;
    };
  }, [token, history, initializeFromInvite]);

  if (status === 'loading') {
    return (
      <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Resolving invite link…</Typography>
        </Box>
      </Box>
    );
  }

  if (status === 'invalid') {
    return (
      <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center', p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Invalid or expired invite link</Typography>
        <Typography sx={{ mb: 2, color: 'text.secondary' }}>
          The link may have expired or been used already.
        </Typography>
        <Button variant="contained" onClick={() => history.replace('/ClientInfoReact')}>
          Go to Client Info
        </Button>
      </Box>
    );
  }

  if (status === 'show' && inviteMeta) {
    const handleProceed = async () => {
      setStatus('loading');
      try {
        const targetStep = await initializeFromInvite(token);
        const stepToPath = {
          'company-info': '/ClientInfoReact/NewFormWizard/company-info',
          'answer-calls': '/ClientInfoReact/NewFormWizard/answer-calls',
          'office-reach': '/ClientInfoReact/NewFormWizard/office-reach',
          'on-call': '/ClientInfoReact/NewFormWizard/on-call',
          review: '/ClientInfoReact/NewFormWizard/review',
        };
        // default to company-info so tokens land on the first form page
        const dest = stepToPath[targetStep] || '/ClientInfoReact/NewFormWizard/company-info';
        history.replace(dest);
      } catch (err) {
        setStatus('invalid');
      }
    };

    return (
      <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center', p: 2 }}>
        <Paper sx={{ p: 3, maxWidth: 720 }}>
          <Typography variant="h6">You're invited to fill out the intake form</Typography>
          <Typography sx={{ mt: 1, fontWeight: 600 }}>{inviteMeta.inviterName || 'A team member'}</Typography>
          {inviteMeta.message && <Typography sx={{ mt: 1 }}>{inviteMeta.message}</Typography>}
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>This will open the intake wizard at <strong>{inviteMeta.targetStep || 'start'}</strong>.</Typography>

          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleProceed}>Accept & Continue</Button>
            <Button onClick={() => history.replace('/ClientInfoReact')}>Cancel</Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return null; // success path immediately redirects
}
