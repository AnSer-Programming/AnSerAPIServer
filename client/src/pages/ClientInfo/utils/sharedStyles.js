// 📁 src/pages/ClientInfo/utils/sharedStyles.js
// Shared styling utilities for consistent theming across ClientInfo components

import { alpha } from '@mui/material/styles';

export const createSharedStyles = (theme, darkMode = false) => {
  // Ensure theme has required structure
  if (!theme || !theme.palette) {
    console.warn('Invalid theme object passed to createSharedStyles');
    return {
      layout: { pageWrapper: {}, wizardCard: {}, containerSpacing: {} },
      navigation: { container: {}, backButton: {}, nextButtonGroup: {}, saveButton: {}, nextButton: {} },
      softBg: () => ({}),
      inputBg: {},
      card: () => ({}),
      errorCard: {},
      formSection: {},
      buttonGroup: {},
    };
  }

  const softBg = (color) => {
    const colorMain = theme.palette[color]?.main || theme.palette.primary?.main || '#1976d2';
    return darkMode ? alpha(colorMain, 0.12) : alpha(colorMain, 0.06);
  };
  
  const inputBg = darkMode ? alpha('#fff', 0.06) : (theme.palette.common?.white || '#ffffff');
  
  const card = (color = 'primary', variant = 'default') => {
    const colorMain = theme.palette[color]?.main || theme.palette.primary?.main || '#1976d2';
    const baseCard = {
      p: 2,
      borderRadius: 2,
      border: `1px solid ${alpha(colorMain, 0.25)}`,
      bgcolor: softBg(color),
    };
    
    if (variant === 'outlined') {
      return {
        ...baseCard,
        border: `1px solid ${theme.palette.divider || '#e0e0e0'}`,
        bgcolor: 'background.paper',
      };
    }
    
    return baseCard;
  };
  
  const errorCard = {
    p: 2,
    borderRadius: 2,
    border: `1px solid ${alpha(theme.palette.error?.main || '#d32f2f', 0.5)}`,
    bgcolor: alpha(theme.palette.error?.main || '#d32f2f', 0.08),
  };
  
  const formSection = {
    p: { xs: 2, md: 3 },
    mb: 3,
    borderRadius: 2,
  };
  
  const buttonGroup = {
    display: 'flex',
    justifyContent: 'space-between',
    mt: 3,
    gap: 2,
    flexWrap: 'wrap',
  };

  const layout = {
    pageWrapper: {
      minHeight: '100vh',
      bgcolor: 'background.default',
    },
    containerSpacing: {
      py: { xs: 2, md: 3 },
    },
    wizardCard: {
      p: { xs: 2, md: 3 },
      borderRadius: 2,
    },
  };

  const navigation = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      mt: 2,
      gap: 2,
      flexWrap: 'wrap',
    },
    backButton: {
      minWidth: 100,
    },
    nextButtonGroup: {
      display: 'flex',
      gap: 1,
    },
    saveButton: {
      minWidth: 80,
    },
    nextButton: {
      minWidth: 120,
    },
  };

  return {
    softBg,
    inputBg,
    card,
    errorCard,
    formSection,
    buttonGroup,
    layout,
    navigation,
  };
};

export const getValidationSeverity = (errors) => {
  if (!errors || Object.keys(errors).length === 0) return 'success';
  return 'error';
};

export const formatValidationMessage = (errors, successMessage = 'Saved successfully!') => {
  if (!errors || Object.keys(errors).length === 0) return successMessage;
  return 'Please fix the validation errors before continuing.';
};
