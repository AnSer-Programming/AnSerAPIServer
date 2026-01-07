// src/pages/ClientInfo/components/InfoPagePreview.jsx
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Stack,
  Chip,
  Link,
  Alert,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

/**
 * InfoPagePreview - Shows how wizard data will appear in the final info pages
 * Mimics the format of the actual info pages shown to agents
 */
const InfoPagePreview = ({ formData }) => {
  const theme = useTheme();
  const { companyInfo = {}, onCall = {}, answerCalls = {} } = formData;

  // Helper to format office hours object into readable string
  const formatOfficeHours = (hoursObj) => {
    if (!hoursObj || typeof hoursObj !== 'object') return 'M-F 8:00am-5:00pm';

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayAbbrev = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };

    const schedule = days.map(day => {
      const dayData = hoursObj[day];
      if (!dayData) return null;
      if (dayData.closed) return { day, status: 'closed' };
      return { day, status: 'open', open: dayData.open, close: dayData.close };
    }).filter(Boolean);

    // Group consecutive days with same hours
    const groups = [];
    let currentGroup = null;

    for (const entry of schedule) {
      if (!currentGroup) {
        currentGroup = { start: entry.day, end: entry.day, ...entry };
      } else if (currentGroup.status === entry.status &&
                 currentGroup.open === entry.open &&
                 currentGroup.close === entry.close) {
        currentGroup.end = entry.day;
      } else {
        groups.push(currentGroup);
        currentGroup = { start: entry.day, end: entry.day, ...entry };
      }
    }
    if (currentGroup) groups.push(currentGroup);

    // Format groups into strings
    return groups.map(group => {
      const dayRange = group.start === group.end
        ? dayAbbrev[group.start]
        : `${dayAbbrev[group.start]}-${dayAbbrev[group.end]}`;

      if (group.status === 'closed') return `${dayRange}: Closed`;
      return `${dayRange}: ${group.open}-${group.close}`;
    }).join(', ') || 'Hours not set';
  };

  // Extract key information
  const businessName = companyInfo.businessName || 'Company Name';
  const businessType = answerCalls.businessType || 'Business Type';
  const location = `${companyInfo.physicalCity || 'City'}, ${companyInfo.physicalState || 'ST'}`;
  const officeHours = formatOfficeHours(companyInfo.officeHours);
  const timezone = companyInfo.timezone || 'Central';

  // Contact information
  const address = `${companyInfo.physicalLocation || '123 Main St'}`;
  const cityStateZip = `${companyInfo.physicalCity || 'City'}, ${companyInfo.physicalState || 'ST'} ${companyInfo.physicalPostalCode || '12345'}`;
  const officePhone = companyInfo.contactChannels?.[0]?.value || '555-555-5555';
  const faxNumber = companyInfo.contactChannels?.find(c => c.type === 'fax')?.value || '';
  const website = companyInfo.contactChannels?.find(c => c.type === 'website')?.value || '';

  // On-call team
  const teamMembers = onCall.team || [];
  const escalationSteps = onCall.escalation || [];

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          📄 Info Page Preview
        </Typography>
        <Typography variant="caption">
          This is how agents will see your information in the dispatch system.
        </Typography>
      </Alert>

      <Stack spacing={3}>
        {/* Page 1 - Overview */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            bgcolor: alpha(theme.palette.background.paper, 0.98),
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              color: theme.palette.primary.main,
              mb: 1,
            }}
          >
            {businessName}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: 'center',
              color: theme.palette.text.secondary,
              mb: 1,
            }}
          >
            {businessType}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: theme.palette.info.main,
              fontWeight: 600,
              mb: 2,
            }}
          >
            Location: {location}
          </Typography>

          <Box
            sx={{
              textAlign: 'center',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              py: 1,
              px: 2,
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Contact Dispatch Account
            </Typography>
            <Typography variant="caption">(Must Press F9 to Dispatch)</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 1 }}>
            Office Hours:
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {officeHours} ({timezone})
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This account is linked to an O/C Schedule
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Call Handling Rules */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Call Handling:
            </Typography>

            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label="All Calls During Office Hours"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
                <Typography variant="body2">(Y) Deliver to the Office</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="Routine" size="small" color="default" variant="outlined" />
                <Typography variant="body2">(Y) Hold for Auto-Email</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip label="Urgent" size="small" color="error" variant="outlined" />
                <Typography variant="body2">
                  (Y) Reach Appropriate O/C in O/C Schedule by Calling Down Appropriate O/C List Below
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Instruction Pages */}
          {answerCalls.businessType && (
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Instructions:
              </Typography>
              <Stack spacing={0.5}>
                <Link href="#" variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Info Page 2: Call Handling Instructions
                </Link>
                <Link href="#" variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Info Page 3: Department Directory
                </Link>
                {escalationSteps.length > 0 && (
                  <Link href="#" variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    Info Page 4: Escalation Matrix
                  </Link>
                )}
              </Stack>
            </Box>
          )}
        </Paper>

        {/* Page 2 - Escalation (HVAC Example) */}
        {teamMembers.length > 0 && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              border: `2px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              bgcolor: alpha(theme.palette.background.paper, 0.98),
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.warning.main,
                mb: 1,
              }}
            >
              Urgent Dispatch Instructions
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
              Contact information in directory
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
              On-Call Escalation Chain:
            </Typography>

            <Stack spacing={2}>
              {teamMembers.slice(0, 5).map((member, index) => (
                <Box key={member.id || index} sx={{ pl: 2, borderLeft: `3px solid ${theme.palette.primary.main}` }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {index + 1}) Text {member.name || 'Team Member'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Auto 10 Minute Cue for Confirmation
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {index + 1}) If N/A, Call {member.name || 'Team Member'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    If N/A, Imtc and Auto 10 Minute Cue is set
                  </Typography>
                </Box>
              ))}

              {teamMembers.length > 5 && (
                <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                  + {teamMembers.length - 5} more team members in escalation chain
                </Typography>
              )}

              <Box sx={{ pl: 2, borderLeft: `3px solid ${theme.palette.info.main}` }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {teamMembers.length + 1}) If no one has checked in, start calling other personnel that have HVAC
                  listed in the Area Field in the Directory until message delivered
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}

        {/* Page 9 - Office Information */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`,
            bgcolor: alpha(theme.palette.background.paper, 0.98),
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: theme.palette.success.main,
              mb: 2,
            }}
          >
            Office Information
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Address:
              </Typography>
              <Typography variant="body2">{address}</Typography>
              <Typography variant="body2">{cityStateZip}</Typography>
              <Link href="#" variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                Map to Office
              </Link>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Contact:
              </Typography>
              <Typography variant="body2">☎️ Office: {officePhone}</Typography>
              {faxNumber && <Typography variant="body2">📠 Fax: {faxNumber}</Typography>}
              {website && (
                <Link href={website} target="_blank" variant="body2" sx={{ display: 'block', mt: 0.5 }}>
                  Click Here for Website
                </Link>
              )}
            </Box>

            {companyInfo.primaryContact && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Office Contact(s):
                </Typography>
                <Typography variant="body2">{companyInfo.primaryContact.name || 'Primary Contact'}</Typography>
              </Box>
            )}

            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                Cue Info:
              </Typography>
              <Typography variant="body2">M-F at 7:31am - Messages Auto-Email</Typography>
            </Box>

            {onCall.scheduleType && (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Sups - O/C Info:
                </Typography>
                <Typography variant="body2">
                  {onCall.scheduleType === 'rotating' && 'Runs on rotating schedule'}
                  {onCall.scheduleType === 'fixed' && 'Fixed escalation order'}
                  {onCall.scheduleType === 'no-schedule' && 'Always reach primary contact'}
                </Typography>
              </Box>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

InfoPagePreview.propTypes = {
  formData: PropTypes.shape({
    companyInfo: PropTypes.object,
    onCall: PropTypes.object,
    answerCalls: PropTypes.object,
  }).isRequired,
};

export default InfoPagePreview;
