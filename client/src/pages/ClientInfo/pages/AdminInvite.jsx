import React, { useState, useEffect } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { createMockInvite, listMockInvites } from '../context_API/mockInviteService';
// Navbar handled by WizardLayout
// Footer handled by WizardLayout

// Simple passphrase protection for local dev. Change as needed.
const ADMIN_PASSPHRASE = 'letmein';

export default function AdminInvite() {
  const [authorized, setAuthorized] = useState(false);
  const [pass, setPass] = useState('');
  const [clientId, setClientId] = useState('client-local');
  const [targetStep, setTargetStep] = useState('company-info');
  const [inviterName, setInviterName] = useState('Demo Admin');
  const [message, setMessage] = useState('Please pre-fill your info');
  const [created, setCreated] = useState(null);
  const [list, setList] = useState(listMockInvites());

  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Admin Invite (dev) — AnSer Communications';
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; created = true; }
    meta.content = 'Development tool: create and manage mock invites for the ClientInfo wizard.';
    if (created) document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      if (created && meta && meta.parentNode) meta.parentNode.removeChild(meta);
    };
  }, []);

  const handleAuth = () => {
    if (pass === ADMIN_PASSPHRASE) setAuthorized(true);
    else alert('Wrong passphrase');
  };

  const handleCreate = async () => {
    const res = await createMockInvite({ clientId, targetStep, inviterName, message, formData: {} });
    if (res.ok) {
      setCreated(res);
      setList(listMockInvites());
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: { xs: 2, md: 3 } }} role="region" aria-labelledby="admininvite-title">
          {!authorized ? (
            <Box>
              <Typography id="admininvite-title" component="h1" variant="h6" sx={{ mb: 2 }}>Admin Invite (local)</Typography>
              <TextField label="Passphrase" value={pass} onChange={(e) => setPass(e.target.value)} />
              <Button sx={{ ml: 2 }} onClick={handleAuth}>Enter</Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 1 }}>Create Mock Invite</Typography>
              <TextField label="Client ID" value={clientId} onChange={(e) => setClientId(e.target.value)} sx={{ mr: 1, mb: 1 }} />
              <TextField label="Target Step" value={targetStep} onChange={(e) => setTargetStep(e.target.value)} sx={{ mr: 1, mb: 1 }} />
              <TextField label="Inviter Name" value={inviterName} onChange={(e) => setInviterName(e.target.value)} sx={{ mr: 1, mb: 1 }} />
              <TextField label="Message" value={message} onChange={(e) => setMessage(e.target.value)} sx={{ display: 'block', mb: 2, width: '100%' }} />
              <Button variant="contained" onClick={handleCreate}>Create Invite</Button>

              {created && (
                <Paper sx={{ p: 2, mt: 2 }}>
                  <Typography>Created token: {created.token}</Typography>
                  <Typography sx={{ wordBreak: 'break-all' }}>Link: {window.location.origin}/ClientInfoReact/invite/{created.token}</Typography>
                  <Button sx={{ mt: 1 }} onClick={() => window.open(`/ClientInfoReact/invite/${created.token}`, '_blank')}>Open Link</Button>
                </Paper>
              )}

              <Typography sx={{ mt: 3 }}>Existing mock invites</Typography>
              <List>
                {Object.keys(list).map((t) => (
                  <ListItem key={t} divider>
                    <ListItemText primary={t} secondary={`${list[t].clientId} → ${list[t].targetStep} | ${list[t].inviterName || ''}`} />
                    <Button onClick={() => window.open(`/ClientInfoReact/invite/${t}`, '_blank')}>Open</Button>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
