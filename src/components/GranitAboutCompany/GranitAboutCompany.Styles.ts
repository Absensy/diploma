import { styled } from '@mui/material/styles';
import { Box, Typography, Container } from '@mui/material';

export const StyledContainer = styled(Container)(({ theme }) => ({
  padding: '80px 0',
  backgroundColor: theme.palette.background.default,
}));

export const ContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '60px',
  flexWrap: 'wrap',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: '40px',
  },
}));

export const TextSection = styled(Box)(({ theme }) => ({
  flex: '1',
  minWidth: '300px',
  maxWidth: '500px',
}));

export const Title = styled(Typography)(({ theme }) => ({
  fontSize: '48px',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  marginBottom: '32px',
  lineHeight: 1.2,
  [theme.breakpoints.down('md')]: {
    fontSize: '36px',
  },
}));

export const Description = styled(Typography)(({ theme }) => ({
  fontSize: '16px',
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
  marginBottom: '16px',
}));

export const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '40px',
  marginTop: '32px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '20px',
  },
}));

export const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
}));

export const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: '32px',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  lineHeight: 1,
}));

export const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  color: theme.palette.text.secondary,
  marginTop: '4px',
}));

export const ImageSection = styled(Box)(({ theme }) => ({
  flex: '1',
  minWidth: '300px',
  maxWidth: '500px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
}));

export const CraftsmanImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  display: 'block',
}));
