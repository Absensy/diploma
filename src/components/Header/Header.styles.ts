import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

// Стилизация кнопок меню Header (цвета из customTheme через theme.palette)
export const HeaderMenuButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  padding: 0,
  minWidth: 'auto',
  fontWeight: 500,
  fontSize: 16,
  color: theme.palette.text.primary,
  borderRadius: 6,
  transition: 'color 0.2s, background 0.2s',
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.secondary.main,
    boxShadow: 'none',
  },
  '&:active': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.dark,
    boxShadow: 'none',
  },
  '&:focus': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    boxShadow: 'none',
  },
}));




export default HeaderMenuButton;