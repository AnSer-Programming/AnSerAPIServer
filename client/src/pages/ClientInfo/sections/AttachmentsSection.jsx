import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  IconButton,
  Chip,
  Tooltip,
  Alert,
  Divider,
} from '@mui/material';
import {
  UploadFile as UploadFileIcon,
  Delete as DeleteIcon,
  InfoOutlined,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

const formatBytes = (bytes = 0) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / (1024 ** exponent);
  return `${value.toFixed(value < 10 && exponent > 0 ? 1 : 0)} ${units[exponent]}`;
};

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB limit

const AttachmentsSection = ({ attachments = [], onChange = () => {}, errors = [] }) => {
  const theme = useTheme();
  const inputRef = React.useRef(null);
  const createdUrlsRef = React.useRef(new Set());
  const [localError, setLocalError] = React.useState('');

  const baseErrorMessage = React.useMemo(() => {
    if (!errors) return '';
    if (Array.isArray(errors)) {
      const firstEntry = errors.find(Boolean);
      if (firstEntry) {
        return Object.values(firstEntry).join(' • ');
      }
      return '';
    }
    if (typeof errors === 'object') {
      return Object.values(errors).join(' • ');
    }
    return typeof errors === 'string' ? errors : '';
  }, [errors]);

  const handleFileSelection = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      event.target.value = '';
      return;
    }

    const tooLarge = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (tooLarge.length) {
      setLocalError('Some files were skipped because they exceed the 25MB limit.');
    }

    const nextItems = files
      .filter((file) => file.size <= MAX_FILE_SIZE)
      .map((file) => {
      const tempUri = URL.createObjectURL(file);
      createdUrlsRef.current.add(tempUri);
      return {
        id: generateId(),
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        tempUri,
        lastModified: file.lastModified,
        placeholder: true,
      };
      });

    if (nextItems.length) {
      onChange([...attachments, ...nextItems]);
      setLocalError('');
    }
    event.target.value = '';
  };

  const handleRemove = (attachmentId) => {
    const target = attachments.find((item) => item.id === attachmentId);
    if (target?.tempUri && createdUrlsRef.current.has(target.tempUri)) {
      URL.revokeObjectURL(target.tempUri);
      createdUrlsRef.current.delete(target.tempUri);
    } else if (target?.tempUri && target.tempUri.startsWith('blob:')) {
      URL.revokeObjectURL(target.tempUri);
    }
    onChange(attachments.filter((item) => item.id !== attachmentId));
  };

  const triggerPicker = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  React.useEffect(() => () => {
    createdUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    createdUrlsRef.current.clear();
  }, []);

  const hasAttachments = Array.isArray(attachments) && attachments.length > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
        bgcolor: alpha(theme.palette.info.main, 0.04),
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Box
          sx={{
            p: 1,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.info.main, 0.15),
            color: theme.palette.info.main,
            display: 'flex',
          }}
        >
          <UploadFileIcon />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Supporting Attachments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload welcome packets, SOPs, or other helpful reference documents. Files stay local until submission.
          </Typography>
        </Box>
      </Stack>

      <input
        type="file"
        ref={inputRef}
        hidden
        multiple
        onChange={handleFileSelection}
      />

      {(localError || baseErrorMessage) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {localError || baseErrorMessage}
        </Alert>
      )}

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          onClick={triggerPicker}
          startIcon={<UploadFileIcon />}
          sx={{ borderRadius: 2 }}
        >
          Add Attachments
        </Button>
        <Tooltip title="We’ll add secure uploads in the backend. For now, files remain in your browser until you submit.">
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ color: 'text.secondary' }}>
            <InfoOutlined fontSize="small" />
            <Typography variant="caption">
              Files are stored temporarily (max 25MB each)
            </Typography>
          </Stack>
        </Tooltip>
      </Stack>

      {hasAttachments ? (
        <Stack spacing={1.5}>
          {attachments.map((item, index) => (
            <Paper
              key={item.id}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                borderColor: alpha(theme.palette.divider, 0.4),
                bgcolor: 'background.paper',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatBytes(item.size)} • {item.type || 'Unknown file type'}
                  </Typography>
                  {item.tempUri && (
                    <Chip
                      size="small"
                      label="Ready for upload"
                      color="info"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>
                <IconButton color="error" onClick={() => handleRemove(item.id)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
              {errors && Array.isArray(errors) && errors[index] && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {Object.values(errors[index]).join(' • ')}
                </Typography>
              )}
            </Paper>
          ))}
        </Stack>
      ) : (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            border: `1px dashed ${alpha(theme.palette.info.main, 0.4)}`,
            bgcolor: alpha(theme.palette.info.main, 0.08),
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No attachments added yet. Use the button above to include supporting documents.
          </Typography>
        </Box>
      )}

      {hasAttachments && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary">
            Pro tip: provide any SOPs, rosters, or escalation flowcharts that will help our team ramp up quickly.
          </Typography>
        </>
      )}
    </Paper>
  );
};

export default AttachmentsSection;
