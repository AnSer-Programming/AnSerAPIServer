// src/pages/ClientInfo/context_API/AnSerTheme.js
import { createTheme, alpha } from '@mui/material/styles';

export default function buildAnSerTheme(mode = 'light') {
  const isDark = mode === 'dark';

  const palette = isDark
    ? {
        mode: 'dark',
        primary: { main: '#1f5c84', dark: '#174a6b', light: '#2b6e9c', contrastText: '#e9f2fb' },
        secondary: { main: '#2b6e9c', contrastText: '#fff' },
        info: { main: '#4cc3ff' },
        warning: { main: '#f2be5a', contrastText: '#10202b' },
        error: { main: '#ff6b6b' },
        background: { default: '#0e1922', paper: '#15232d' },
        text: { primary: '#e6eef7', secondary: '#a9bdd1', disabled: '#7d93a9' },
        divider: alpha('#ffffff', 0.12),
      }
    : {
        mode: 'light',
        primary: { main: '#1f5c84', dark: '#174a6b', light: '#2b6e9c', contrastText: '#ffffff' },
        secondary: { main: '#2b6e9c', contrastText: '#ffffff' },
        info: { main: '#0ea5e9' },
        warning: { main: '#f2be5a', contrastText: '#10202b' },
        error: { main: '#b00020' },
        background: { default: '#f5f7fb', paper: '#ffffff' },
        text: { primary: '#10212b', secondary: '#4b6478', disabled: '#94a3b8' },
        divider: alpha('#0b2942', 0.12),
      };

  return createTheme({
    palette,
    shape: { borderRadius: 10 },

    components: {
      // Neutral papers in dark mode; kill gradients/shadows that reduce contrast
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },

      // Tables & cells: stronger head contrast + subtler borders
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor: palette.divider,
          },
          head: {
            color: palette.text.secondary,
            backgroundColor: isDark ? alpha('#ffffff', 0.06) : '#f7f9fa',
            fontWeight: 700,
          },
        },
      },

      // Inputs (TextField/Select)
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: palette.text.secondary,
            '&.Mui-disabled': { color: palette.text.disabled },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            color: palette.text.primary,
            backgroundColor: isDark ? alpha('#ffffff', 0.06) : '#fff',
            borderRadius: 8,
          },
          input: {
            '::placeholder': { color: palette.text.secondary, opacity: 1 },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: alpha(palette.text.primary, isDark ? 0.23 : 0.18),
          },
          root: {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(palette.text.primary, isDark ? 0.34 : 0.30),
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: palette.info.main,
            },
            '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
              borderColor: alpha(palette.text.disabled, 0.3),
            },
          },
        },
      },

      // Controls
      MuiCheckbox: { styleOverrides: { root: { color: palette.text.secondary } } },
      MuiRadio: { styleOverrides: { root: { color: palette.text.secondary } } },

      // Dividers
      MuiDivider: { styleOverrides: { root: { borderColor: palette.divider } } },

      // Buttons: stronger weight for visibility
      MuiButton: { styleOverrides: { root: { fontWeight: 700 } } },
    },
  });
}
