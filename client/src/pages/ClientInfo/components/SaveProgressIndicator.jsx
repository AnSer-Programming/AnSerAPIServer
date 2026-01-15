import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  LinearProgress,
  Typography,
  Chip,
  Fade,
  Tooltip,
  useTheme,
} from '@mui/material';
import { CheckCircle, Save, PendingActions, Error } from '@mui/icons-material';

/**
 * Progressive form saving indicator component
 * Shows save status and progress across wizard steps
 */
const SaveProgressIndicator = ({ 
  saveStatus = 'idle', // 'idle', 'saving', 'saved', 'error'
  completionPercentage = 0,
  lastSavedTime,
  showDetails = false 
}) => {
  const theme = useTheme();
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    if (saveStatus === 'saving') {
      setShowProgress(true);
    } else {
      const timer = setTimeout(() => setShowProgress(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const getStatusConfig = () => {
    switch (saveStatus) {
      case 'saving':
        return {
          icon: <Save sx={{ fontSize: 16 }} />,
          color: 'primary',
          label: 'Saving...',
          bgColor: theme.palette.primary.light,
        };
      case 'saved':
        return {
          icon: <CheckCircle sx={{ fontSize: 16 }} />,
          color: 'success',
          label: 'Saved',
          bgColor: theme.palette.success.light,
        };
      case 'error':
        return {
          icon: <Error sx={{ fontSize: 16 }} />,
          color: 'error',
          label: 'Save Error',
          bgColor: theme.palette.error.light,
        };
      default:
        return {
          icon: <PendingActions sx={{ fontSize: 16 }} />,
          color: 'default',
          label: 'Draft',
          bgColor: theme.palette.grey[300],
        };
    }
  };

  const statusConfig = getStatusConfig();
  const isActive = saveStatus !== 'idle';

  const formatLastSaved = () => {
    if (!lastSavedTime) return null;
    const now = new Date();
    const diff = Math.floor((now - lastSavedTime) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <Box sx={{ 
      position: 'fixed', 
      top: 16, 
      right: 16, 
      zIndex: 1300,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 1
    }}>
      {/* Progress Bar */}
      <Fade in={showProgress || saveStatus === 'saving'}>
        <Box sx={{ 
          width: 200, 
          bgcolor: 'background.paper',
          borderRadius: 1,
          p: 1,
          boxShadow: 1
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
            Form Progress: {Math.round(completionPercentage)}%
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={completionPercentage}
            sx={{ 
              height: 6,
              borderRadius: 3,
              bgcolor: theme.palette.grey[200],
              '& .MuiLinearProgress-bar': {
                borderRadius: 3
              }
            }}
          />
        </Box>
      </Fade>

      {/* Status Indicator */}
      <Fade in={isActive}>
        <Tooltip 
          title={
            <Box>
              <Typography variant="body2">
                {statusConfig.label}
              </Typography>
              {lastSavedTime && (
                <Typography variant="caption" color="inherit">
                  Last saved: {formatLastSaved()}
                </Typography>
              )}
            </Box>
          }
          arrow
          placement="left"
        >
          <Chip
            icon={statusConfig.icon}
            label={showDetails ? statusConfig.label : ''}
            color={statusConfig.color}
            variant={saveStatus === 'saving' ? 'filled' : 'outlined'}
            size="small"
            sx={{
              bgcolor: saveStatus === 'saving' ? statusConfig.bgColor : 'transparent',
              '& .MuiChip-icon': {
                color: theme.palette[statusConfig.color]?.main || theme.palette.grey[600]
              },
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        </Tooltip>
      </Fade>
    </Box>
  );
};

SaveProgressIndicator.propTypes = {
  saveStatus: PropTypes.oneOf(['idle', 'saving', 'saved', 'error']),
  completionPercentage: PropTypes.number,
  lastSavedTime: PropTypes.instanceOf(Date),
  showDetails: PropTypes.bool,
};

export default SaveProgressIndicator;
