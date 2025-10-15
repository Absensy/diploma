'use client';

import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export interface OurServicesCardProps {
    image: string;
    name: string;
    subtext: string;
}

export const ServicesCard = styled(Box)(({ theme }) => ({
    display: 'grid',
    backgroundColor: theme.palette.background.paper,
    width: '395px',
    height: '302px',
    borderRadius: 16, 
    textAlign: 'center',
    alignContent: 'center',
    transition: 'background-color 0.2s',
    boxShadow: '0 25px 50px 0 rgba(0, 0, 0, 0.08)',
    '&:hover': {
        backgroundColor: '#f3f3f3',
    },
}));
