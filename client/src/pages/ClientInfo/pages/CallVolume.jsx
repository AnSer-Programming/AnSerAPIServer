import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Fade,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useTheme, alpha } from '@mui/material/styles';
import NavigateBeforeRounded from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRounded from '@mui/icons-material/NavigateNextRounded';
import SaveOutlined from '@mui/icons-material/SaveOutlined';

import ClientInfoNavbar from '../shared_layout_routing/ClientInfoNavbar';
import ClientInfoFooter from '../shared_layout_routing/ClientInfoFooter';
import CallVolumeSection from '../components/CallVolumeSection';
import { useClientInfoTheme } from '../context_API/ClientInfoThemeContext';
import { useWizard } from '../context_API/WizardContext';
import { WIZARD_ROUTES } from '../constants/routes';

const CallVolume = () => {
  const theme = useTheme();
  const history = useHistory();
  const { darkMode } = useClientInfoTheme();
  const { getSection, updateSection, validateSection, markStepVisited } = useWizard();

  const metrics = getSection('metrics');
  const callVolume = metrics.callVolume || {};

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const setCallVolume = (next) => {
    updateSection('metrics', { callVolume: next });
  };

  const handleSave = () => {
    markStepVisited('call-volume');
    setToast({ open: true, message: 'Call volume details saved.', severity: 'success' });
  };

  const handleNext = () => {
    const validation = validateSection('metrics.callVolume', callVolume);
    if (validation) {
      setErrors(validation);
      setToast({ open: true, message: 'Finish the highlighted call volume fields before continuing.', severity: 'error' });
      return;
    }

    setErrors({});
    markStepVisited('call-volume');
    history.push(WIZARD_ROUTES.ANSWER_CALLS);
  };

  const handleBack = () => {
    history.push(WIZARD_ROUTES.OFFICE_REACH);
  };

  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));

  const bannerBg = alpha(theme.palette.secondary.main, darkMode ? 0.2 : 0.08);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: darkMode ? 'background.default' : '#f4f6fb' }}>
      <ClientInfoNavbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in timeout={600}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
                bgcolor: bannerBg,
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.secondary.main, mb: 1 }}>
                Call Volume & Traffic Forecast
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We’ll pair these trends with staffing data so Ryan’s team can finalize coverage before go-live.
              </Typography>
            </Paper>

            <CallVolumeSection value={callVolume} onChange={setCallVolume} errors={errors} />

            <Paper
              elevation={1}
              sx={{
                p: 3,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                bgcolor: darkMode ? theme.palette.grey[900] : theme.palette.background.paper,
                borderRadius: 2,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<NavigateBeforeRounded />}
                onClick={handleBack}
                sx={{ minWidth: 140 }}
              >
                Back: Office Reach
              </Button>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<SaveOutlined />}
                  onClick={handleSave}
                >
                  Save Draft
                </Button>
                <Button
                  variant="contained"
                  endIcon={<NavigateNextRounded />}
                  onClick={handleNext}
                  sx={{ minWidth: 180, fontWeight: 600 }}
                >
                  Next: Answer Calls
                </Button>
              </Stack>
            </Paper>
          </Stack>
        </Fade>
      </Container>

      <ClientInfoFooter />

      <Snackbar
        open={toast.open}
        autoHideDuration={2600}
        onClose={closeToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CallVolume;
