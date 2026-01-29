import React, { useEffect, useState, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useWizard } from '../context_API/WizardContext';
import { WIZARD_ROUTES } from '../constants/routes';
import { Box, CircularProgress, Typography, Button, Paper } from '@mui/material';
import { getInviteByToken } from '../context_API/mockInviteService';

export default function InviteLinkHandler() {
  const { token } = useParams();
  const history = useHistory();
  const { initializeFromInvite } = useWizard();
  const [status, setStatus] = useState('loading'); // loading | success | invalid
  const [inviteMeta, setInviteMeta] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    // Create new AbortController for this effect
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    async function fetchMeta() {
      try {
        const res = await getInviteByToken(token, { signal });
        if (signal.aborted) return;
        if (!res.ok) {
          setStatus('invalid');
          return;
        }
        setInviteMeta(res.data);
        setStatus('show');
      } catch (err) {
        if (signal.aborted || err.name === 'AbortError') return;
        setStatus('invalid');
      }
    }
    fetchMeta();

    return () => {
      // Abort any pending requests on cleanup
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [token, history, initializeFromInvite]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Invite link — AnSer Communications';
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; created = true; }
    meta.content = 'Open an invite link to initialize the AnSer intake wizard with pre-filled data.';
    if (created) document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      if (created && meta && meta.parentNode) meta.parentNode.removeChild(meta);
    };
  }, [token]);

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
          'company-info': WIZARD_ROUTES.COMPANY_INFO,
          'answer-calls': WIZARD_ROUTES.ANSWER_CALLS,
          'on-call-rotation': WIZARD_ROUTES.ON_CALL_ESCALATION,
          'on-call': WIZARD_ROUTES.ON_CALL,
          'escalation-details': WIZARD_ROUTES.ON_CALL_ESCALATION,
          review: WIZARD_ROUTES.REVIEW,
        };
        // default to company-info so tokens land on the first form page
        const dest = stepToPath[targetStep] || WIZARD_ROUTES.COMPANY_INFO;
        history.replace(dest);
      } catch (err) {
        setStatus('invalid');
      }
    };

    return (
      <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center', p: 2 }}>
        <Paper sx={{ p: { xs: 2, md: 3 }, maxWidth: 720 }} role="region" aria-labelledby="invite-title">
          <Typography id="invite-title" component="h1" variant="h6">You're invited to fill out the intake form</Typography>
          <Typography sx={{ mt: 1, fontWeight: 600 }}>{inviteMeta.inviterName || 'A team member'}</Typography>
          {inviteMeta.message && <Typography sx={{ mt: 1 }}>{inviteMeta.message}</Typography>}
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>This will open the intake wizard at <strong>{inviteMeta.targetStep || 'start'}</strong>.</Typography>

          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleProceed} aria-label="Accept and continue" aria-live="polite">Accept & Continue</Button>
            <Button onClick={() => history.replace('/ClientInfoReact')}>Cancel</Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return null; // success path immediately redirects
}
