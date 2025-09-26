import type { Components } from '@mui/material/styles';

const MuiButton: Components['MuiButton'] = {
  defaultProps: {
    disableElevation: true,
    variant: 'contained',
    color: 'primary',
  },
  styleOverrides: {
    root: {
      borderRadius: 8,
      fontWeight: 400,

    },
    sizeSmall: {
      height: 36,
      fontSize: '0.875rem',
    },
    sizeMedium: {
      height: 44,
      fontSize: '0.9375rem',

    },
    sizeLarge: {
      height: 52,
      fontSize: '1rem',
      paddingInline: 22,
    },
    contained: {
      boxShadow: 'none',
      '&:hover': { boxShadow: 'none' },
    },
    outlined: {
      borderWidth: 2,
      '&:hover': {
        borderWidth: 2,
      },
    },
  },
};

export default { MuiButton } as Components;

